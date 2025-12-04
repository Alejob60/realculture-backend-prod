import { IsString, IsUUID, IsUrl, IsOptional } from 'class-validator';

export class QuickCheckoutDto {
  @IsUUID()
  tenantId: string;

  @IsUUID()
  orderId: string;

  @IsUrl()
  returnUrl: string;

  @IsString()
  @IsOptional()
  cancelUrl?: string;
}

export class CheckoutResponseDto {
  checkoutUrl: string;
  provider: 'wompi' | 'mock';
  orderId: string;
  reference?: string;

  constructor(partial: Partial<CheckoutResponseDto>) {
    Object.assign(this, partial);
  }
}

export class WompiWebhookDto {
  event: string;
  data: {
    transaction: {
      id: string;
      reference: string;
      status: string;
      amount_in_cents: number;
      currency: string;
      customer_email?: string;
    };
  };
  signature?: string;
}

export class MockWebhookDto {
  @IsUUID()
  orderId: string;

  @IsUUID()
  tenantId: string;

  @IsString()
  @IsOptional()
  status?: string; // 'approved', 'declined', 'error'
}

export class WebhookResponseDto {
  orderId: string;
  status: string;
  message?: string;

  constructor(partial: Partial<WebhookResponseDto>) {
    Object.assign(this, partial);
  }
}
