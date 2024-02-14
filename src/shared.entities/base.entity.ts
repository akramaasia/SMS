import { Entity, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity("base")
export class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;


  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
  
  constructor(entityBase?: Partial<BaseEntity>)
  {
    //if (entityBase)
    {
      Object.assign(this, entityBase);
    }
  }
}
