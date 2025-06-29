export const getDBURIs = () => ({
  UMS: process.env.DB_UMS_URI!,
  STORIES: [
    process.env.DB_STORY1_URI!,
    process.env.DB_STORY2_URI!,
    process.env.DB_STORY3_URI!,
  ],
})

export const DBNames = {
  story1: 'db_story_1',
  story2: 'db_story_2',
  story3: 'db_story_3',
  ums: 'ums',
}

export const provideNames = {
  story1: 'DB_STORY_1_MODELS',
  story2: 'DB_STORY_2_MODELS',
  story3: 'DB_STORY_3_MODELS',
  ums: 'DB_UMS_URI',
}

export const DBStoryProvideNames = [provideNames.story1, provideNames.story2, provideNames.story3]

export const DB_STORIES_NAMES = [DBNames.story1, DBNames.story2, DBNames.story3];

export const MAX_DB_SIZE_MB = 110;