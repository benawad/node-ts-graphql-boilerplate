import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable
} from "typeorm";
import { User } from "./User";

@Entity()
export class Post {
  @PrimaryGeneratedColumn() id: number;

  @Column() title: string;

  @ManyToMany(() => User)
  @JoinTable({ name: "vote" })
  users: User[];
}
