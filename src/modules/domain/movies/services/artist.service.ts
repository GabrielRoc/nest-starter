import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PaginationParams,
  PaginationResult,
} from 'src/common/interfaces/pagination.interface';
import { Repository } from 'typeorm';
import { CreateArtistDto } from '../dto/create-artist.dto';
import { UpdateArtistDto } from '../dto/update-artist.dto';
import { ArtistEntity } from '../entities/artist.entity';

@Injectable()
export class ArtistService {
  @InjectRepository(ArtistEntity)
  private readonly artistRepository: Repository<ArtistEntity>;

  async createArtist(createArtistDto: CreateArtistDto) {
    const newEntity = this.artistRepository.create(createArtistDto);
    return await this.artistRepository.save(newEntity);
  }

  async findAllArtists(
    paginationParams: PaginationParams,
  ): Promise<PaginationResult<ArtistEntity>> {
    const artists = await this.artistRepository.findAndCount({
      skip: (paginationParams.page - 1) * paginationParams.limit,
      take: paginationParams.limit,
      relations: ['moviesDirected', 'moviesCast'],
    });

    const meta = {
      itemsPerPage: +paginationParams.limit,
      totalItems: +artists[1],
      currentPage: +paginationParams.page,
      totalPages: +Math.ceil(artists[1] / paginationParams.limit),
    };

    return {
      data: artists[0],
      meta: meta,
    };
  }

  async findOneArtist(id: string): Promise<ArtistEntity> {
    const artist = await this.artistRepository.findOne({
      where: { id: id },
      relations: ['moviesDirected', 'moviesCast'],
    });
    if (!artist)
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);

    return artist;
  }

  async updateArtist(
    id: string,
    updateArtistDto: UpdateArtistDto,
  ): Promise<ArtistEntity> {
    let updatedArtist = await this.findOneArtist(id);
    await this.artistRepository.update(id, updateArtistDto);
    updatedArtist = await this.findOneArtist(id);

    return updatedArtist;
  }

  async removeArtist(id: string): Promise<ArtistEntity> {
    const artist = await this.findOneArtist(id);
    await this.artistRepository.softDelete(id);

    return artist;
  }
}
