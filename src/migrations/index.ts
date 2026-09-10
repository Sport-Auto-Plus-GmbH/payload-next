import * as migration_20260910_073952_init from './20260910_073952_init';

export const migrations = [
  {
    up: migration_20260910_073952_init.up,
    down: migration_20260910_073952_init.down,
    name: '20260910_073952_init'
  },
];
