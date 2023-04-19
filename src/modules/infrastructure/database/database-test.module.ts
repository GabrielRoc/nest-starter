import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistEntity } from 'src/modules/domain/movies/entities/artist.entity';
import { GenreEntity } from 'src/modules/domain/movies/entities/genre.entity';
import { MovieEntity } from 'src/modules/domain/movies/entities/movie.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      logging: false,
      entities: [User, MovieEntity, ArtistEntity, GenreEntity],
      synchronize: true,
    }),
  ],
})
export class DatabaseTestModule {}
