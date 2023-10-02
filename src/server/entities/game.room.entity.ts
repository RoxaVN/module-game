import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { UserGameRoom } from './user.game.room.entity.js';

@Entity()
export class GameRoom {
  static MODE_DEFAULT = 'default';

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 256 })
  game: string;

  @Column('int', { default: 0 })
  maxUsers: number;

  @Column('int', { default: 0 })
  userCount: number;

  @Column('text', { default: '' })
  name: string;

  @Column('text', { default: GameRoom.MODE_DEFAULT })
  mode: string;

  @Column('boolean', { default: false })
  private: boolean;

  @Column('boolean', { default: false })
  locked: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedDate: Date;

  @OneToMany(() => UserGameRoom, (userGameRoom) => userGameRoom.gameRoom)
  userGameRooms: Relation<UserGameRoom>[];
}
