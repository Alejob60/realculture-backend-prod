import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRole } from 'src/domain/enums/user-role.enum';
<<<<<<< Updated upstream
import { UserRepository } from '../database/user.repository';
=======
import * as bcrypt from 'bcrypt';

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
>>>>>>> Stashed changes

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getCredits(userId: string) {
    const user = await this.userRepository.findById(userId);
    return { credits: user?.credits ?? 0 };
  }

<<<<<<< Updated upstream
=======
  // 2. Crear un usuario sincronizado desde NextAuth o Google
  async createUser(data: {
    email: string;
    name?: string;
    avatar?: string;
    googleId?: string | undefined;
    role?: UserRole;
    credits?: number;
    password?: string | undefined;
  }): Promise<UserEntity> {
    const newUser = this.userRepository.create({
      email: data.email,
      name: data.name ?? 'Usuario MisyBot',
      avatar: data.avatar ?? '',
      googleId: data.googleId ?? undefined,
      role: data.role ?? UserRole.FREE,
      plan: data.role ?? UserRole.FREE,
      credits: data.credits ?? 100,
      password: data.password
    });

    return await this.userRepository.save(newUser); // ✅ Esto ya es UserEntity
  }


  // 3. Buscar usuario por ID
>>>>>>> Stashed changes
  async findById(userId: string): Promise<UserEntity | null> {
    return await this.userRepository.findById(userId);
  }

  async upgradePlan(userId: string, newPlan: 'CREATOR' | 'PRO') {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('Usuario no encontrado');

    const planCredits = {
      CREATOR: 150,
      PRO: 1100,
    };

    const creditsToAdd = planCredits[newPlan];

    user.role = newPlan as UserRole;
    user.credits += creditsToAdd;

    await this.userRepository.save(user);

    return {
      message: 'Plan actualizado correctamente',
      newCredits: user.credits,
      plan: user.role,
    };
  }
  async save(user: UserEntity): Promise<UserEntity> {
    return await this.userRepository.save(user);
  }
  async setCredits(userId: string, credits: number) {
    const user = await this.userRepository.findById(userId);
    if (user) {
      user.credits = credits;
      await this.userRepository.save(user);
    }
  }
  async decrementCredits(userId: string, amount: number) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (user.credits < amount) {
      throw new BadRequestException('No tienes créditos suficientes');
    }

    user.credits -= amount;

    return this.userRepository.save(user);
  }
  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findByEmail(email);
  }

  async create(data: Partial<UserEntity>): Promise<UserEntity> {
    return await this.userRepository.create(data);
  }
<<<<<<< Updated upstream
}
=======

  // 13. sitema de login con email y password
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async validatePassword(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }

  async loginUser(email: string, password: string): Promise<UserEntity | null> {
    const user = await this.findByEmail(email);
    if (!user || !user.password) return null;

    const valid = await this.validatePassword(password, user.password);
    return valid ? user : null;
  }

  async registerUser(name: string, email: string, password: string): Promise<UserEntity> {
    const existing = await this.findByEmail(email);
    if (existing) throw new BadRequestException('El usuario ya existe');

    const hashed = await this.hashPassword(password);
    return await this.createUser({
      email,
      name,
      password: hashed,
      credits: 100,
      role: UserRole.FREE,
    });
  }
}
>>>>>>> Stashed changes
