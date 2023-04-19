import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { JoiPipe } from 'nestjs-joi';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { PaginationResponseDto } from 'src/common/dtos/pagination.dto';
import { PaginationParams } from 'src/common/interfaces/pagination.interface';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';
import { MovieEntity } from '../entities/movie.entity';
import { MovieService } from '../services/movie.service';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post('create')
  async create(
    @Body(new JoiPipe({ group: 'CREATE' })) createMovieDto: CreateMovieDto,
  ) {
    return this.movieService.createMovie(createMovieDto);
  }

  @Get('list')
  async findAll(@Pagination() paginationParams: PaginationParams) {
    return new PaginationResponseDto<MovieEntity>(
      await this.movieService.findAllMovies(paginationParams),
    );
  }

  @Get('get/:id')
  async findOne(@Param('id') id: string) {
    return await this.movieService.findOneMovie(id);
  }

  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body(new JoiPipe({ group: 'UPDATE' })) updateMovieDto: UpdateMovieDto,
  ) {
    return await this.movieService.updateMovie(id, updateMovieDto);
  }

  @Post('delete/:id')
  async delete(@Param('id') id: string) {
    return await this.movieService.removeMovie(id);
  }
}
