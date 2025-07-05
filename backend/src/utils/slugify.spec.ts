import { slugify } from './slugify';

describe('slugify', () => {
  it('should lowercase text by default', () => {
    expect(slugify('Xin Chào Hà Nội!')).toBe('xin-chao-ha-noi');
  });

  it('should preserve case when lower is false', () => {
    expect(slugify('Xin Chào Hà Nội!', { lower: false })).toBe(
      'Xin-Chao-Ha-Noi',
    );
  });
});
