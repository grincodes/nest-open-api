import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export enum CatBreed {
  sesimi,
  shortfur,
  bongle,
}

export class CreateCatDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @ApiProperty({
    description: 'age of cat',
    minimum: 1,
    default: 1,
  })
  @IsNumber()
  @Min(1)
  @Max(12)
  age: number;

  @ApiProperty({ enum: ['sesimi', 'shortfur', 'bongle'] })
  breed: CatBreed;
}
