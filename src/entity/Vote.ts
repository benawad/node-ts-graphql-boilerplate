import { Entity, Column, OneToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { User } from "./User";
import { Post } from "./Post";

@Entity()
export class Vote {
  @Column({ type: "int" })
  value: number;

  @PrimaryColumn("int") userId: number;

  @PrimaryColumn("int") postId: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToOne(() => Post)
  @JoinColumn()
  post: Post;
}
