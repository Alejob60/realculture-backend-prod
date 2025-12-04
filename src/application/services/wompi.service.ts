import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

export interface WompiPaymentRequest {
  orderId: string;
  amount: number;
  currency: string;
  reference: string;
  returnUrl: string;
  customerEmail?: string;
}

export interface WompiCheckoutResponse {
  checkoutUrl: string;
  reference: string;
}

/**
 * WompiService: Integración con WOMPI para procesamiento de pagos
 * 
 * Modo Producción: Requiere WOMPI_PUBLIC_KEY y WOMPI_PRIVATE_KEY
 * Modo Desarrollo: Retorna URLs mock para pruebas locales
 */
@Injectable()
export class WompiService {
  private readonly logger = new Logger(WompiService.name);
  private readonly publicKey: string;
  private readonly privateKey: string;
  private readonly isProduction: boolean;
  private readonly wompiApiUrl = 'https://checkout.wompi.co/p';

  constructor(private configService: ConfigService) {
    this.publicKey = this.configService.get<string>('WOMPI_PUBLIC_KEY') || '';
    this.privateKey = this.configService.get<string>('WOMPI_PRIVATE_KEY') || '';
    this.isProduction = !!(this.publicKey && this.privateKey);

    if (this.isProduction) {
      this.logger.log('WompiService: Running in PRODUCTION mode');
    } else {
      this.logger.warn('WompiService: Running in MOCK mode (WOMPI keys not configured)');
    }
  }

  /**
   * Inicia un pago con WOMPI (producción) o genera URL mock (desarrollo)
   */
  async initiatePayment(request: WompiPaymentRequest): Promise<WompiCheckoutResponse> {
    if (this.isProduction) {
      return this.initiateRealPayment(request);
    } else {
      return this.initiateMockPayment(request);
    }
  }

  /**
   * Integración REAL con WOMPI
   */
  private async initiateRealPayment(request: WompiPaymentRequest): Promise<WompiCheckoutResponse> {
    try {
      // WOMPI usa amount en centavos
      const amountInCents = Math.round(request.amount * 100);

      // Generar signature para WOMPI
      const signature = this.generateWompiSignature(
        request.reference,
        amountInCents,
        request.currency
      );

      // URL de checkout de WOMPI con parámetros
      const checkoutUrl = `${this.wompiApiUrl}?` +
        `public-key=${this.publicKey}&` +
        `currency=${request.currency}&` +
        `amount-in-cents=${amountInCents}&` +
        `reference=${request.reference}&` +
        `signature:integrity=${signature}&` +
        `redirect-url=${encodeURIComponent(request.returnUrl)}`;

      this.logger.log(`WOMPI Real Payment initiated: ${request.reference} - ${request.amount} ${request.currency}`);

      return {
        checkoutUrl,
        reference: request.reference,
      };
    } catch (error) {
      this.logger.error('Error initiating WOMPI payment', error);
      throw error;
    }
  }

  /**
   * Mock para desarrollo local (sin WOMPI configurado)
   */
  private async initiateMockPayment(request: WompiPaymentRequest): Promise<WompiCheckoutResponse> {
    const baseUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const mockCheckoutUrl = `${baseUrl}/checkout/mock?orderId=${request.orderId}&amount=${request.amount}&currency=${request.currency}&reference=${request.reference}`;

    this.logger.log(`WOMPI Mock Payment initiated: ${request.reference} - ${request.amount} ${request.currency}`);

    return {
      checkoutUrl: mockCheckoutUrl,
      reference: request.reference,
    };
  }

  /**
   * Genera signature de integridad para WOMPI
   * Formato: HMAC SHA256 de "reference+amount+currency" con WOMPI_PRIVATE_KEY
   */
  private generateWompiSignature(reference: string, amountInCents: number, currency: string): string {
    const message = `${reference}${amountInCents}${currency}`;
    return crypto
      .createHmac('sha256', this.privateKey)
      .update(message)
      .digest('hex');
  }

  /**
   * Valida la firma del webhook de WOMPI
   */
  validateWebhookSignature(payload: any, signature: string): boolean {
    if (!this.isProduction) {
      // En modo mock, aceptar cualquier webhook
      return true;
    }

    try {
      const expectedSignature = crypto
        .createHmac('sha256', this.privateKey)
        .update(JSON.stringify(payload))
        .digest('hex');

      return expectedSignature === signature;
    } catch (error) {
      this.logger.error('Error validating WOMPI webhook signature', error);
      return false;
    }
  }

  /**
   * Verifica si está configurado para producción
   */
  isConfigured(): boolean {
    return this.isProduction;
  }
}
