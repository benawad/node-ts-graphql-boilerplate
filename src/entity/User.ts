import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column({ type: "varchar", length: "230" })
  username: string;

  @Column({ type: "varchar" })
  password: string;
}
