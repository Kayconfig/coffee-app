import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCoffeeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Name of coffee' })
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Brand of coffee' })
  readonly brand: string;

  @IsString({ each: true })
  @ApiProperty({ examples: ['vanilla'] })
  readonly flavors: string[];
}
