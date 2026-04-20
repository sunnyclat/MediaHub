export function requireFields(obj, fields = []) {
  for (const field of fields) {
    if (!obj[field]) return field;
  }
  return null;
}