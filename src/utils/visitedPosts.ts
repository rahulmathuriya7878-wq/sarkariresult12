const VISITED_KEY = 'sarkari_visited_post_ids_v1';
const CLICK_MAP_KEY = 'sarkari_post_clicks_map_v1';

export const getVisitedPostIds = (): Set<string> => {
  try {
    const saved = localStorage.getItem(VISITED_KEY);
    if (saved) {
      const arr = JSON.parse(saved);
      if (Array.isArray(arr)) {
        return new Set(arr);
      }
    }
  } catch (e) {
    console.error('Failed to parse visited posts', e);
  }
  return new Set();
};

export const getPostClickMap = (): Record<string, number> => {
  try {
    const saved = localStorage.getItem(CLICK_MAP_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse click map', e);
  }
  return {};
};

export const markPostVisited = (idOrSlug: string, secondaryKey?: string): Set<string> => {
  const current = getVisitedPostIds();
  current.add(idOrSlug);
  if (secondaryKey) current.add(secondaryKey);
  try {
    localStorage.setItem(VISITED_KEY, JSON.stringify(Array.from(current)));
  } catch (e) {
    console.error('Failed to save visited post', e);
  }

  // Increment Click Count Map
  try {
    const clickMap = getPostClickMap();
    clickMap[idOrSlug] = (clickMap[idOrSlug] || 0) + 1;
    if (secondaryKey) {
      clickMap[secondaryKey] = (clickMap[secondaryKey] || 0) + 1;
    }
    localStorage.setItem(CLICK_MAP_KEY, JSON.stringify(clickMap));
  } catch (e) {
    console.error('Failed to update post click map', e);
  }

  return current;
};

export const isPostVisited = (visitedSet: Set<string>, post: { id: string; slug?: string }): boolean => {
  if (!post) return false;
  return visitedSet.has(post.id) || (!!post.slug && visitedSet.has(post.slug));
};

export const getPostClicks = (post: { id: string; slug?: string; clickCount?: number }, clickMap?: Record<string, number>): number => {
  if (!post) return 0;
  const map = clickMap || getPostClickMap();
  const mapClicks = Math.max(map[post.id] || 0, (post.slug ? map[post.slug] || 0 : 0));
  const postPropClicks = post.clickCount || 0;
  return Math.max(mapClicks, postPropClicks);
};
