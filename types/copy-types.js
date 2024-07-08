const fs = require('fs');
const path = require('path');

const sourceFile = './types.d.ts';
const targetDirectories = [
  '../backend/src/types',
  '../extension/src/types'
];

for (const targetDir of targetDirectories) {
  const targetFile = path.join(targetDir, 'types.d.ts');
  fs.mkdirSync(path.dirname(targetFile), { recursive: true });
  fs.copyFileSync(sourceFile, targetFile);
  console.log(`Copied ${sourceFile} to ${targetFile}`);
}
