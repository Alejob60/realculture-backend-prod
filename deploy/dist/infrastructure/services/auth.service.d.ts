import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../database/user.repository';
import { LoginRequestDto } from '../../interfaces/dto/login-request.dto';
import { RegisterRequestDto } from '../../interfaces/dto/register-request.dto';
import { AuthResponseDto } from '../../interfaces/dto/auth-response.dto';
export declare class AuthService {
    private readonly jwtService;
    private readonly userRepo;
    private googleClient;
    constructor(jwtService: JwtService, userRepo: UserRepository);
    validateUserAndGenerateToken(body: LoginRequestDto): Promise<AuthResponseDto>;
    register(body: RegisterRequestDto): Promise<AuthResponseDto>;
    loginWithGoogle(idToken: string): Promise<AuthResponseDto>;
}
