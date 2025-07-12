import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateCreatorDto } from '../../interfaces/dto/create-creator.dto';
import { UserRepository } from '../../infrastructure/database/user.repository';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRole } from '../../domain/enums/user-role.enum';

@Injectable()
export class CreatorService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Crea un nuevo usuario con rol CREATOR
   * - Valida que el correo no esté en uso
   * - Hashea la contraseña
   * - Asigna plan y créditos iniciales
   */
  async create(dto: CreateCreatorDto): Promise<UserEntity> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Ya existe un usuario con este correo');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUserData: Partial<UserEntity> = {
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: UserRole.CREATOR,
      plan: 'CREATOR',
      credits: 150, // Créditos iniciales del plan CREATOR
      createdAt: new Date(),
    };

    return await this.userRepository.save(newUserData);
  }

  /**
   * Lista todos los usuarios con rol CREATOR
   */
  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.findAllByRole(UserRole.CREATOR);
  }
}
