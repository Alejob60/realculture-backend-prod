// src/infrastructure/services/cron.service.ts

import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserService } from './user.service'; // Asegúrate de que el UserService esté bien importado

@Injectable()
export class CronService {
  constructor(private readonly userService: UserService) {}

  @Cron('0 0 * * MON')
  async handleCron() {
    // Ejecuta la recarga de créditos semanalmente
    await this.userService.rechargeCreditsWeekly(); // Recarga créditos cada lunes
    console.log('Créditos recargados para usuarios FREE');
  }
}
