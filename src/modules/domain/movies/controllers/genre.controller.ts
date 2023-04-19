import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { JoiPipe } from 'nestjs-joi';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { PaginationResponseDto } from 'src/common/dtos/pagination.dto';
import { PaginationParams } from 'src/common/interfaces/pagination.interface';
import { CreateGenreDto } from '../dto/create-genre.dto';
import { UpdateGenreDto } from '../dto/update-genre.dto';
import { GenreEntity } from '../entities/genre.entity';
import { GenreService } from '../services/genre.service';

@Controller('genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Post('create')
  async create(
    @Body(new JoiPipe({ group: 'CREATE' })) createGenreDto: CreateGenreDto,
  ) {
    return this.genreService.createGenre(createGenreDto);
  }

  @Get('list')
  async findAll(@Pagination() paginationParams: PaginationParams) {
    return new PaginationResponseDto<GenreEntity>(
      await this.genreService.findAllGenres(paginationParams),
    );
  }

  @Get('get/:id')
  async findOne(@Param('id') id: string) {
    return await this.genreService.findOneGenre(id);
  }

  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body(new JoiPipe({ group: 'UPDATE' })) updateGenreDto: UpdateGenreDto,
  ) {
    return await this.genreService.updateGenre(id, updateGenreDto);
  }

  @Post('delete/:id')
  async delete(@Param('id') id: string) {
    return await this.genreService.removeGenre(id);
  }
}
