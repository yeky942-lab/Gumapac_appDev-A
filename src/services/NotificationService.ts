import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import { store } from '../app/store';
import { UPDATE_ORDER_STATUS } from '../app/reducers/ordersReducer';

/**
 * Display local notification (for foreground messages)
 */
export const displayLocalNotification = async (title: string, body: string, data?: any) => {
  try {
    // Handle order status updates
    if (data?.type === 'order_status_update' && data?.order_id && data?.status) {
      // Dispatch action to update order status in Redux store
      store.dispatch({
        type: UPDATE_ORDER_STATUS,
        payload: {
          orderId: data.order_id,
          status: data.status,
        },
      });
      console.log('✅ [Notifications] Order status updated in Redux store');
    }

    // Create notification channel for Android
    if (Platform.OS === 'android') {
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
      });
    }

    // Display system notification
    await notifee.displayNotification({
      title: title,
      body: body,
      data: data || {},
      android: {
        channelId: 'default',
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default',
        },
      },
      ios: {
        sound: 'default',
      },
    });

    console.log('✅ [Notifications] System notification displayed');
  } catch (error) {
    console.log('❌ [Notifications] Notification error:', error);
    // Fallback to alert if notification fails
    Alert.alert(title, body, [
      { text: 'OK', onPress: () => console.log('Notification dismissed') }
    ]);
  }
};

/**
 * Create notification channel (required for Android 8.0+)
 * Firebase handles this automatically, but we ensure permissions are granted
 */
export const createNotificationChannel = async () => {
  if (Platform.OS === 'android') {
    try {
      // Request POST_NOTIFICATIONS permission for Android 13+
      if (Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('⚠️  [Notifications] POST_NOTIFICATIONS permission denied');
        } else {
          console.log('✅ [Notifications] POST_NOTIFICATIONS permission granted');
        }
      }
      
      console.log('✅ [Notifications] Firebase handles channel creation automatically');
    } catch (error) {
      console.log('❌ [Notifications] Permission error:', error);
    }
  }
};

/**
 * Request notification permission and get FCM token
 */
export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
      return token;
    } else {
      console.log('Notification permission denied');
      return null;
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return null;
  }
};

/**
 * Check if notification permission is granted
 */
export const checkNotificationPermission = async (): Promise<boolean> => {
  try {
    const authStatus = await messaging().hasPermission();
    return authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
           authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  } catch (error) {
    console.error('Error checking notification permission:', error);
    return false;
  }
};

/**
 * Get FCM token (without requesting permission)
 */
export const getFCMToken = async (): Promise<string | null> => {
  try {
    const token = await messaging().getToken();
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

/**
 * Setup notification listeners for foreground messages
 */
export const setupNotificationListeners = () => {
  // Foreground message handler
  const unsubscribe = messaging().onMessage(async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
    console.log('Received foreground message:', remoteMessage);
    
    // Display local notification when app is in foreground
    if (remoteMessage.notification) {
      displayLocalNotification(
        remoteMessage.notification.title || 'New Notification',
        remoteMessage.notification.body || '',
        remoteMessage.data
      );
    }
  });

  // Background/quit state messages are handled automatically by FCM
  // Register background message handler
  messaging().setBackgroundMessageHandler(async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
    console.log('Received background message:', remoteMessage);
    // Handle background message
  });

  return unsubscribe;
};

/**
 * Delete FCM token (useful for logout)
 */
export const deleteFCMToken = async (): Promise<boolean> => {
  try {
    await messaging().deleteToken();
    console.log('FCM token deleted');
    return true;
  } catch (error) {
    console.error('Error deleting FCM token:', error);
    return false;
  }
};

/**
 * Subscribe to a topic
 */
export const subscribeToTopic = async (topic: string): Promise<boolean> => {
  try {
    await messaging().subscribeToTopic(topic);
    console.log(`Subscribed to topic: ${topic}`);
    return true;
  } catch (error) {
    console.error(`Error subscribing to topic ${topic}:`, error);
    return false;
  }
};

/**
 * Unsubscribe from a topic
 */
export const unsubscribeFromTopic = async (topic: string): Promise<boolean> => {
  try {
    await messaging().unsubscribeFromTopic(topic);
    console.log(`Unsubscribed from topic: ${topic}`);
    return true;
  } catch (error) {
    console.error(`Error unsubscribing from topic ${topic}:`, error);
    return false;
  }
};

/**
 * Initialize notifications
 */
export const initializeNotifications = async () => {
  try {
    // Check if running on device
    if (Platform.OS === 'android') {
      // Create notification channel and request permissions
      await createNotificationChannel();
      
      // Request permission and get token
      const token = await requestNotificationPermission();
      if (token) {
        // Setup listeners
        setupNotificationListeners();
        return token;
      }
    }
    return null;
  } catch (error) {
    console.error('Error initializing notifications:', error);
    return null;
  }
};
