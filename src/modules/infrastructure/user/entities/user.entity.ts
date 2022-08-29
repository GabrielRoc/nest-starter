import { BaseEntity } from 'src/common/entities/base.entity';
import { generateHash } from 'src/common/utils/hash.util';
import { TodoItem } from 'src/modules/domain/todo-item/entities/todo-item.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => TodoItem, (todoItem) => todoItem.createdBy)
  todoItems: TodoItem[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = generateHash(this.password);
  }
}
