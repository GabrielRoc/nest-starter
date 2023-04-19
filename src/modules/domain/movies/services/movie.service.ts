import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PaginationParams,
  PaginationResult,
} from 'src/common/interfaces/pagination.interface';
import { ArrayContains, Repository } from 'typeorm';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';
import { ArtistEntity } from '../entities/artist.entity';
import { GenreEntity } from '../entities/genre.entity';
import { MovieEntity } from '../entities/movie.entity';

@Injectable()
export class MovieService {
  @InjectRepository(MovieEntity)
  private readonly movieRepository: Repository<MovieEntity>;

  @InjectRepository(ArtistEntity)
  private readonly artistRepository: Repository<ArtistEntity>;

  @InjectRepository(GenreEntity)
  private readonly genreRepository: Repository<GenreEntity>;

  async createMovie(createMovieDto: CreateMovieDto) {
    const director = await this.artistRepository.findOneBy({
      id: createMovieDto.directorId,
    });

    if (!director)
      throw new HttpException('Director not found', HttpStatus.BAD_REQUEST);

    const cast = await this.artistRepository.findBy({
      id: ArrayContains(createMovieDto.castIds),
    });

    if (createMovieDto.castIds.length !== cast.length)
      throw new HttpException('Some actors not found', HttpStatus.BAD_REQUEST);

    const genres = await this.genreRepository.findBy({
      id: ArrayContains(createMovieDto.genresIds),
    });

    if (createMovieDto.genresIds.length !== genres.length)
      throw new HttpException('Some genres not found', HttpStatus.BAD_REQUEST);

    const newEntity = this.movieRepository.create({
      ...createMovieDto,
      director,
      cast,
      genres,
    });
    return await this.movieRepository.save(newEntity);
  }

  async findAllMovies(
    paginationParams: PaginationParams,
  ): Promise<PaginationResult<MovieEntity>> {
    const movies = await this.movieRepository.findAndCount({
      skip: (paginationParams.page - 1) * paginationParams.limit,
      take: paginationParams.limit,
      relations: ['director', 'cast', 'genres'],
    });

    const meta = {
      itemsPerPage: +paginationParams.limit,
      totalItems: +movies[1],
      currentPage: +paginationParams.page,
      totalPages: +Math.ceil(movies[1] / paginationParams.limit),
    };

    return {
      data: movies[0],
      meta: meta,
    };
  }

  async findOneMovie(id: string): Promise<MovieEntity> {
    const movie = await this.movieRepository.findOne({
      where: { id: id },
      relations: ['director', 'cast', 'genres'],
    });
    if (!movie)
      throw new HttpException('Movie not found', HttpStatus.NOT_FOUND);

    return movie;
  }

  async updateMovie(
    id: string,
    updateMovieDto: UpdateMovieDto,
  ): Promise<MovieEntity> {
    let updatedMovie = await this.findOneMovie(id);

    if (updateMovieDto.directorId) {
      const director = await this.artistRepository.findOneBy({
        id: updateMovieDto.directorId,
      });

      if (!director)
        throw new HttpException('Director not found', HttpStatus.BAD_REQUEST);

      updatedMovie.director = director;
    }

    if (updateMovieDto.castIds) {
      const cast = await this.artistRepository.findBy({
        id: ArrayContains(updateMovieDto.castIds),
      });

      if (updateMovieDto.castIds.length !== cast.length)
        throw new HttpException(
          'Some actors not found',
          HttpStatus.BAD_REQUEST,
        );

      updatedMovie.cast = cast;
    }

    if (updateMovieDto.genresIds) {
      const genres = await this.genreRepository.findBy({
        id: ArrayContains(updateMovieDto.genresIds),
      });

      if (updateMovieDto.genresIds.length !== genres.length)
        throw new HttpException(
          'Some genres not found',
          HttpStatus.BAD_REQUEST,
        );

      updatedMovie.genres = genres;
    }

    await this.movieRepository.update(id, updatedMovie);
    updatedMovie = await this.findOneMovie(id);

    return updatedMovie;
  }

  async removeMovie(id: string): Promise<MovieEntity> {
    const movie = await this.findOneMovie(id);
    await this.movieRepository.softDelete(id);

    return movie;
  }
}
