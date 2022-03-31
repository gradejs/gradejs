import { Table } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export class NamingStrategy extends SnakeNamingStrategy {
  // Ref: https://github.com/typeorm/typeorm/blob/master/src/naming-strategy/DefaultNamingStrategy.ts
  indexName(tableOrName: Table | string, columnNames: string[]) {
    const tableName = typeof tableOrName === 'string' ? tableOrName : tableOrName.name;

    return `${tableName.replace('.', '_')}_${columnNames.join('_')}_idx`;
  }

  primaryKeyName(tableOrName: Table | string, columnNames: string[]) {
    const tableName = typeof tableOrName === 'string' ? tableOrName : tableOrName.name;

    return `${tableName.replace('.', '_')}_${columnNames.join('_')}_pkey`;
  }

  foreignKeyName(tableOrName: Table | string, columnNames: string[]) {
    const tableName = typeof tableOrName === 'string' ? tableOrName : tableOrName.name;

    return `${tableName.replace('.', '_')}_${columnNames.join('_')}_fkey`;
  }
}
