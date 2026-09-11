import * as migration_20260910_073952_init from './20260910_073952_init';
import * as migration_20260910_103140_add_corporate_identity from './20260910_103140_add_corporate_identity';
import * as migration_20260910_125744 from './20260910_125744';
import * as migration_20260910_133534 from './20260910_133534';
import * as migration_20260911_083922 from './20260911_083922';
import * as migration_20260911_104134 from './20260911_104134';

export const migrations = [
  {
    up: migration_20260910_073952_init.up,
    down: migration_20260910_073952_init.down,
    name: '20260910_073952_init',
  },
  {
    up: migration_20260910_103140_add_corporate_identity.up,
    down: migration_20260910_103140_add_corporate_identity.down,
    name: '20260910_103140_add_corporate_identity',
  },
  {
    up: migration_20260910_125744.up,
    down: migration_20260910_125744.down,
    name: '20260910_125744',
  },
  {
    up: migration_20260910_133534.up,
    down: migration_20260910_133534.down,
    name: '20260910_133534',
  },
  {
    up: migration_20260911_083922.up,
    down: migration_20260911_083922.down,
    name: '20260911_083922',
  },
  {
    up: migration_20260911_104134.up,
    down: migration_20260911_104134.down,
    name: '20260911_104134'
  },
];
