import {useEffect} from 'react';
import * as Notifications from 'expo-notifications';

const useLocalNotifications = () => {
    useEffect(() => {
        const subscription = Notifications.addNotificationReceivedListener(notification => {
            console.log('Notification received:', notification);
        });

        return () => subscription.remove();
    }, []);

    const scheduleNotification = async (title, body, date) => {
        return await Notifications.scheduleNotificationAsync({
            content: {title, body},
            trigger: date,
        });
    };

    const cancelNotification = async (identifier) => {
        await Notifications.cancelScheduledNotificationAsync(identifier);
    };

    return { scheduleNotification, cancelNotification };
};

export default useLocalNotifications;
