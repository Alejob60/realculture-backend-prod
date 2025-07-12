import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PLAN_CREDITS, CREDIT_PACKAGES, AUDIO_DURATION_CREDIT_COST, PLAN_PRICES } from '../../common/constants/pricing';  // Importar las constantes de precios

@Injectable()
export class WompiService {
  private readonly WOMPI_PUBLIC_KEY = process.env.WOMPI_PUBLIC_KEY;
  private readonly WOMPI_SECRET_KEY = process.env.WOMPI_SECRET_KEY;
  private readonly WOMPI_API_URL = 'https://sandbox.wompi.co/v1';

  // Crea una sesión de pago de suscripción (para upgrade de plan)
  async createSubscriptionSession(userId: string, newPlan: 'creator' | 'pro') {
    try {
      // Obtener los créditos del plan correspondiente
      const creditsToAdd = PLAN_CREDITS['promo-image'][newPlan];  // Usamos promo-image, puedes hacer lo mismo para otros servicios si lo deseas

      const amountInCents = PLAN_PRICES[newPlan] * 100; // Usamos el precio de PLAN_PRICES, convertido a centavos

      // Definimos los datos de la transacción para el upgrade de plan
      const transactionData = {
        amount_in_cents: amountInCents,
        currency: 'COP',
        payment_method: 'CARD',
        success_url: `${process.env.FRONTEND_URL}/payment-success`,
        failed_url: `${process.env.FRONTEND_URL}/payment-failed`,
      };

      const response = await axios.post(
        `${this.WOMPI_API_URL}/checkouts`, 
        transactionData,
        { headers: { Authorization: `Bearer ${this.WOMPI_SECRET_KEY}` } }
      );

      return {
        paymentUrl: response.data.data.checkout_url, // URL de pago de Wompi
        transactionId: response.data.data.id, // ID de la transacción
      };
    } catch (error) {
      console.error('Error al crear la sesión de pago de suscripción con Wompi', error);
      throw new Error('Error al crear la sesión de pago de suscripción con Wompi');
    }
  }

  // Crea una sesión para comprar más créditos
  async createCreditPurchaseSession(userId: string, creditsToAdd: number) {
    try {
      // Usamos el precio del paquete de créditos según el valor solicitado
      const costInCents = CREDIT_PACKAGES[creditsToAdd] * 100; // Convertimos el valor de los créditos a centavos

      // Datos de la transacción para comprar créditos
      const transactionData = {
        amount_in_cents: costInCents,
        currency: 'COP',
        payment_method: 'CARD',
        success_url: `${process.env.FRONTEND_URL}/payment-success`,
        failed_url: `${process.env.FRONTEND_URL}/payment-failed`,
      };

      const response = await axios.post(
        `${this.WOMPI_API_URL}/checkouts`, 
        transactionData,
        { headers: { Authorization: `Bearer ${this.WOMPI_SECRET_KEY}` } }
      );

      return {
        paymentUrl: response.data.data.checkout_url, // URL para completar el pago
        transactionId: response.data.data.id, // ID de la transacción
      };
    } catch (error) {
      console.error('Error al crear la sesión de compra de créditos con Wompi', error);
      throw new Error('Error al crear la sesión de compra de créditos con Wompi');
    }
  }

  // Crea una sesión de pago para compra de créditos por duración de audio
  async createAudioCreditPurchaseSession(userId: string, duration: number) {
    try {
      // Calculamos el costo según la duración del audio
      const costInCents = AUDIO_DURATION_CREDIT_COST[duration] * 100; // Convertimos el costo en centavos

      // Datos de la transacción para comprar créditos de audio
      const transactionData = {
        amount_in_cents: costInCents,
        currency: 'COP',
        payment_method: 'CARD',
        success_url: `${process.env.FRONTEND_URL}/payment-success`,
        failed_url: `${process.env.FRONTEND_URL}/payment-failed`,
      };

      const response = await axios.post(
        `${this.WOMPI_API_URL}/checkouts`, 
        transactionData,
        { headers: { Authorization: `Bearer ${this.WOMPI_SECRET_KEY}` } }
      );

      return {
        paymentUrl: response.data.data.checkout_url, // URL de pago de Wompi
        transactionId: response.data.data.id, // ID de la transacción
      };
    } catch (error) {
      console.error('Error al crear la sesión de compra de créditos de audio con Wompi', error);
      throw new Error('Error al crear la sesión de compra de créditos de audio con Wompi');
    }
  }

  /**
   * Procesar el evento recibido de Wompi
   * Esta función es llamada por el PaymentsController para manejar el estado del pago
   */
  async handleEvent(event: any) {
    try {
      console.log('Evento recibido de Wompi:', event);

      // Procesar el evento dependiendo del estado de la transacción
      const { status, transactionId, userId, amount } = event;

      if (status === 'approved') {
        console.log(`Pago aprobado para la transacción ${transactionId}`);
        
        // Aquí deberías actualizar el usuario, por ejemplo, añadir los créditos o cambiar su plan
        // Llamar al servicio UserService para actualizar los créditos o el plan según el tipo de pago
        // await this.userService.updateUserOnPaymentSuccess(userId, amount);
      } else {
        console.warn(`Transacción ${transactionId} no aprobada. Estado: ${status}`);
      }

    } catch (error) {
      console.error('Error al manejar el evento de Wompi', error);
      throw new Error('Error al procesar el evento de Wompi');
    }
  }
}
