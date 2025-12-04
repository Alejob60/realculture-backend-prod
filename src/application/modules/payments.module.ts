import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { OrderEntity } from '../../domain/entities/order.entity';
import { OrderItemEntity } from '../../domain/entities/order-item.entity';
import { ProductEntity } from '../../domain/entities/product.entity';
import { PaymentsController } from '../../interfaces/controllers/payments.controller';
import { PaymentsService } from '../services/payments.service';
import { WompiService } from '../services/wompi.service';
import { OrdersService } from '../services/orders.service';

/**
 * PaymentsModule: Módulo para manejo de pagos
 * 
 * Providers:
 * - PaymentsService: Lógica de negocio de pagos
 * - WompiService: Integración con WOMPI
 * - OrdersService: Lógica de negocio de órdenes
 * 
 * Controllers:
 * - PaymentsController: Endpoints de pagos
 */
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      OrderEntity,
      OrderItemEntity,
      ProductEntity,
    ]),
  ],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    WompiService,
    OrdersService,
  ],
  exports: [
    PaymentsService,
    WompiService,
    OrdersService,
  ],
})
export class PaymentsModule {}
