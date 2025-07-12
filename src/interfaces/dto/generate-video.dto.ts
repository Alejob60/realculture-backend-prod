import { IsBoolean, IsOptional, IsString, IsNumber, Min, Max} from 'class-validator';
import { Type } from 'class-transformer';

export class GenerateVideoDto {
  @IsString()
  prompt: string;

  @IsOptional()
  @IsBoolean()
  useVoice?: boolean;

  @IsOptional()
  @IsBoolean()
  useSubtitles?: boolean;

  @IsOptional()
  @IsBoolean()
  useMusic?: boolean;

  @IsOptional()
  @IsBoolean()
  useSora?: boolean;

  @IsOptional()
  @IsString()
  plan?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(5)
  @Max(60)
  duration?: number;
}
