import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { TenantEntity } from './tenant.entity';
import { UserEntity } from './user.entity';
import { OrderItemEntity } from './order-item.entity';
import { PaymentEntity } from './payment.entity';

export enum OrderStatus {
  PENDING = 'pending',
  PENDING_PAYMENT = 'pending_payment',
  PAID = 'paid',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

@Entity('orders')
@Index(['tenantId', 'userId'])
@Index(['status'])
@Index(['createdAt'])
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id' })
  tenantId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'cart_id', nullable: true })
  cartId: string;

  @Column({ 
    name: 'status', 
    type: 'enum', 
    enum: OrderStatus,
    default: OrderStatus.PENDING 
  })
  status: OrderStatus;

  @Column({ name: 'total_amount', type: 'decimal' })
  totalAmount: number;

  @Column({ name: 'currency', default: 'USD' })
  currency: string;

  @Column({ name: 'shipping_address', type: 'jsonb', nullable: true })
  shippingAddress: Record<string, any> | null;

  @Column({ name: 'billing_address', type: 'jsonb', nullable: true })
  billingAddress: Record<string, any> | null;

  @Column({ name: 'metadata', type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => TenantEntity, (tenant) => tenant.id)
  @JoinColumn({ name: 'tenant_id' })
  tenant: TenantEntity;

  @ManyToOne(() => UserEntity, (user) => user.userId)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order)
  orderItems: OrderItemEntity[];

  @OneToMany(() => PaymentEntity, (payment) => payment.order)
  payments: PaymentEntity[];
}