export const getDBURIs = () => ({
  UMS: process.env.DB_UMS_URI!,
  STORIES: [
    process.env.DB_STORY1_URI!,
    process.env.DB_STORY2_URI!,
    process.env.DB_STORY3_URI!,
    process.env.DB_STORY4_URI!,
    process.env.DB_STORY5_URI!,
  ],
})

export const DBNames = {
  story1: 'db_story_1',
  story2: 'db_story_2',
  story3: 'db_story_3',
  story4: 'db_story_4',
  story5: 'db_story_5',
  ums: 'ums',
}
export const DB_STORIES_NAMES = [DBNames.story1, DBNames.story2, DBNames.story3, DBNames.story4, DBNames.story5];

export const MAX_DB_SIZE_MB = 120;

export const switchModelByDBLimit = async (...models: any[]) => {
  // Check limited size for database to choose which db can use
  // Assumes each model has a 'db' property with 'stats' method returning { dataSize: number }
  for (const model of models) {
    const stats = await model.db.stats();
    const sizeMB = stats.dataSize / (1024 * 1024);
    if (sizeMB < MAX_DB_SIZE_MB) {
      return model;
    }
  }
  throw new Error('All databases have reached the maximum size limit.');
}

export const getExpForNextLevel = (currentLevel = 0) => {
  return Math.pow(10, currentLevel + 3); //1000, 10000, 100000,....
}