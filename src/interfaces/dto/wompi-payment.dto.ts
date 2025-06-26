export class WompiPaymentDto {
  status: string; // "APPROVED", "FAILED" (estado del pago)
  userId: string; // ID del usuario
  newPlan: 'CREATOR' | 'PRO'; // El nuevo plan del usuario
  transactionId: string; // ID de la transacción de Wompi
}
