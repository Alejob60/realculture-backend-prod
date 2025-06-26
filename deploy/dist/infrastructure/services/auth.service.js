"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const google_auth_library_1 = require("google-auth-library");
const user_repository_1 = require("../database/user.repository");
const user_role_enum_1 = require("../../domain/enums/user-role.enum");
let AuthService = class AuthService {
    jwtService;
    userRepo;
    googleClient;
    constructor(jwtService, userRepo) {
        this.jwtService = jwtService;
        this.userRepo = userRepo;
        this.googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }
    async validateUserAndGenerateToken(body) {
        const user = await this.userRepo.findByEmail(body.email);
        if (!user) {
            throw new common_1.UnauthorizedException('Correo no registrado');
        }
        if (!user.password) {
            throw new common_1.UnauthorizedException('Este usuario debe iniciar sesión con Google');
        }
        const passwordMatches = await bcrypt.compare(body.password, user.password);
        if (!passwordMatches) {
            throw new common_1.UnauthorizedException('Contraseña incorrecta');
        }
        const token = this.jwtService.sign({
            sub: user.userId,
            email: user.email,
            name: user.name,
            role: user.role,
        });
        return {
            token,
            userId: user.userId,
            email: user.email,
            name: user.name ?? 'Usuario sin nombre',
            role: user.role,
            credits: user.credits,
        };
    }
    async register(body) {
        const existing = await this.userRepo.findByEmail(body.email);
        if (existing) {
            throw new common_1.ConflictException('Este correo ya está registrado');
        }
        const hashedPassword = await bcrypt.hash(body.password, 10);
        const newUser = await this.userRepo.save({
            name: body.name,
            email: body.email,
            password: hashedPassword,
            role: user_role_enum_1.UserRole.CREATOR,
            credits: 100,
        });
        const token = this.jwtService.sign({
            sub: newUser.userId,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
        });
        return {
            token,
            userId: newUser.userId,
            email: newUser.email,
            name: newUser.name ?? 'Usuario sin nombre',
            role: newUser.role,
            credits: newUser.credits,
        };
    }
    async loginWithGoogle(idToken) {
        try {
            const ticket = await this.googleClient.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            const email = payload?.email;
            const name = payload?.name ?? 'Usuario RealCulture';
            const googleId = payload?.sub;
            if (!email) {
                throw new common_1.UnauthorizedException('Correo no disponible en token de Google');
            }
            let user = await this.userRepo.findByEmail(email);
            if (!user) {
                user = await this.userRepo.save({
                    email,
                    name,
                    googleId,
                    role: user_role_enum_1.UserRole.FREE,
                    credits: 100,
                });
            }
            const token = this.jwtService.sign({
                sub: user.userId,
                email: user.email,
                name: user.name,
                role: user.role,
            });
            return {
                token,
                userId: user.userId,
                email: user.email,
                name: user.name ?? 'Usuario sin nombre',
                role: user.role,
                credits: user.credits,
            };
        }
        catch (error) {
            console.error('[Google Login Error]', error);
            throw new common_1.UnauthorizedException('Token de Google inválido');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        user_repository_1.UserRepository])
], AuthService);
//# sourceMappingURL=auth.service.js.map