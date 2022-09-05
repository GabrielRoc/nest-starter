import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/modules/infrastructure/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Category } from '../../category/entities/category.entity';

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

  @ManyToOne((type) => Category, (category) => category.todoItems)
  @JoinColumn()
  category: Category;
}
