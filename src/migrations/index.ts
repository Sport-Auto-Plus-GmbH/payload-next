import * as migration_20260910_073952_init from './20260910_073952_init';
import * as migration_20260910_103140_add_corporate_identity from './20260910_103140_add_corporate_identity';
import * as migration_20260910_125744 from './20260910_125744';
import * as migration_20260910_133534 from './20260910_133534';
import * as migration_20260911_045514_seo_and_redirects_plugins from './20260911_045514_seo_and_redirects_plugins';
import * as migration_20260911_052837_vehicle_listing_block from './20260911_052837_vehicle_listing_block';

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
    up: migration_20260911_045514_seo_and_redirects_plugins.up,
    down: migration_20260911_045514_seo_and_redirects_plugins.down,
    name: '20260911_045514_seo_and_redirects_plugins',
  },
  {
    up: migration_20260911_052837_vehicle_listing_block.up,
    down: migration_20260911_052837_vehicle_listing_block.down,
    name: '20260911_052837_vehicle_listing_block'
  },
];
