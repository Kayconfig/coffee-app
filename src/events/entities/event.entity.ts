import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@Index(['name', 'type']) // indexes to speed up look up on the fields in array
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Index() // index a particular column
  @Column()
  name: string;

  @Column('json')
  payload: Record<string, any>;
}
