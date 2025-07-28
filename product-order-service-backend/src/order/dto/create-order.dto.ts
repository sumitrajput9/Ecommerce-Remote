import { IsNotEmpty, IsString, IsArray, ValidateNested, IsInt, IsUUID, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto { // Renamed for clarity as it's a DTO for an item within an order
  @IsUUID('4', { message: 'Product ID must be a valid UUID.' })
  @IsNotEmpty({ message: 'Product ID cannot be empty.' })
  productId: string;

  @IsInt({ message: 'Quantity must be an integer.' })
  @IsPositive({ message: 'Quantity must be a positive number.' })
  @IsNotEmpty({ message: 'Quantity cannot be empty.' })
  quantity: number;
}

export class CreateOrderDto {
  @IsUUID('4', { message: 'Customer ID must be a valid UUID.' })
  @IsNotEmpty({ message: 'Customer ID cannot be empty.' })
  customerId: string;

  @IsArray({ message: 'Items must be an array.' })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto) // Ensure this refers to the renamed DTO
  items: CreateOrderItemDto[];
}