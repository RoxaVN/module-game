import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { GameRoom } from './game.room.entity.js';

@Entity()
@Unique(['game', 'userId'])
export class UserGameRoom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('uuid')
  userId: string;

  @Column({ type: 'varchar', length: 256 })
  game: string;

  @Column('uuid')
  gameRoomId: string;

  @ManyToOne(() => GameRoom, (gameRoom) => gameRoom.userGameRooms)
  gameRoom: Relation<GameRoom>;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedDate: Date;
}
