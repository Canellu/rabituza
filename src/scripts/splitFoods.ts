/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const CHUNK_SIZE = 100;

async function splitFoodsFile() {
  const foodsPath = path.join(process.cwd(), 'src/data/foods.json');

  if (!fs.existsSync(foodsPath)) {
    console.error(`Error: File not found: ${foodsPath}`);
    return;
  }

  const foods = JSON.parse(fs.readFileSync(foodsPath, 'utf-8')).foods;

  console.log(`✅ Loaded ${foods.length} food items`);

  // Create output directory if it doesn't exist
  const outputDir = path.join(process.cwd(), 'public/data/foods');
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`✅ Directory created: ${outputDir}`);

  for (let i = 0; i < foods.length; i += CHUNK_SIZE) {
    const chunk = foods.slice(i, i + CHUNK_SIZE);
    const chunkPath = path.join(
      outputDir,
      `foods-${Math.floor(i / CHUNK_SIZE)}.json`
    );

    try {
      fs.writeFileSync(chunkPath, JSON.stringify(chunk, null, 2), 'utf-8');
      console.log(`✅ Created chunk: ${chunkPath}`);
    } catch (err) {
      console.error(`❌ Failed to write file: ${chunkPath}`, err);
    }
  }

  console.log('✅ Splitting complete!');
}

splitFoodsFile().catch(console.error);
