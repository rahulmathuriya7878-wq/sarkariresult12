const VISITED_KEY = 'sarkari_visited_post_ids_v1';

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

export const markPostVisited = (idOrSlug: string): Set<string> => {
  const current = getVisitedPostIds();
  current.add(idOrSlug);
  try {
    localStorage.setItem(VISITED_KEY, JSON.stringify(Array.from(current)));
  } catch (e) {
    console.error('Failed to save visited post', e);
  }
  return current;
};

export const isPostVisited = (visitedSet: Set<string>, post: { id: string; slug?: string }): boolean => {
  if (!post) return false;
  return visitedSet.has(post.id) || (!!post.slug && visitedSet.has(post.slug));
};
