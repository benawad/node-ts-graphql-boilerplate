import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne,
  JoinColumn,
  OneToMany
} from "typeorm";
import { Profile } from "./Profile";
import { Photo } from "./Photo";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column({ type: "varchar", length: "230" })
  firstName: string;

  @Column({ nullable: true })
  profileId: number;

  @OneToOne(() => Profile)
  @JoinColumn()
  profile: Profile;

  @OneToMany(() => Photo, photo => photo.user)
  photos: Photo[];
}
