export function slugify(text: string, options?: { lower?: boolean }): string {
  const processed = (options?.lower !== false ? text.toLowerCase() : text)
    .normalize('NFD') // bỏ dấu tiếng Việt
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  return processed;
}
