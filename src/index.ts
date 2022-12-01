const day = process.argv.slice(2)[0];

import(`./day${day}/index.ts`);
