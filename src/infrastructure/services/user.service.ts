import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRole } from 'src/domain/enums/user-role.enum';

const PLAN_CREDITS = {
  'promo-image': {
    free: 10,
    creator: 10,
    pro: 10,
  },
  'promo-video': {
    free: 25,
    creator: 25,
    pro: 25,
  },
  audio: {
    free: 10,
    creator: 10,
    pro: 0,
  },
  subtitles: {
    free: 5,
    creator: 5,
    pro: 0,
  },
  'ai-agent': {
    free: null,
    creator: 350,
    pro: 350,
  },
  'campaign-automation': {
    free: null,
    creator: 400,
    pro: 350,
  },
  avatar: {
    free: null,
    creator: null,
    pro: 150,
  },
};

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // 1. Obtener créditos actuales del usuario
  async getCredits(userId: string) {
    const user = await this.userRepository.findOneBy({ userId });
    return { credits: user?.credits ?? 0 };
  }

  // 2. Crear un usuario sincronizado desde NextAuth o Google
  async createUser(data: {
    email: string;
    name?: string;
    avatar?: string;
    googleId?: string | null;
    role?: UserRole;
    credits?: number;
  }): Promise<UserEntity> {
    const newUser = this.userRepository.create({
      email: data.email,
      name: data.name ?? 'Usuario RealCulture',
      avatar: data.avatar ?? '',
      googleId: data.googleId ?? undefined,
      role: data.role ?? UserRole.FREE,
      plan: data.role ?? UserRole.FREE,
      credits: data.credits ?? 100,
    });

    return await this.userRepository.save(newUser); // ✅ Esto ya es UserEntity
  }


  // 3. Buscar usuario por ID
  async findById(userId: string): Promise<UserEntity | null> {
    return await this.userRepository.findOneBy({ userId });
  }

  // 4. Buscar usuario por email
  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  // 5. Crear nuevo usuario desde datos parciales
  async create(data: Partial<UserEntity>): Promise<UserEntity> {
    const user = this.userRepository.create(data);
    return await this.userRepository.save(user);
  }

  // 6. Guardar cambios a un usuario existente
  async save(user: UserEntity): Promise<void> {
    await this.userRepository.save(user);
  }

  // 7. Actualizar créditos manualmente
  async setCredits(userId: string, credits: number) {
    await this.userRepository.update({ userId }, { credits });
  }

  // 8. Descontar créditos por uso de servicio
  async decrementCredits(userId: string, amount: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    user.credits = Math.max(0, user.credits - amount);
    return this.userRepository.save(user);
  }

  // 9. Upgrade de plan con verificación
  async upgradePlan(
    userId: string,
    newPlan: 'creator' | 'pro',
    transactionVerified: boolean,
  ) {
    const user = await this.userRepository.findOneBy({ userId });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    if (!transactionVerified) throw new BadRequestException('Pago no verificado');

    const planCredits = {
      creator: 150,
      pro: 1100,
    };

    user.role = newPlan as UserRole;
    user.plan = newPlan;
    user.credits += planCredits[newPlan];
    await this.userRepository.save(user);

    return {
      message: 'Plan actualizado correctamente',
      newCredits: user.credits,
      plan: user.plan,
    };
  }

  // 10. Recarga semanal SOLO para usuarios free
  async rechargeCreditsWeekly() {
    const usersFree = await this.userRepository.find({ where: { plan: 'FREE' } });

    for (const user of usersFree) {
      user.credits = 25;
      await this.userRepository.save(user);
    }

    return {
      success: true,
      message: `Recarga completada para ${usersFree.length} usuarios FREE`,
    };
  }

  // 11. Compra de créditos (con límites según plan si aplican)
  async buyCredits(userId: string, creditsToBuy: number) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (user.plan === 'Lite' && user.credits + creditsToBuy > 8640) {
      throw new BadRequestException('No puedes comprar más créditos sin cambiar a pro');
    }

    if (user.plan === 'Standard' && user.credits + creditsToBuy > 28800) {
      throw new BadRequestException('No puedes comprar más créditos sin cambiar a pro');
    }

    user.credits += creditsToBuy;
    await this.userRepository.save(user);

    return {
      message: `Has comprado ${creditsToBuy} créditos. Total actual: ${user.credits}`,
    };
  }

  // 12. Obtener precio por tipo de servicio y plan
  getServiceCost(serviceType: keyof typeof PLAN_CREDITS, plan: 'free' | 'creator' | 'pro') {
    return PLAN_CREDITS[serviceType]?.[plan] ?? null;
  }
}
