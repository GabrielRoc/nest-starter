import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/modules/infrastructure/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class TodoItem extends BaseEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: false })
  status: boolean;

  @ManyToOne(() => User, (user) => user.todoItems)
  @JoinColumn()
  @Exclude()
  createdBy: User;
}
