import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Photo {
  @PrimaryGeneratedColumn() id: number;

  @Column() url: string;

  @Column({ nullable: true })
  userId: number;

  @ManyToOne(() => User, user => user.photos)
  user: User;
}
