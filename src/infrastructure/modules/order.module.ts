import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from '../../interfaces/controllers/order.controller';
import { OrderService } from '../../infrastructure/services/order.service';
import { OrdersService } from '../../application/services/orders.service';
import { OrderRepository } from '../../infrastructure/database/order.repository';
import { OrderEntity } from '../../domain/entities/order.entity';
import { OrderItemEntity } from '../../domain/entities/order-item.entity';
import { CartRepository } from '../../infrastructure/database/cart.repository';
import { CartEntity } from '../../domain/entities/cart.entity';
import { ProductRepository } from '../../infrastructure/database/product.repository';
import { ProductEntity } from '../../domain/entities/product.entity';
import { InventoryItemRepository } from '../../infrastructure/database/inventory-item.repository';
import { InventoryItemEntity } from '../../domain/entities/inventory-item.entity';
import { PaymentEntity } from '../../domain/entities/payment.entity';
import { InventoryModule } from './inventory.module';
import { AntiFraudService } from '../../infrastructure/services/anti-fraud.service';
import { RedisService } from '../../infrastructure/services/redis.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, OrderItemEntity, CartEntity, ProductEntity, InventoryItemEntity, PaymentEntity]),
    InventoryModule, // Import InventoryModule to use InventoryService
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrdersService,
    OrderRepository,
    CartRepository,
    ProductRepository,
    InventoryItemRepository,
    AntiFraudService,
    RedisService,
  ],
  exports: [
    OrderService,
    OrdersService,
    OrderRepository,
  ],
})
export class OrderModule {}