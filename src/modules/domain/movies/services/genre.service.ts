import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PaginationParams,
  PaginationResult,
} from 'src/common/interfaces/pagination.interface';
import { Repository } from 'typeorm';
import { CreateGenreDto } from '../dto/create-genre.dto';
import { UpdateGenreDto } from '../dto/update-genre.dto';
import { GenreEntity } from '../entities/genre.entity';

@Injectable()
export class GenreService {
  @InjectRepository(GenreEntity)
  private readonly genreRepository: Repository<GenreEntity>;

  async createGenre(createGenreDto: CreateGenreDto) {
    const newEntity = this.genreRepository.create(createGenreDto);
    return await this.genreRepository.save(newEntity);
  }

  async findAllGenres(
    paginationParams: PaginationParams,
  ): Promise<PaginationResult<GenreEntity>> {
    const genres = await this.genreRepository.findAndCount({
      skip: (paginationParams.page - 1) * paginationParams.limit,
      take: paginationParams.limit,
      relations: ['movies'],
    });

    const meta = {
      itemsPerPage: +paginationParams.limit,
      totalItems: +genres[1],
      currentPage: +paginationParams.page,
      totalPages: +Math.ceil(genres[1] / paginationParams.limit),
    };

    return {
      data: genres[0],
      meta: meta,
    };
  }

  async findOneGenre(id: string): Promise<GenreEntity> {
    const genre = await this.genreRepository.findOne({
      where: { id: id },
      relations: ['movies'],
    });
    if (!genre)
      throw new HttpException('Genre not found', HttpStatus.NOT_FOUND);

    return genre;
  }

  async updateGenre(
    id: string,
    updateGenretDto: UpdateGenreDto,
  ): Promise<GenreEntity> {
    let updatedGenre = await this.findOneGenre(id);
    await this.genreRepository.update(id, updateGenretDto);
    updatedGenre = await this.findOneGenre(id);

    return updatedGenre;
  }

  async removeGenre(id: string): Promise<GenreEntity> {
    const genre = await this.findOneGenre(id);
    await this.genreRepository.softDelete(id);

    return genre;
  }
}
