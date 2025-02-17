import { Food } from '@/types/Food';
import { openDB } from 'idb';

const DB_VERSION = 1;
const chunkCount = 22; // Number of chunk files in /public/data/foods
const DATABASE_NAME = 'foodsDatabase';
const STORE_NAME = 'foodsStore';

export const countFoodDataEntries = async (): Promise<number> => {
  const db = await openDB(DATABASE_NAME, 1);
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const count = await store.count();
  return count;
};

export const estimateFoodDataSize = async (): Promise<number> => {
  const db = await openDB(DATABASE_NAME, 1);
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const foods = await store.getAll();
  const sizeInBytes = foods.reduce((total, food) => {
    return total + new Blob([JSON.stringify(food)]).size;
  }, 0);
  return sizeInBytes;
};

// ✅ Open IndexedDB and ensure correct schema
export const openFoodDB = async () => {
  console.log('Opening food database...');
  return openDB(DATABASE_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        console.log('Creating object store:', STORE_NAME);
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'foodId' }); // ✅ Use foodId as keyPath
        store.createIndex('foodName', 'foodName'); // Index for searching by food name
      }
    },
  });
};

// ✅ Save foods to the database (batch insert)
export const saveFoodsToDB = async (foods: Food[]) => {
  console.log(`Saving ${foods.length} foods to DB...`);
  const db = await openFoodDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);

  for (const food of foods) {
    if (!food.foodId) {
      // console.error(`Skipping food without foodId:`, food);
      continue; // Skip entries without a valid foodId
    }

    // Ensure foodId is a string
    food.foodId = String(food.foodId);

    // console.log(`Saving food:`, {
    //   id: food.foodId,
    //   name: food.foodName,
    //   type: typeof food.foodId,
    // });

    try {
      await store.put(food); // ✅ Use put to avoid duplicates
      // console.log(`Saved food: ${food.foodName} (ID: ${food.foodId})`);
    } catch (error) {
      // console.error(`Error saving food ID ${food.foodId}:`, error);
    }
  }

  await tx.done;
  console.log('✅ All foods saved successfully.');

  // 🚀 Verify data immediately after saving
  const storedFoods = await getAllFoodsFromDB();
  console.log(`🔍 IndexedDB contains ${storedFoods.length} foods after save.`);
};

// ✅ Retrieve a food item by its ID
export const getFoodFromDB = async (foodId: string) => {
  console.log(`Fetching food with ID: ${foodId}`);
  const db = await openFoodDB();
  const store = db.transaction(STORE_NAME).objectStore(STORE_NAME);
  const food = await store.get(foodId);
  console.log(`Fetched food:`, food);
  return food;
};

// ✅ Retrieve all food items from the database
export const getAllFoodsFromDB = async () => {
  console.log('Fetching all foods from DB...');
  const db = await openFoodDB();
  const store = db.transaction(STORE_NAME).objectStore(STORE_NAME);
  const foods = await store.getAll();
  console.log(`Fetched ${foods.length} foods from DB.`);
  return foods;
};

// ✅ Function to load chunked foods from public/data/foods and save to IndexedDB
export const loadChunkedFoodsFromFiles = async () => {
  console.log('📥 Loading chunked foods from files...');
  const allFoods: Food[] = [];

  for (let i = 0; i < chunkCount; i++) {
    const chunkPath = `/data/foods/foods-${i}.json`; // Path to the chunk files

    try {
      const response = await fetch(chunkPath);
      if (!response.ok) {
        throw new Error(`Failed to fetch chunk: ${chunkPath}`);
      }
      const chunkData: Food[] = await response.json();
      console.log(`✅ Loaded ${chunkData.length} foods from ${chunkPath}`);
      allFoods.push(...chunkData);
    } catch (err) {
      console.error(`❌ Error fetching chunk data from ${chunkPath}:`, err);
    }
  }

  console.log(`Total foods loaded from all chunks: ${allFoods.length}`);
  if (allFoods.length > 0) {
    await saveFoodsToDB(allFoods);
  }
};
