import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { User } from "./User";

export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}
export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

@Entity("tasks")
@Index(["userId"])
export class Task {
  @PrimaryGeneratedColumn("uuid") id!: string;
  @Column({ length: 200 }) title!: string;
  @Column({ type: "text", nullable: true }) description!: string | null;
  @Column({ type: "enum", enum: TaskStatus, default: TaskStatus.TODO })
  status!: TaskStatus;
  @Column({ type: "enum", enum: TaskPriority, default: TaskPriority.MEDIUM })
  priority!: TaskPriority;
  @Column({ type: "date", nullable: true }) dueDate!: string | null;
  @Column({ type: "uuid" }) userId!: string;
  @ManyToOne(() => User, (user) => user.tasks, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;
  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
}
