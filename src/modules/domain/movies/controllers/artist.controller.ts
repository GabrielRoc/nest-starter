import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { JoiPipe } from 'nestjs-joi';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { PaginationResponseDto } from 'src/common/dtos/pagination.dto';
import { PaginationParams } from 'src/common/interfaces/pagination.interface';
import { CreateArtistDto } from '../dto/create-artist.dto';
import { UpdateArtistDto } from '../dto/update-artist.dto';
import { ArtistEntity } from '../entities/artist.entity';
import { ArtistService } from '../services/artist.service';

@Controller('artists')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post('create')
  async create(
    @Body(new JoiPipe({ group: 'CREATE' })) createArtistDto: CreateArtistDto,
  ) {
    return this.artistService.createArtist(createArtistDto);
  }

  @Get('list')
  async findAll(@Pagination() paginationParams: PaginationParams) {
    return new PaginationResponseDto<ArtistEntity>(
      await this.artistService.findAllArtists(paginationParams),
    );
  }

  @Get('get/:id')
  async findOne(@Param('id') id: string) {
    return await this.artistService.findOneArtist(id);
  }

  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body(new JoiPipe({ group: 'UPDATE' })) updateArtistDto: UpdateArtistDto,
  ) {
    return await this.artistService.updateArtist(id, updateArtistDto);
  }

  @Post('delete/:id')
  async delete(@Param('id') id: string) {
    return await this.artistService.removeArtist(id);
  }
}
