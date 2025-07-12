import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';

import { UserRepository } from '../database/user.repository';
import { LoginRequestDto } from '../../interfaces/dto/login-request.dto';
import { RegisterRequestDto } from '../../interfaces/dto/register-request.dto';
import { AuthResponseDto } from '../../interfaces/dto/auth-response.dto';
import { UserRole } from 'src/domain/enums/user-role.enum';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepo: UserRepository,
  ) {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    
    // Inicializa cliente de Google
  }

  /**
   * Valida al usuario con email y contraseña y genera un token JWT.
   * @param body Datos del login (email y contraseña)
   * @returns El token y la información del usuario.
   */
  async validateUserAndGenerateToken(
    body: LoginRequestDto,
  ): Promise<AuthResponseDto> {
    const user = await this.userRepo.findByEmail(body.email);
    if (!user) {
      throw new UnauthorizedException('Correo no registrado');
    }

    if (!user.password) {
      throw new UnauthorizedException(
        'Este usuario debe iniciar sesión con Google',
      );
    }

    const passwordMatches = await bcrypt.compare(body.password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const token = this.jwtService.sign({
      sub: user.userId,
      email: user.email,
      name: user.name ?? 'Usuario sin nombre',
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

  /**
   * Registra un nuevo usuario en el sistema.
   * @param body Datos del registro (nombre, email, contraseña)
   * @returns El token y la información del usuario registrado.
   */
  async register(body: RegisterRequestDto): Promise<AuthResponseDto> {
    const existing = await this.userRepo.findByEmail(body.email);
    if (existing) {
      throw new ConflictException('Este correo ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const newUser = await this.userRepo.save({
      name: body.name,
      email: body.email,
      password: hashedPassword,
      role: UserRole.CREATOR,
      credits: 100, // Asignar créditos iniciales
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

  /**
   * Autentica al usuario usando un token de Google.
   * @param idToken Token de autenticación de Google
   * @returns El token JWT y la información del usuario autenticado
   */
  async loginWithGoogle(idToken: string): Promise<AuthResponseDto> {
    console.log('🔑 Recibiendo token de Google:', idToken); // Log para ver el token recibido

    try {
      // Verifica el token de Google con el cliente OAuth2
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      console.log('🔑 Payload del token de Google:', payload); // Log para ver el payload

      const email = payload?.email;
      const name = payload?.name ?? 'Usuario RealCulture';
      const avatar = payload?.picture ?? '';
      const googleId = payload?.sub;

      if (!email) {
        console.error('❌ Correo no disponible en el token de Google');
        throw new UnauthorizedException('Correo no disponible en token de Google');
      }

      // Buscar al usuario en la base de datos por el email
      let user = await this.userRepo.findByEmail(email);
      console.log('🔑 Usuario encontrado:', user);

      if (!user) {
        console.log('🔑 Usuario no encontrado, creando uno nuevo...');
        // Si el usuario no existe, crearlo
        user = await this.userRepo.save({
          email,
          name,
          avatar,
          googleId,
          role: UserRole.FREE,  // Asignar rol predeterminado
          credits: 100,  // Asignar créditos iniciales
        });
      }

      console.log('🔑 Usuario autenticado correctamente:', user);
      // Genera un JWT para el usuario
      const token = this.jwtService.sign({
        sub: user.userId,
        email: user.email,
        name: user.name ?? 'Usuario sin nombre',
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
    } catch (error) {
      console.error('[Google Login Error]', error); // Log para el error
      throw new UnauthorizedException('Token de Google inválido');
    }
  }
}
