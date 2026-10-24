import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

let messaging: any = null;
try {
  if (typeof window !== 'undefined' && 'navigator' in window && 'serviceWorker' in navigator) {
    messaging = getMessaging(app);
  }
} catch (e) {
  console.warn('Firebase Messaging not supported or initialized in this environment:', e);
}

export interface FcmSubscriptionResult {
  success: boolean;
  token?: string;
  error?: string;
}

/**
 * Request Notification permission and obtain FCM device token, saving it to Firestore.
 */
export async function requestFcmPermissionAndToken(): Promise<FcmSubscriptionResult> {
  if (!messaging) {
    return { success: false, error: 'Firebase Messaging is not supported in this browser.' };
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return { success: false, error: 'Notification permission denied by user.' };
    }

    // Get VAPID key or token
    // Note: In web push, a vapidKey can be passed if configured in Firebase Console.
    // For standard web push without explicit vapid key or using default:
    const token = await getToken(messaging, {
      vapidKey: 'BPL_DEFAULT_VAPID_KEY_PLACEHOLDER_OR_YOUR_KEY' // Firebase Web Push VAPID key can be provided or auto-generated
    }).catch(async () => {
      // Fallback if VAPID key fails or is required without key
      return await getToken(messaging);
    });

    if (token) {
      // Save token to Firestore fcm_tokens collection
      const tokenDocId = `token_${token.slice(0, 32)}`;
      await setDoc(doc(db, 'fcm_tokens', tokenDocId), {
        token,
        createdAt: new Date().toISOString()
      }, { merge: true });

      console.log('FCM Token successfully saved:', token);
      return { success: true, token };
    } else {
      return { success: false, error: 'Failed to retrieve FCM registration token.' };
    }
  } catch (error: any) {
    console.error('Error requesting FCM token:', error);
    return { success: false, error: error.message || String(error) };
  }
}

/**
 * Setup foreground message listener
 */
export function setupForegroundFcmListener(onNotificationCallback: (payload: any) => void) {
  if (!messaging) return;
  try {
    onMessage(messaging, (payload) => {
      console.log('Foreground FCM message received:', payload);
      onNotificationCallback(payload);
    });
  } catch (e) {
    console.warn('Error setting up foreground message listener:', e);
  }
}

/**
 * Simulate sending a push notification for Job Alerts, Exam Dates, or Result Releases
 */
export function simulatePushNotification(type: 'job_alert' | 'exam_date' | 'result', title: string, body: string) {
  if (typeof window === 'undefined' || !('Notification' in window)) return;

  if (Notification.permission === 'granted') {
    let iconEmoji = '🔔';
    if (type === 'job_alert') iconEmoji = '🚨';
    if (type === 'exam_date') iconEmoji = '📅';
    if (type === 'result') iconEmoji = '🏆';

    try {
      new Notification(`${iconEmoji} Sarkari Result FCM Push: ${title}`, {
        body,
        icon: '/favicon.ico',
        tag: `fcm-${type}-${Date.now()}`
      });
    } catch (err) {
      console.warn('Simulated push notification error:', err);
    }
  }
}
