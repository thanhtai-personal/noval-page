export const getLimitConfig = () => ({
  ON: process.env.DEBUG_CRAWL === 'true',
  DEMO_STORIES_NUMBER: 6000,
  DEMO_CHAPTERS_NUMBER: 20000,
  DEMO_CRAWL_PAGES: 6000 / 20 + 1,
});
