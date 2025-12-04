export class QuickOrderResponseDto {
  orderId: string;
  status: string;
  amount: number;
  currency: string;
  productId: string;
  quantity: number;
  createdAt?: Date;

  constructor(partial: Partial<QuickOrderResponseDto>) {
    Object.assign(this, partial);
  }
}

export class OrderItemResponseDto {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export class OrderDetailResponseDto {
  id: string;
  tenantId: string;
  userId: string;
  status: string;
  items: OrderItemResponseDto[];
  total: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<OrderDetailResponseDto>) {
    Object.assign(this, partial);
  }
}
