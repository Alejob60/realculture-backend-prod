import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  HttpException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../../infrastructure/services/auth.service';
import { RegisterRequestDto } from '../dto/register-request.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { LoginRequestDto } from '../dto/login-request.dto';
import { JwtAuthGuard } from '../../interfaces/guards/jwt-auth.guard';
import { UserService } from 'src/infrastructure/services/user.service';
import { UserRole } from 'src/domain/enums/user-role.enum';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  // Endpoint para registrar un nuevo usuario
  @Post('register')
  async register(@Body() body: RegisterRequestDto): Promise<AuthResponseDto> {
    console.log('🔑 Intentando registrar nuevo usuario con email:', body.email);
    try {
      const response = await this.authService.register(body);
      console.log('✔️ Usuario registrado correctamente:', response);
      return response;
    } catch (error) {
      console.error('❌ Error al registrar el usuario:', error);
      throw error;
    }
  }
  // Endpoint para sincronizar el usuario con la base de datos desde NextAuth
  @Post('sync')
  async syncUser(@Body() body: { email: string; name?: string; avatar?: string }) {
    console.log('🔄 Intentando sincronizar usuario:', body.email);

    try {
      const { email, name, avatar } = body;

      if (!email) {
        throw new HttpException('Email es obligatorio', 400);
      }

      let user = await this.userService.findByEmail(email);

      if (!user) {
        console.log('🆕 Usuario no encontrado, creando uno nuevo...');

        user = await this.userService.createUser({
          email,
          name: name || 'Usuario RealCulture',
          avatar: avatar || '',
          googleId: null,
          role: UserRole.FREE, // O puedes usar `UserRole.FREE` si lo tienes definido
          credits: 25,
        });

        console.log('✅ Usuario creado exitosamente:', user);
      } else {
        console.log('🔁 Usuario encontrado:', user.email);
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
      console.error('❌ Error en /auth/sync:', error);
      throw error;
    }
  }

  // Endpoint para hacer login con email y contraseña
  @Post('login')
  async login(@Body() loginDto: LoginRequestDto) {
    console.log('🟡 Intentando login con email:', loginDto.email);
    try {
      const response = await this.authService.validateUserAndGenerateToken(loginDto);
      console.log('✔️ Login exitoso, generando token para el usuario:', response);
      return response;
    } catch (error) {
      console.error('❌ Error al intentar el login con email y contraseña:', error);
      throw new UnauthorizedException('Credenciales inválidas');
    }
  }

  // Endpoint para hacer login con Google (usando el token de Google)
  @Post('google-login')
  async loginWithGoogle(@Body() body: { idToken: string }) {
    console.log('🔑 Intentando login con token de Google:', body.idToken);

    try {
      // Llamamos al servicio para verificar el token de Google
      const user = await this.authService.loginWithGoogle(body.idToken);
      console.log('✔️ Usuario autenticado con Google:', user);
      return user;
    } catch (error) {
      console.error('❌ Error al autenticar con Google:', error);
      // Si el token es inválido o hay algún problema, lanzamos una excepción
      throw new UnauthorizedException('Token de Google inválido');
    }
  }

  // Endpoint para obtener el perfil del usuario autenticado
  @Get('me')
  @UseGuards(JwtAuthGuard)  // Asegura que el usuario esté autenticado
  async getProfile(@Req() req: { user: { userId: string } }) {
    console.log('🔑 Recuperando perfil para el usuario con ID:', req.user.userId);
    
    try {
      // Buscamos al usuario por su ID en la base de datos
      const user = await this.userService.findById(req.user.userId);
      
      if (!user) {
        console.error('❌ Usuario no encontrado con ID:', req.user.userId);
        throw new NotFoundException('Usuario no encontrado');
      }

      // Log para verificar los detalles del usuario
      console.log('✔️ Perfil de usuario recuperado correctamente:', user);

      return {
        userId: user.userId,
        email: user.email,
        name: user.name,
        role: user.role,
        plan: user.plan,
        credits: user.credits,
        avatar: user.avatar || null,  // Devuelve el avatar si está disponible (o null si no)
      };
    } catch (error) {
      console.error('❌ Error al recuperar el perfil del usuario:', error);
      throw error;
    }
  }
}
