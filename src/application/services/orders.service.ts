import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity, OrderStatus } from '../../domain/entities/order.entity';
import { OrderItemEntity } from '../../domain/entities/order-item.entity';
import { ProductEntity } from '../../domain/entities/product.entity';
import { CreateQuickOrderDto } from '../../domain/dto/create-quick-order.dto';
import { QuickOrderResponseDto, OrderDetailResponseDto, OrderItemResponseDto } from '../../domain/dto/order-response.dto';

/**
 * OrdersService: Maneja la lógica de negocio de órdenes
 */
@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  /**
   * Crea una orden rápida (sin carrito)
   * 
   * Flujo:
   * 1. Validar que el producto existe y pertenece al tenant
   * 2. Calcular precio total
   * 3. Crear OrderEntity con status = PENDING_PAYMENT
   * 4. Crear OrderItemEntity asociado
   * 5. Retornar respuesta
   */
  async createQuickOrder(
    tenantId: string,
    userId: string,
    dto: CreateQuickOrderDto,
  ): Promise<QuickOrderResponseDto> {
    try {
      this.logger.log(`Creating quick order for tenant ${tenantId}, user ${userId}, product ${dto.productId}`);

      // 1. Validar producto
      const product = await this.productRepository.findOne({
        where: { id: dto.productId, tenantId },
      });

      if (!product) {
        throw new NotFoundException(`Product ${dto.productId} not found for tenant ${tenantId}`);
      }

      // 2. Calcular total
      const totalAmount = Number(product.price) * dto.quantity;
      const currency = product.currency || 'USD';

      // 3. Crear orden
      const order = this.orderRepository.create({
        tenantId,
        userId,
        status: OrderStatus.PENDING_PAYMENT,
        totalAmount,
        currency,
        metadata: {
          channel: dto.channel || 'web',
          metaAgentSessionId: dto.metaAgentSessionId,
          context: dto.context,
        },
      });

      const savedOrder = await this.orderRepository.save(order);

      // 4. Crear order item
      const orderItem = this.orderItemRepository.create({
        orderId: savedOrder.id,
        productId: product.id,
        quantity: dto.quantity,
        unitPrice: product.price,
        totalPrice: totalAmount,
        currency,
        metadata: {
          productName: product.name,
          sku: product.sku,
        },
      });

      await this.orderItemRepository.save(orderItem);

      this.logger.log(`Quick order created: ${savedOrder.id} - ${totalAmount} ${currency}`);

      // 5. Retornar respuesta
      return new QuickOrderResponseDto({
        orderId: savedOrder.id,
        status: savedOrder.status,
        amount: Number(savedOrder.totalAmount),
        currency: savedOrder.currency,
        productId: product.id,
        quantity: dto.quantity,
        createdAt: savedOrder.createdAt,
      });
    } catch (error) {
      this.logger.error(`Error creating quick order: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Obtiene detalles de una orden
   */
  async getOrderById(tenantId: string, orderId: string): Promise<OrderDetailResponseDto> {
    try {
      const order = await this.orderRepository.findOne({
        where: { id: orderId, tenantId },
        relations: ['orderItems', 'orderItems.product'],
      });

      if (!order) {
        throw new NotFoundException(`Order ${orderId} not found for tenant ${tenantId}`);
      }

      const items: OrderItemResponseDto[] = order.orderItems.map((item) => ({
        productId: item.productId,
        name: item.product?.name || item.metadata?.['productName'] || 'Unknown',
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
      }));

      return new OrderDetailResponseDto({
        id: order.id,
        tenantId: order.tenantId,
        userId: order.userId,
        status: order.status,
        items,
        total: Number(order.totalAmount),
        currency: order.currency,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      });
    } catch (error) {
      this.logger.error(`Error getting order ${orderId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Actualiza el estado de una orden
   */
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    try {
      const order = await this.orderRepository.findOne({ where: { id: orderId } });

      if (!order) {
        throw new NotFoundException(`Order ${orderId} not found`);
      }

      order.status = status;
      await this.orderRepository.save(order);

      this.logger.log(`Order ${orderId} status updated to ${status}`);
    } catch (error) {
      this.logger.error(`Error updating order status: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Valida que una orden pertenece al tenant y está en estado válido para pago
   */
  async validateOrderForPayment(orderId: string, tenantId: string): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, tenantId },
    });

    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found for tenant ${tenantId}`);
    }

    if (order.status !== OrderStatus.PENDING_PAYMENT) {
      throw new BadRequestException(
        `Order ${orderId} is not in pending_payment status (current: ${order.status})`
      );
    }

    return order;
  }
}
