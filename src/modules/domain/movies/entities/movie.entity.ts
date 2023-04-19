import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, ManyToMany, ManyToOne } from "typeorm";
import { ArtistEntity } from "./artist.entity";
import { GenreEntity } from "./genre.entity";

@Entity()
export class MovieEntity extends BaseEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  duration: number;

  @Column()
  year: number;

  @Column()
  image: string;

  @ManyToMany(() => ArtistEntity, (artist) => artist.moviesCast)
  cast: ArtistEntity[];

  @ManyToOne(() => ArtistEntity, (artist) => artist.moviesDirected)
  director: ArtistEntity;

  @ManyToMany(() => GenreEntity, (genre) => genre.movies)
  genres: GenreEntity[];
}