import { rm } from 'fs/promises';
import { join } from 'path';

global.beforeEach(async () => {
  try {
    await rm(join(__dirname, '..', 'test.sqlite'));
  } catch (error) {}
});

// Close connection after each test using the new methods
// global.afterEach(async () => {
//   const connection = getConnection();
//   await connection.close();
// });
