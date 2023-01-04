import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCatOwnerDTO {
  @ApiProperty()
  @IsString()
  ownerName: string;
}
