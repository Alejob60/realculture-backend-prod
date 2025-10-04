import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserRepository } from '../database/user.repository';
import { LoginRequestDto } from '../../interfaces/dto/login-request.dto';
import { RegisterRequestDto } from '../../interfaces/dto/register-request.dto';
import { AuthResponseDto } from '../../interfaces/dto/auth-response.dto';
import { UserRole } from 'src/domain/enums/user-role.enum';
import * as appInsights from 'applicationinsights';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepo: UserRepository,
<<<<<<< Updated upstream
  ) {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

=======
  ) {}

  /**
   * 🔐 Login tradicional con email y contraseña
   */
>>>>>>> Stashed changes
  async validateUserAndGenerateToken(
    body: LoginRequestDto,
  ): Promise<AuthResponseDto> {
    this.logger.log(`🔐 Validando login para: ${body.email}`);

    const user = await this.userRepo.findByEmail(body.email);
    if (!user) {
      this.logger.warn(`❌ Usuario no encontrado: ${body.email}`);
      throw new UnauthorizedException('Correo no registrado');
    }

    if (!user.password) {
      this.logger.warn(`⚠️ Usuario sin contraseña registrada: ${user.email}`);
      throw new UnauthorizedException('Este usuario debe iniciar sesión con Google');
    }

    const passwordMatches = await bcrypt.compare(body.password, user.password);
    if (!passwordMatches) {
      this.logger.warn(`❌ Contraseña incorrecta para: ${user.email}`);
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    // Validar presencia del JWT_SECRET
    if (!process.env.JWT_SECRET) {
      const error = new Error('Falta JWT_SECRET en el entorno');
      this.logger.error(error.message);
      appInsights.defaultClient.trackException({ exception: error });
      throw new InternalServerErrorException('Error interno del servidor');
    }

    const token = this.jwtService.sign({
      sub: user.userId,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    this.logger.log(`✅ Login exitoso: ${user.email}`);

    return {
      token,
      userId: user.userId,
      email: user.email,
      name: user.name ?? 'Usuario sin nombre',
      role: user.role,
      credits: user.credits ?? 0,
      avatar: user.avatar ?? undefined,
      plan: user.plan ?? 'FREE',
    };
  }

<<<<<<< Updated upstream
=======
  /**
   * 🆕 Registro de nuevos usuarios
   */
>>>>>>> Stashed changes
  async register(body: RegisterRequestDto): Promise<AuthResponseDto> {
    this.logger.log(`📝 Registro de nuevo usuario: ${body.email}`);

    const existing = await this.userRepo.findByEmail(body.email);
    if (existing) {
      this.logger.warn(`⚠️ Correo ya registrado: ${body.email}`);
      throw new ConflictException('Este correo ya está registrado');
    }

<<<<<<< Updated upstream
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const newUser = await this.userRepo.save({
      name: body.name,
      email: body.email,
      password: hashedPassword,
      role: UserRole.CREATOR,
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

  async loginWithGoogle(idToken: string): Promise<AuthResponseDto> {
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
        throw new UnauthorizedException(
          'Correo no disponible en token de Google',
        );
      }

      let user = await this.userRepo.findByEmail(email);

      if (!user) {
        user = await this.userRepo.save({
          email,
          name,
          googleId,
          role: UserRole.FREE,
          credits: 100,
        });
      }

      const token = this.jwtService.sign({
        sub: user.userId,
        email: user.email,
        name: user.name,
        role: user.role,
=======
    try {
      const hashedPassword = await bcrypt.hash(body.password, 10);
      const fullName = `${body.name} ${body.lastName}`.trim();

      const newUser = await this.userRepo.save({
        name: fullName || 'Usuario sin nombre',
        email: body.email,
        password: hashedPassword,
        role: UserRole.FREE,
        credits: 25,
        avatar: undefined,
        plan: 'FREE',
      });

      if (!process.env.JWT_SECRET) {
        const error = new Error('Falta JWT_SECRET en el entorno');
        this.logger.error(error.message);
        appInsights.defaultClient.trackException({ exception: error });
        throw new InternalServerErrorException('Error interno del servidor');
      }

      const token = this.jwtService.sign({
        sub: newUser.userId,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
>>>>>>> Stashed changes
      });

      this.logger.log(`✅ Registro exitoso: ${newUser.email}`);

      return {
        token,
        userId: newUser.userId,
        email: newUser.email,
        name: newUser.name ?? 'Usuario sin nombre',
        role: newUser.role,
        credits: newUser.credits ?? 0,
        avatar: newUser.avatar ?? undefined,
        plan: newUser.plan ?? 'FREE',
      };
    } catch (error) {
<<<<<<< Updated upstream
      console.error('[Google Login Error]', error);
      throw new UnauthorizedException('Token de Google inválido');
=======
      this.logger.error(`❌ Error al registrar: ${error.message}`);
      appInsights.defaultClient.trackException({ exception: error });
      throw new InternalServerErrorException('Error interno al registrar el usuario');
>>>>>>> Stashed changes
    }
  }

  /**
   * 🚫 Login con Google deshabilitado temporalmente
   */
  async loginWithGoogle(): Promise<AuthResponseDto> {
    this.logger.warn('⚠️ Login con Google deshabilitado');
    throw new UnauthorizedException('Login con Google deshabilitado');
  }
}
