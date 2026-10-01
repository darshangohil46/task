import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Task } from "./Task";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid") id!: string;
  @Column({ length: 100 }) name!: string;
  @Column({ unique: true, length: 255 }) email!: string;
  @Column() password!: string;
  @OneToMany(() => Task, (task) => task.user) tasks!: Task[];
  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
}
