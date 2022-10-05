import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { WebPage } from './webPage';

@Entity({ name: 'showcased_web_page' })
export class ShowcasedWebPage extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id!: number;

  @Column()
  displayOrder!: number;

  @ManyToOne(() => WebPage)
  webPage!: WebPage;

  @RelationId((self: ShowcasedWebPage) => self.webPage)
  webPageId!: number;
}
