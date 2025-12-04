import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Logger,
  Req,
} from '@nestjs/common';
import { PaymentsService } from '../../application/services/payments.service';
import { QuickCheckoutDto, WompiWebhookDto, MockWebhookDto } from '../../domain/dto/payment.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

/**
 * PaymentsController: Maneja endpoints de pagos
 * 
 * Endpoints:
 * - POST /api/payments/quick-checkout (autenticado)
 * - POST /api/payments/wompi/webhook (público, validado por firma)
 * - POST /api/payments/mock-complete (público, solo desarrollo)
 */
@Controller('api/payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly paymentsService: PaymentsService) {}

  /**
   * Inicia un checkout rápido
   * Endpoint: POST /api/payments/quick-checkout
   * Auth: Requiere JWT
   * 
   * Body:
   * {
   *   "tenantId": "uuid",
   *   "orderId": "uuid",
   *   "returnUrl": "https://..."
   * }
   * 
   * Response:
   * {
   *   "checkoutUrl": "https://checkout.wompi.co/...",
   *   "provider": "wompi" | "mock",
   *   "orderId": "uuid",
   *   "reference": "ORD-xxx-timestamp"
   * }
   */
  @UseGuards(JwtAuthGuard)
  @Post('quick-checkout')
  @HttpCode(HttpStatus.OK)
  async quickCheckout(
    @Req() req: { user: { sub: string; tenantId: string } },
    @Body() dto: QuickCheckoutDto,
  ) {
    try {
      // Validar que el tenantId del body coincide con el del JWT
      if (dto.tenantId !== req.user.tenantId) {
        this.logger.warn(
          `Tenant mismatch: JWT=${req.user.tenantId}, Body=${dto.tenantId}`
        );
        throw new Error('Tenant ID mismatch');
      }

      this.logger.log(`Quick checkout for order ${dto.orderId} by user ${req.user.sub}`);

      const response = await this.paymentsService.initiateQuickCheckout(dto);

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      this.logger.error(`Error in quick checkout: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Webhook de WOMPI (producción)
   * Endpoint: POST /api/payments/wompi/webhook
   * Auth: Público (validado por firma HMAC)
   * 
   * Body (WOMPI):
   * {
   *   "event": "transaction.updated",
   *   "data": {
   *     "transaction": {
   *       "id": "xxx",
   *       "reference": "ORD-xxx-timestamp",
   *       "status": "APPROVED" | "DECLINED",
   *       "amount_in_cents": 9999,
   *       "currency": "COP"
   *     }
   *   },
   *   "signature": "hmac-signature"
   * }
   */
  @Post('wompi/webhook')
  @HttpCode(HttpStatus.OK)
  async wompiWebhook(@Body() dto: WompiWebhookDto) {
    try {
      this.logger.log(`Received WOMPI webhook: ${dto.event}`);

      const response = await this.paymentsService.handleWompiWebhook(dto);

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      this.logger.error(`Error processing WOMPI webhook: ${error.message}`, error.stack);
      // IMPORTANTE: Retornar 200 aunque falle para que WOMPI no reintente
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Mock de confirmación de pago (desarrollo)
   * Endpoint: POST /api/payments/mock-complete
   * Auth: Público (solo para desarrollo)
   * 
   * Body:
   * {
   *   "orderId": "uuid",
   *   "tenantId": "uuid",
   *   "status": "approved" | "declined" (opcional, default: "approved")
   * }
   */
  @Post('mock-complete')
  @HttpCode(HttpStatus.OK)
  async mockComplete(@Body() dto: MockWebhookDto) {
    try {
      this.logger.log(`Received MOCK payment webhook for order ${dto.orderId}`);

      const response = await this.paymentsService.handleMockWebhook(dto);

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      this.logger.error(`Error processing MOCK webhook: ${error.message}`, error.stack);
      throw error;
    }
  }
}
