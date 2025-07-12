import { Controller, Post, Body, HttpCode, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/infrastructure/services/user.service';  // Servicio para gestionar usuarios
import { WompiService } from 'src/infrastructure/services/wompi.service';  // Servicio para integrar Wompi

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly userService: UserService,  // Servicio para gestionar usuarios
    private readonly wompiService: WompiService,  // Servicio para integrar Wompi
  ) {}

  /**
   * Endpoint para procesar los pagos de los usuarios
   * Se maneja el upgrade de plan y la compra de créditos
   */
  @Post('process-payment')
  async processPayment(@Body() body: { 
    userId: string, 
    action: 'upgrade' | 'buy-credits', 
    newPlan?: 'creator' | 'pro', 
    creditsToAdd?: number, 
    audioDuration?: number 
  }) {
    const { userId, action, newPlan, creditsToAdd, audioDuration } = body;

    let paymentData;

    try {
      // Si la acción es 'upgrade', es para cambiar el plan
      if (action === 'upgrade') {
        if (!newPlan) throw new Error('El plan nuevo debe ser especificado');

        // Llamamos a Wompi para crear la sesión de pago para el upgrade de plan
        paymentData = await this.wompiService.createSubscriptionSession(userId, newPlan);

        // Confirmamos el cambio de plan después de que el pago sea confirmado
        await this.userService.upgradePlan(userId, newPlan, true);  // Ahora se pasa 'true' después de confirmar el pago

      } else if (action === 'buy-credits') {
        if (!creditsToAdd) throw new Error('La cantidad de créditos a añadir debe ser especificada');

        // Llamamos a Wompi para crear la sesión de pago para comprar créditos
        paymentData = await this.wompiService.createCreditPurchaseSession(userId, creditsToAdd);

        // Los créditos se actualizan después de confirmar el pago
        await this.userService.setCredits(userId, creditsToAdd);

      } else if (audioDuration) {
        // Si es compra de créditos de audio, creamos la sesión de pago para esa duración
        paymentData = await this.wompiService.createAudioCreditPurchaseSession(userId, audioDuration);
      }

      // Enviamos la URL para que el usuario complete el pago en Wompi
      return { 
        message: 'Por favor, complete el pago en Wompi',
        paymentUrl: paymentData.paymentUrl,  // URL de pago generada por Wompi
        transactionId: paymentData.transactionId,  // ID de la transacción para seguimiento
      };
    } catch (error) {
      console.error('Error procesando el pago', error);
      throw new Error('Hubo un error al procesar el pago. Inténtalo nuevamente.');
    }
  }

  /**
   * Endpoint para recibir los eventos de Wompi
   * Este endpoint procesará las notificaciones de Wompi sobre el estado de los pagos
   */
  @Post('wompi-events')
  @HttpCode(200) // Responde con 200 OK
  async handleWompiEvent(@Body() body: any) {
    try {
      // Aquí procesas el evento enviado por Wompi
      console.log('Evento recibido de Wompi:', body);

      // Llama al servicio de Wompi para procesar el evento
      await this.wompiService.handleEvent(body);

      // Responder que el evento fue procesado correctamente
      return { message: 'Evento procesado correctamente' };
    } catch (error) {
      console.error('Error al procesar el evento de Wompi:', error);
      throw new UnauthorizedException('Hubo un error al procesar el evento. Inténtalo nuevamente.');
    }
  }
}
