import { IsString, IsInt, IsOptional, IsObject, Min } from 'class-validator';

export class CreateQuickOrderDto {
  @IsString()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsString()
  @IsOptional()
  channel?: string;

  @IsString()
  @IsOptional()
  metaAgentSessionId?: string;

  @IsObject()
  @IsOptional()
  context?: {
    source?: string;
    campaign?: string;
    [key: string]: any;
  };
}
