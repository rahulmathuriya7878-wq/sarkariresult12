import { SarkariPost } from '../types/job';

export interface PostAlertItem {
  postId: string;
  postTitle: string;
  slug: string;
  previousStatus: 'upcoming' | 'active' | 'closed';
  createdAt: string;
  lastNotifiedAt?: string;
}

const STORAGE_KEY = 'sarkari_job_post_alerts_v1';

/**
 * Determines whether a job post is 'upcoming', 'active', or 'closed'
 */
export const getPostStatus = (post: SarkariPost): 'upcoming' | 'active' | 'closed' => {
  // If post explicitly specifies status
  if (post.status) return post.status;
  if (post.isUpcoming) return 'upcoming';

  // Check important dates for "Link Activate Soon", "Upcoming", or "Coming Soon"
  const datesStr = (post.importantDates || []).map(d => `${d.label} ${d.value}`).join(' ').toLowerCase();
  const applyLink = (post.directLinks || []).find(l => l.type === 'apply');
  const applyUrl = applyLink?.url || '';

  if (
    datesStr.includes('link activate soon') ||
    datesStr.includes('coming soon') ||
    datesStr.includes('upcoming') ||
    applyUrl.toLowerCase().includes('soon') ||
    applyLink?.actionText.toLowerCase().includes('soon')
  ) {
    return 'upcoming';
  }

  // Check if last date passed (if applicable)
  if (post.lastDate) {
    const today = new Date();
    const lastDateParsed = new Date(post.lastDate);
    if (!isNaN(lastDateParsed.getTime()) && lastDateParsed < today) {
      return 'closed';
    }
  }

  return 'active';
};

/**
 * Retrieve all saved post alerts from localStorage
 */
export const getSavedPostAlerts = (): Record<string, PostAlertItem> => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Error reading saved post alerts:', e);
    return {};
  }
};

/**
 * Check if a specific post has an active alert
 */
export const isPostAlertActive = (postId: string): boolean => {
  const alerts = getSavedPostAlerts();
  return Boolean(alerts[postId]);
};

/**
 * Toggle alert for a post and request browser notification permission if setting alert
 */
export const togglePostAlert = async (
  post: SarkariPost
): Promise<{ isAlertSet: boolean; permission: NotificationPermission | 'unsupported' }> => {
  const alerts = getSavedPostAlerts();
  const currentStatus = getPostStatus(post);

  if (alerts[post.id]) {
    // Remove alert
    delete alerts[post.id];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
    } catch (e) {
      console.error(e);
    }
    return { isAlertSet: false, permission: 'granted' };
  }

  // Request Notification permission if browser supports it
  let permission: NotificationPermission | 'unsupported' = 'unsupported';
  if (typeof window !== 'undefined' && 'Notification' in window) {
    try {
      permission = await Notification.requestPermission();
      if (permission === 'granted') {
        try {
          new Notification(`🔔 Job Alert Set: ${post.shortTitle}`, {
            body: `You will be notified as soon as "${post.title}" status updates from Upcoming to Active!`,
            icon: '/favicon.ico'
          });
        } catch (err) {
          console.warn('Could not fire immediate notification:', err);
        }
      }
    } catch (err) {
      console.warn('Error requesting notification permission:', err);
    }
  }

  // Save alert to localStorage
  alerts[post.id] = {
    postId: post.id,
    postTitle: post.title || post.shortTitle,
    slug: post.slug,
    previousStatus: currentStatus,
    createdAt: new Date().toISOString()
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
  } catch (e) {
    console.error('Error saving post alert:', e);
  }

  return { isAlertSet: true, permission };
};

/**
 * Monitor all posts for status changes (e.g. 'upcoming' -> 'active') and trigger notifications
 */
export const checkAndNotifyPostStatusChanges = (
  posts: SarkariPost[]
): { notifiedCount: number; updatedPostTitles: string[] } => {
  if (typeof window === 'undefined') return { notifiedCount: 0, updatedPostTitles: [] };

  const alerts = getSavedPostAlerts();
  let notifiedCount = 0;
  const updatedPostTitles: string[] = [];
  let updated = false;

  for (const post of posts) {
    const alert = alerts[post.id];
    if (!alert) continue;

    const currentStatus = getPostStatus(post);

    // Detect status transition from 'upcoming' to 'active'
    if (alert.previousStatus === 'upcoming' && currentStatus === 'active') {
      notifiedCount++;
      updatedPostTitles.push(post.shortTitle || post.title);

      // Fire Browser Notification
      if ('Notification' in window && Notification.permission === 'granted') {
        try {
          const notif = new Notification(`🚨 Job Alert NOW ACTIVE: ${post.shortTitle}`, {
            body: `${post.title} is now ACTIVE for Online Application! Click to open details.`,
            icon: '/favicon.ico',
            tag: `job-active-${post.id}`
          });

          notif.onclick = () => {
            window.focus();
            window.location.hash = `post/${post.slug}`;
          };
        } catch (err) {
          console.warn('Notification error:', err);
        }
      }

      // Update stored alert status so we don't spam duplicate notifications
      alerts[post.id] = {
        ...alert,
        previousStatus: 'active',
        lastNotifiedAt: new Date().toISOString()
      };
      updated = true;
    }
  }

  if (updated) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
    } catch (e) {
      console.error('Error updating post alerts:', e);
    }
  }

  return { notifiedCount, updatedPostTitles };
};
