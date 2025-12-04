import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Logger,
  Query,
  Req,
} from '@nestjs/common';
import { OrderService } from '../../infrastructure/services/order.service';
import { OrdersService } from '../../application/services/orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { OrderResponseDto } from '../dto/order-response.dto';
import { CreateQuickOrderDto } from '../../domain/dto/create-quick-order.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { TenantGuard } from '../guards/tenant.guard';

@Controller('api/tenants/:tid/orders')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(
    private readonly orderService: OrderService,
    private readonly ordersService: OrdersService,
  ) {}

  /**
   * Create a quick order (without cart)
   * Endpoint: POST /api/tenants/:tid/orders/quick
   * Auth: JwtAuthGuard + TenantGuard
   * 
   * @param tid The tenant ID from path
   * @param req Request with JWT user
   * @param dto Quick order data
   * @returns The created order
   */
  @UseGuards(JwtAuthGuard, TenantGuard)
  @Post('quick')
  @HttpCode(HttpStatus.CREATED)
  async createQuickOrder(
    @Param('tid') tid: string,
    @Req() req: { user: { sub: string; tenantId: string } },
    @Body() dto: CreateQuickOrderDto,
  ) {
    try {
      const userId = req.user.sub;
      const tenantId = tid;

      this.logger.log(`Creating quick order for tenant ${tenantId}, user ${userId}`);

      const order = await this.ordersService.createQuickOrder(tenantId, userId, dto);

      return {
        success: true,
        data: order,
      };
    } catch (error) {
      this.logger.error(`Failed to create quick order: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Create a new order
   * @param tid The tenant ID
   * @param createOrderDto The order data
   * @returns The created order
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Param('tid') tid: string, @Body() createOrderDto: CreateOrderDto) {
    try {
      const order = await this.orderService.createOrder(tid, createOrderDto);
      return {
        success: true,
        order: new OrderResponseDto(order),
      };
    } catch (error) {
      this.logger.error(`Failed to create order for tenant ${tid}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all orders for a tenant
   * @param tid The tenant ID
   * @param page The page number
   * @param limit The number of items per page
   * @returns A list of orders
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Param('tid') tid: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      const [orders, total] = await this.orderService.findByTenantId(tid, page, limit);
      return {
        success: true,
        orders: orders.map(order => new OrderResponseDto(order)),
        total,
        page,
        limit,
      };
    } catch (error) {
      this.logger.error(`Failed to list orders for tenant ${tid}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get orders by user ID
   * @param tid The tenant ID
   * @param userId The user ID
   * @returns A list of orders
   */
  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  async findByUser(@Param('tid') tid: string, @Param('userId') userId: string) {
    try {
      const orders = await this.orderService.findByUserId(tid, userId);
      return {
        success: true,
        orders: orders.map(order => new OrderResponseDto(order)),
      };
    } catch (error) {
      this.logger.error(`Failed to find orders for user ${userId} in tenant ${tid}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get an order by ID
   * Endpoint: GET /api/tenants/:tid/orders/:id
   * 
   * @param tid The tenant ID
   * @param id The order ID
   * @returns The order
   */
  @UseGuards(JwtAuthGuard, TenantGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('tid') tid: string, @Param('id') id: string) {
    try {
      // Intenta usar el nuevo service primero
      const orderDetail = await this.ordersService.getOrderById(tid, id);
      return {
        success: true,
        data: orderDetail,
      };
    } catch (error) {
      this.logger.error(`Failed to find order ${id} for tenant ${tid}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update an order
   * @param tid The tenant ID
   * @param id The order ID
   * @param updateOrderDto The order data to update
   * @returns The updated order
   */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('tid') tid: string,
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    try {
      const order = await this.orderService.updateOrder(tid, id, updateOrderDto);
      return {
        success: true,
        order: new OrderResponseDto(order),
      };
    } catch (error) {
      this.logger.error(`Failed to update order ${id} for tenant ${tid}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete an order
   * @param tid The tenant ID
   * @param id The order ID
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('tid') tid: string, @Param('id') id: string) {
    try {
      await this.orderService.deleteOrder(tid, id);
      return {
        success: true,
        message: 'Order deleted successfully',
      };
    } catch (error) {
      this.logger.error(`Failed to delete order ${id} for tenant ${tid}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Process payment webhook
   * @param tid The tenant ID
   * @param paymentData The payment data from webhook
   * @returns The payment processing result
   */
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async processPaymentWebhook(@Param('tid') tid: string, @Body() paymentData: any) {
    try {
      const result = await this.orderService.processPaymentWebhook(tid, paymentData);
      return result;
    } catch (error) {
      this.logger.error(`Failed to process payment webhook for tenant ${tid}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get order statistics
   * @param tid The tenant ID
   * @returns Order statistics
   */
  @UseGuards(JwtAuthGuard)
  @Get('stats')
  @HttpCode(HttpStatus.OK)
  async getOrderStats(@Param('tid') tid: string) {
    try {
      const stats = await this.orderService.getOrderStats(tid);
      return stats;
    } catch (error) {
      this.logger.error(`Failed to get order stats for tenant ${tid}: ${error.message}`);
      throw error;
    }
  }
}