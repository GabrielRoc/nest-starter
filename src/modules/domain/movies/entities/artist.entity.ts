import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { MovieEntity } from './movie.entity';

@Entity()
export class ArtistEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  image: string;

  @ManyToMany(() => MovieEntity, (movie) => movie.cast)
  moviesCast: MovieEntity[];

  @OneToMany(() => MovieEntity, (movie) => movie.director)
  moviesDirected: MovieEntity[];
}
