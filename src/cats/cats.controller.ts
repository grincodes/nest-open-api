import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { CatBreed, CreateCatDTO } from './dto/create-cat-dto';
import { CreateCatOwnerDTO } from './dto/create-cat-owner';

@ApiTags('Wo cats')
// @ApiSecurity('basic')
@Controller('cats')
export class CatsController {
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createCatDTO: CreateCatDTO) {
    return createCatDTO;
  }

  @ApiBody({ type: CreateCatOwnerDTO })
  @Post('owner')
  assignOwner(@Body() createCatOwnerDTO: CreateCatOwnerDTO) {
    return createCatOwnerDTO;
  }

  @ApiBearerAuth()
  @ApiQuery({ name: 'breed', enum: CatBreed })
  @Get('breed')
  getbyBreed(@Query('breed') breed) {
    return breed;
  }

  @Get('age')
  getAge() {
    return 12;
  }
}
