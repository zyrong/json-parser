import { resolve } from 'path';
import { readdirSync } from 'fs'
import fs from 'fs/promises'
import jsonParse from '../src/index'

const FIXTURES_DIR = resolve(__dirname, './fixtures')
const TEST_TIMEOUT = 10000;

describe('fixtures', () => {
  const filenames = readdirSync(FIXTURES_DIR)

  it.each(filenames)(
    'test %s',
    async (filename) => {
      const jsonPath = resolve(FIXTURES_DIR, filename);
      const jsonBuf = await fs.readFile(jsonPath)
      const json = jsonBuf.toString()

      const visitor = jsonParse(json)
      if (visitor) {
        expect(visitor.body).toMatchSnapshot()
      } else {
        expect(visitor).toBe(null)
      }
    },
    TEST_TIMEOUT,
  );
})