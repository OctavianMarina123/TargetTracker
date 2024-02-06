import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import cache from '../utility/cache';
import inMemory from '../utility/inMemory';
import {now} from "moment";
import notificationTypes from "../config/notificationTypes";

const useUpdateNotifications = () => {
    const cancelAllNotifications = async () => {
        const allNotifications = await Notifications.getAllScheduledNotificationsAsync();
        console.log(`Found ${allNotifications.length} scheduled notifications. Cancelling them...`);
        for (const notification of allNotifications) {
            await Notifications.cancelScheduledNotificationAsync(notification.identifier);
        }
        console.log('All scheduled notifications have been cancelled.');
    };

    const scheduleTaskNotifications = async () => {
        const simpleTasks = await cache.get(inMemory.itemLists);
        const taskDueSettings = await cache.get(inMemory.notificationsSettings);

        if (taskDueSettings.notificationsType === 'mute') {
            console.log('Notifications are muted. No new notifications will be scheduled.');
            return;
        }

        console.log(`Scheduling new notifications based on type: ${taskDueSettings.notificationsType}`);
        for (const task of simpleTasks) {
            let triggerDate = new Date(task.date);
            const now = new Date();
            switch (taskDueSettings.notificationsType) {
                case notificationTypes.dayOfTask:
                    triggerDate.setHours(now.getHours(), now.getMinutes() + 120, 0, 0);
                    break;
                case notificationTypes.oneDay:
                    triggerDate.setDate(triggerDate.getDate() - 1);
                    break;
                case notificationTypes.threeDays:
                    triggerDate.setDate(triggerDate.getDate() - 3);
                    break;
                case notificationTypes.oneWeek:
                    triggerDate.setDate(triggerDate.getDate() - 7);
                    break;
                case notificationTypes.oneMonth:
                    triggerDate.setMonth(triggerDate.getMonth() - 1);
                    break;
                default:
                    break;
            }
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Task Reminder",
                    body: `Reminder for task: ${task.title}`
                },
                trigger: triggerDate,
            });

            console.log(`Scheduled notification for task: ${task.title} at ${triggerDate}`);
        }
    };

        const updateNotifications = async () => {
            console.log('Updating notifications...');
            await cancelAllNotifications();
            await scheduleTaskNotifications();
            console.log('Notifications have been updated.');
        };



    return {updateNotifications};
};

export default useUpdateNotifications;
