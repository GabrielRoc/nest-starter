import { BaseEntity } from 'src/common/entities/base.entity';
import { generateHash } from 'src/common/utils/hash.util';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = generateHash(this.password);
  }
}
