import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';

/**
 * TenantGuard: Valida que el tenantId en el path coincide con el tenantId del JWT
 * 
 * Uso: @UseGuards(JwtAuthGuard, TenantGuard)
 * 
 * Verifica que :tid del path === req.user.tenantId del JWT
 */
@Injectable()
export class TenantGuard implements CanActivate {
  private readonly logger = new Logger(TenantGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const pathTenantId = request.params.tid; // Asume que el parámetro se llama :tid

    if (!user) {
      this.logger.warn('TenantGuard: User not authenticated');
      throw new UnauthorizedException('User not authenticated');
    }

    if (!pathTenantId) {
      this.logger.warn('TenantGuard: No tenantId in path params');
      throw new UnauthorizedException('Tenant ID not found in request');
    }

    if (!user.tenantId) {
      this.logger.warn(`TenantGuard: User ${user.sub} has no tenantId in JWT`);
      throw new UnauthorizedException('User has no tenant context');
    }

    if (user.tenantId !== pathTenantId) {
      this.logger.warn(
        `TenantGuard: Tenant mismatch - JWT: ${user.tenantId}, Path: ${pathTenantId}`
      );
      throw new UnauthorizedException('Tenant access denied');
    }

    this.logger.debug(`TenantGuard: Access granted for tenant ${pathTenantId}`);
    return true;
  }
}
