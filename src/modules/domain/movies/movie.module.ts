import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistController } from './controllers/artist.controller';
import { GenreController } from './controllers/genre.controller';
import { MovieController } from './controllers/movie.controller';
import { ArtistEntity } from './entities/artist.entity';
import { GenreEntity } from './entities/genre.entity';
import { MovieEntity } from './entities/movie.entity';
import { ArtistService } from './services/artist.service';
import { GenreService } from './services/genre.service';
import { MovieService } from './services/movie.service';

@Module({
  imports: [TypeOrmModule.forFeature([MovieEntity, ArtistEntity, GenreEntity])],
  providers: [MovieService, ArtistService, GenreService],
  controllers: [MovieController, ArtistController, GenreController],
  exports: [TypeOrmModule],
})
export class MovieModule {}
