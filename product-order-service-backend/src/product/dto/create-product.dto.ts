import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  stock: number;

  description: string;

  @IsNotEmpty()
  category: string;
  
  @IsNotEmpty()
  imageUrl: string; 
  @IsNotEmpty()
  isActive: boolean = true; 
}
