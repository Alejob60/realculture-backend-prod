import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Match } from '../../common/validators/Match';

export class RegisterRequestDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name: string;

  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  lastName: string;

  @IsEmail({}, { message: 'Debe ser un correo válido' })
  email: string;

  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @Match('password', { message: 'Las contraseñas no coinciden' })
  confirmPassword: string;
}
