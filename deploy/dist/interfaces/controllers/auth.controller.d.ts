import { AuthService } from '../../infrastructure/services/auth.service';
import { RegisterRequestDto } from '../dto/register-request.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { LoginRequestDto } from '../dto/login-request.dto';
import { UserService } from 'src/infrastructure/services/user.service';
export declare class AuthController {
    private readonly authService;
    private readonly userService;
    constructor(authService: AuthService, userService: UserService);
    register(body: RegisterRequestDto): Promise<AuthResponseDto>;
    login(loginDto: LoginRequestDto): Promise<AuthResponseDto>;
    loginWithGoogle(body: {
        token: string;
    }): Promise<AuthResponseDto>;
    getProfile(req: {
        user: {
            userId: string;
        };
    }): Promise<{
        userId: string;
        email: string;
        name: string | undefined;
        role: import("../../domain/enums/user-role.enum").UserRole;
        plan: import("../../domain/enums/user-role.enum").UserRole;
        credits: number;
        picture: null;
    }>;
}
