export function getImagePath(imagePath: string) {
  const fullImagePath = `https://image.tmdb.org/t/p/original/${imagePath}.jpg`;
  return fullImagePath;
}
