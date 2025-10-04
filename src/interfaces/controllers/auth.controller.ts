import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  HttpException,
<<<<<<< Updated upstream
=======
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  ConflictException,
>>>>>>> Stashed changes
} from '@nestjs/common';
import { AuthService } from '../../infrastructure/services/auth.service';
import { RegisterRequestDto } from '../dto/register-request.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { LoginRequestDto } from '../dto/login-request.dto';
import { JwtAuthGuard } from '../../interfaces/guards/jwt-auth.guard';
import { UserService } from 'src/infrastructure/services/user.service';
import { LoginUseCase } from 'src/application/use-cases/login.use-case';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post('register')
  async register(@Body() body: RegisterRequestDto): Promise<AuthResponseDto> {
<<<<<<< Updated upstream
    return this.authService.register(body);
=======
    console.log('🔐 [REGISTER] Intentando registrar usuario:', body.email);
    try {
      const response = await this.authService.register(body);
      console.log('✅ [REGISTER] Usuario creado:', response.email);
      return response;
    } catch (error) {
      console.error('❌ [REGISTER] Error:', error.message);
      throw error;
    }
  }

  @Post('sync')
  async syncUser(@Body() body: { email: string; name?: string; avatar?: string }) {
    const { email, name, avatar } = body;
    console.log('🔁 [SYNC] Verificando usuario:', email);

    if (!email) throw new BadRequestException('Email es obligatorio');

    try {
      let user = await this.userService.findByEmail(email);
      if (!user) {
        console.log('🆕 [SYNC] Usuario no encontrado, creando uno nuevo...');
        user = await this.userService.createUser({
          email,
          name: name ?? 'Usuario RealCulture',
          avatar: avatar ?? '',
          googleId: undefined,
          role: UserRole.FREE,
          credits: 25,
        });
        console.log('✅ [SYNC] Usuario creado:', user.email);
      } else {
        console.log('🔄 [SYNC] Usuario existente:', user.email);
      }

      return {
        userId: user.userId,
        email: user.email,
        name: user.name,
        role: user.role,
        credits: user.credits,
        avatar: user.avatar,
        plan: user.plan,
      };
    } catch (error) {
      console.error('❌ [SYNC] Error:', error.message);
      throw error;
    }
>>>>>>> Stashed changes
  }

  @Post('login')
  async login(@Body() loginDto: LoginRequestDto) {
<<<<<<< Updated upstream
    console.log('🟡 Intentando login con:', loginDto.email);
    return this.loginUseCase.execute(loginDto);
  }

  @Post('google-login')
  async loginWithGoogle(@Body() body: { token: string }) {
    return this.authService.loginWithGoogle(body.token);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: { user: { userId: string } }) {
    const user = await this.userService.findById(req.user.userId);
    if (!user) {
      throw new HttpException('Usuario no encontrado', 404);
=======
    const { email, password } = loginDto;
    console.log('🔑 [LOGIN] Intento de login para:', email);

    if (!email || !password) {
      console.warn('⚠️ [LOGIN] Faltan credenciales');
      throw new BadRequestException('Email y contraseña son obligatorios');
    }

    try {
      const response = await this.authService.validateUserAndGenerateToken(loginDto);
      console.log('✅ [LOGIN] Usuario autenticado:', response.email);
      return response;
    } catch (error) {
      console.error('❌ [LOGIN] Error de autenticación:', error.message);
      throw new UnauthorizedException('Credenciales inválidas');
    }
  }

  @Post('google-login')
  async loginWithGoogle() {
    console.warn('⚠️ [GOOGLE LOGIN] Endpoint temporalmente deshabilitado');
    throw new UnauthorizedException('Login con Google deshabilitado temporalmente');
  }

  @Get('me')
  //@UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: { user: { userId: string } }) {
    console.log('🔎 [ME] Cargando perfil para ID:', req.user.userId);

    try {
      const user = await this.userService.findById(req.user.userId);
      if (!user) {
        console.error('❌ [ME] Usuario no encontrado');
        throw new NotFoundException('Usuario no encontrado');
      }

      console.log('✅ [ME] Perfil cargado:', user.email);
      return {
        userId: user.userId,
        email: user.email,
        name: user.name,
        role: user.role,
        plan: user.plan,
        credits: user.credits,
        avatar: user.avatar ?? null,
      };
    } catch (error) {
      console.error('❌ [ME] Error al cargar perfil:', error.message);
      throw error;
>>>>>>> Stashed changes
    }
    return {
      userId: user.userId,
      email: user.email,
      name: user.name,
      role: user.role,
      plan: user.role,
      credits: user.credits,
      picture: null,
    };
  }
}
