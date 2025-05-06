export function extractVideoId(url: string): string | null {
  // Handle regular YouTube URLs
  const standardRegExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const standardMatch = url.match(standardRegExp);
  if (standardMatch && standardMatch[7].length === 11) {
    return standardMatch[7];
  }
  
  // Handle YouTube Shorts URLs
  const shortsRegExp = /^.*((youtube.com)|(youtu.be))\/shorts\/([a-zA-Z0-9_-]{11}).*/;
  const shortsMatch = url.match(shortsRegExp);
  if (shortsMatch && shortsMatch[4].length === 11) {
    return shortsMatch[4];
  }
  
  return null;
}