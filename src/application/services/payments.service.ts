import { Injectable, Logger, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WompiService } from './wompi.service';
import { OrdersService } from './orders.service';
import { OrderStatus } from '../../domain/entities/order.entity';
import { QuickCheckoutDto, CheckoutResponseDto, WebhookResponseDto, WompiWebhookDto, MockWebhookDto } from '../../domain/dto/payment.dto';

/**
 * PaymentsService: Maneja la lógica de negocio de pagos
 * 
 * Integra con WompiService para procesamiento real o mock
 */
@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly wompiService: WompiService,
    private readonly ordersService: OrdersService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Inicia un checkout rápido (WOMPI o mock)
   * 
   * Flujo:
   * 1. Validar que tenantId del body coincide con el del JWT (hecho en controller)
   * 2. Validar que la orden existe y está en PENDING_PAYMENT
   * 3. Generar reference única
   * 4. Llamar a WompiService (real o mock)
   * 5. Retornar URL de checkout
   */
  async initiateQuickCheckout(dto: QuickCheckoutDto): Promise<CheckoutResponseDto> {
    try {
      this.logger.log(`Initiating quick checkout for order ${dto.orderId}`);

      // 1. Validar orden
      const order = await this.ordersService.validateOrderForPayment(dto.orderId, dto.tenantId);

      // 2. Generar reference única para WOMPI
      const reference = `ORD-${order.id.substring(0, 8)}-${Date.now()}`;

      // 3. Llamar a WOMPI Service
      const wompiResponse = await this.wompiService.initiatePayment({
        orderId: order.id,
        amount: Number(order.totalAmount),
        currency: order.currency,
        reference,
        returnUrl: dto.returnUrl,
      });

      this.logger.log(`Checkout initiated: ${wompiResponse.checkoutUrl}`);

      // 4. Retornar respuesta
      const provider = this.wompiService.isConfigured() ? 'wompi' : 'mock';

      return new CheckoutResponseDto({
        checkoutUrl: wompiResponse.checkoutUrl,
        provider,
        orderId: order.id,
        reference: wompiResponse.reference,
      });
    } catch (error) {
      this.logger.error(`Error initiating checkout: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Maneja webhook de WOMPI (producción)
   * 
   * Flujo:
   * 1. Validar firma HMAC
   * 2. Extraer orderId del reference
   * 3. Actualizar estado de orden según status de transacción
   * 4. Responder 200 OK
   */
  async handleWompiWebhook(dto: WompiWebhookDto): Promise<WebhookResponseDto> {
    try {
      this.logger.log(`Received WOMPI webhook: ${dto.event}`);

      // 1. Validar firma
      if (dto.signature && !this.wompiService.validateWebhookSignature(dto.data, dto.signature)) {
        this.logger.warn('WOMPI webhook signature validation failed');
        throw new UnauthorizedException('Invalid webhook signature');
      }

      // 2. Extraer orderId del reference (formato: ORD-{uuid-prefix}-{timestamp})
      const reference = dto.data.transaction.reference;
      const orderId = this.extractOrderIdFromReference(reference);

      // 3. Actualizar orden según status
      const transactionStatus = dto.data.transaction.status;
      let orderStatus: OrderStatus;

      switch (transactionStatus.toLowerCase()) {
        case 'approved':
        case 'aprobada':
          orderStatus = OrderStatus.PAID;
          break;
        case 'declined':
        case 'rechazada':
          orderStatus = OrderStatus.CANCELLED;
          break;
        case 'pending':
        case 'pendiente':
          orderStatus = OrderStatus.PENDING_PAYMENT;
          break;
        default:
          this.logger.warn(`Unknown transaction status: ${transactionStatus}`);
          orderStatus = OrderStatus.PENDING_PAYMENT;
      }

      await this.ordersService.updateOrderStatus(orderId, orderStatus);

      this.logger.log(`Order ${orderId} updated to ${orderStatus} via WOMPI webhook`);

      return new WebhookResponseDto({
        orderId,
        status: orderStatus,
        message: 'Webhook processed successfully',
      });
    } catch (error) {
      this.logger.error(`Error processing WOMPI webhook: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Maneja webhook MOCK (desarrollo)
   * 
   * Permite simular pagos aprobados/rechazados sin WOMPI real
   */
  async handleMockWebhook(dto: MockWebhookDto): Promise<WebhookResponseDto> {
    try {
      this.logger.log(`Received MOCK webhook for order ${dto.orderId}`);

      // 1. Validar que la orden existe
      await this.ordersService.validateOrderForPayment(dto.orderId, dto.tenantId);

      // 2. Actualizar estado según parámetro
      const mockStatus = dto.status || 'approved';
      let orderStatus: OrderStatus;

      switch (mockStatus.toLowerCase()) {
        case 'approved':
          orderStatus = OrderStatus.PAID;
          break;
        case 'declined':
          orderStatus = OrderStatus.CANCELLED;
          break;
        default:
          orderStatus = OrderStatus.PENDING_PAYMENT;
      }

      await this.ordersService.updateOrderStatus(dto.orderId, orderStatus);

      this.logger.log(`Order ${dto.orderId} updated to ${orderStatus} via MOCK webhook`);

      return new WebhookResponseDto({
        orderId: dto.orderId,
        status: orderStatus,
        message: 'Mock webhook processed successfully',
      });
    } catch (error) {
      this.logger.error(`Error processing MOCK webhook: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Extrae orderId del reference de WOMPI
   * Formato esperado: ORD-{uuid-prefix}-{timestamp}
   */
  private extractOrderIdFromReference(reference: string): string {
    try {
      // Remover prefijo "ORD-" y timestamp
      const parts = reference.split('-');
      if (parts.length < 2) {
        throw new BadRequestException(`Invalid reference format: ${reference}`);
      }

      // El orderId completo debería estar guardado en metadata de la orden
      // Por simplicidad, asumimos que el reference contiene suficiente info
      // En producción, podrías guardar un mapping reference -> orderId
      
      // Por ahora, retornamos el reference completo y buscamos por metadata
      return reference;
    } catch (error) {
      this.logger.error(`Error extracting orderId from reference: ${reference}`, error);
      throw new BadRequestException('Invalid payment reference');
    }
  }
}
