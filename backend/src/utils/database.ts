export const getDBURIs = () => ({
  UMS: process.env.DB_UMS_URI!,
  STORIES: [
    process.env.DB_STORY1_URI!,
    process.env.DB_STORY2_URI!,
    process.env.DB_STORY3_URI!,
    process.env.DB_STORY4_URI!,
  ],
})

export const DBNames = {
  story1: 'db_story_1',
  story2: 'db_story_2',
  story3: 'db_story_3',
  story4: 'db_story_4',
  ums: 'ums',
}
export const DB_STORIES_NAMES = [DBNames.story1, DBNames.story2, DBNames.story3, DBNames.story4];

export const MAX_DB_SIZE_MB = 110;