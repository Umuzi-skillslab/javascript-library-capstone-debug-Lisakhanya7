export function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

export function hasRequiredBookFields(bookData) {
  return Boolean(
    bookData
    && isNonEmptyString(bookData.isbn)
    && isNonEmptyString(bookData.title)
    && isNonEmptyString(bookData.author)
  );
}
