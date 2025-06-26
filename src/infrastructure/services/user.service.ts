import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRole } from 'src/domain/enums/user-role.enum';

const PLAN_CREDITS = {
  'promo-image': {
    FREE: 10,
    CREATOR: 15,
    PRO: 10,
  },
  'promo-video': {
    FREE: 25,
    CREATOR: 25,
    PRO: 15,
  },
  audio: {
    FREE: 5,
    CREATOR: 5,
    PRO: 0,
  },
  subtitles: {
    FREE: 10,
    CREATOR: 10,
    PRO: 5,
  },
  'ai-agent': {
    FREE: null,
    CREATOR: 150,
    PRO: 150,
  },
  'campaign-automation': {
    FREE: null,
    CREATOR: 40,
    PRO: 20,
  },
  avatar: {
    FREE: null,
    CREATOR: null,
    PRO: 150,
  },
};

export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // Obtener créditos actuales del usuario
  async getCredits(userId: string) {
    const user = await this.userRepository.findOneBy({ userId: userId });
    return { credits: user?.credits ?? 0 };
  }

  // Buscar usuario por ID
  async findById(userId: string): Promise<UserEntity | null> {
    return await this.userRepository.findOneBy({ userId: userId });
  }

  // Actualizar plan del usuario, con verificación de pago
  async upgradePlan(userId: string, newPlan: 'CREATOR' | 'PRO', transactionVerified: boolean) {
    const user = await this.userRepository.findOneBy({ userId: userId });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (!transactionVerified) {
      throw new BadRequestException('Pago no verificado. No se puede actualizar el plan.');
    }

    // Créditos asociados a cada plan
    const planCredits = {
      CREATOR: 150,
      PRO: 1100,
    };

    const creditsToAdd = planCredits[newPlan];

    user.role = newPlan as UserRole;
    user.credits += creditsToAdd; // Asignar los créditos correspondientes al plan

    await this.userRepository.save(user);

    return {
      message: 'Plan actualizado correctamente',
      newCredits: user.credits,
      plan: user.role,
    };
  }

  // Guardar usuario (registro)
  async save(user: UserEntity): Promise<void> {
    await this.userRepository.save(user);
  }

  // Establecer créditos específicos para el usuario
  async setCredits(userId: string, credits: number) {
    await this.userRepository.update({ userId: userId }, { credits });
  }

  // Restar créditos al usuario
  async decrementCredits(userId: string, amount: number) {
    const user = await this.userRepository.findOne({ where: { userId: userId } });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (user.credits < amount) {
      throw new BadRequestException('No tienes créditos suficientes');
    }

    user.credits -= amount;

    return this.userRepository.save(user);
  }

  // Buscar usuario por email
  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  // Crear un nuevo usuario
  async create(data: Partial<UserEntity>): Promise<UserEntity> {
    const user = this.userRepository.create(data);
    return await this.userRepository.save(user);
  }

  // Recarga automática de créditos semanalmente según el plan
  async rechargeCreditsWeekly() {
    const users = await this.userRepository.find(); // Obtiene todos los usuarios
    for (const user of users) {
      // Lógica de recarga flexible basada en el plan
      if (user.plan === 'FREE') {
        user.credits = 25; // Recarga 25 créditos para usuarios FREE
      } else if (user.plan === 'CREATOR') {
        user.credits = 150; // Recarga 150 créditos para CREATOR
      } else if (user.plan === 'PRO') {
        user.credits = 1100; // Recarga 1100 créditos para PRO
      }
      
      await this.userRepository.save(user);
    }
  }
}
