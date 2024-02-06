import React, {useEffect} from "react";
import {Alert, StyleSheet} from "react-native";
import defaultStyles from "./app/config/styles";
import {NavigationContainer} from "@react-navigation/native";
import AppNavigator from "./app/navigation/AppNavigator";
import ProListScreen from "./app/screens/ProListScreen";
import cache from "./app/utility/cache";
import ProCardEditScreen from "./app/screens/ProCardEditScreen";
import inMemory from "./app/utility/inMemory";
import * as Notifications from "expo-notifications";
import notificationTypes from "./app/config/notificationTypes";
import { LogBox } from 'react-native';
export default function App() {
    const initializeLocalStorage = async () => {
        const existingTags = await cache.get(inMemory.tags);
        if (!existingTags) {
            const defaultTags = ['Urgent', 'Personal', 'Work'];
            await cache.store(inMemory.tags, defaultTags);
        }

        const simpleTasks = await cache.get(inMemory.simpleTasks);
        if (!simpleTasks) {
            const defaultTasks = [];
            await cache.store(inMemory.simpleTasks, defaultTasks);
        }

        const proTasks = await cache.get(inMemory.proTasks);

        if (!proTasks) {
            const defaultTasks = [];
            await cache.store(inMemory.proTasks, defaultTasks);
        }

        const itemLists = await cache.get(inMemory.itemLists);

        if(!itemLists) {
            const defaultLists = [];
            await cache.store(inMemory.itemLists, defaultLists);
        }

        const notificationsSettings = await cache.get(inMemory.notificationsSettings);

        if(!notificationsSettings) {
            const defaultSettings = {
                notificationsType:notificationTypes.dayOfTask
            };
            await cache.store(inMemory.notificationsSettings, defaultSettings);
        }
/*
        await cache.clear(inMemory.tags)
        await cache.clear(inMemory.proTasks)
        await cache.clear(inMemory.simpleTasks)
        await cache.clear(inMemory.itemLists)
        await cache.clear(inMemory.notificationsSettings)
        console.log(simpleTasks);
        */
    };
    const registerForPushNotificationsAsync = async () => {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Hey! You might want to enable notifications for a better experience!');
            return;
        }
    };


    useEffect(async () => {
        const init = async () => {
            try {
                LogBox.ignoreAllLogs();
                await initializeLocalStorage();
                await registerForPushNotificationsAsync();
            } catch (error) {
                // Manevrarea erorilor (e.g., afișarea unui mesaj de eroare)
                console.error("Initialization error:", error);
            }
        };
        await init();
    }, []);

    return (
        <NavigationContainer>
            <AppNavigator/>
        </NavigationContainer>
    );

}