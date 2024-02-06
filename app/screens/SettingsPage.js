import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Switch} from 'react-native';
import Screen from "../components/Screen";
import defaultStyles from "../config/styles";
import {Ionicons} from '@expo/vector-icons';
import cache from "../utility/cache";
import inMemory from "../utility/inMemory";
import useUpdateNotifications from "../hooks/useUpdateNotifications";

// Definele tipurile de notificări
const notificationTypes = {
    mute: "mute",
    dayOfTask: "today",
    oneDay: "one day",
    threeDays: "three days",
    oneWeek: "one week",
    oneMonth: "one month",
};

function SettingsPage() {
    // Setează valoarea implicită ca "dayOfTask" (sau altă valoare implicită dorită)
    const [notificationSetting, setNotificationSetting] = useState(notificationTypes.dayOfTask);
    const { updateNotifications } = useUpdateNotifications();
    useEffect(() => {
        async function updateNotificationSetting() {
            try {
                console.log("notificationSetting", notificationSetting);
                const newSetting = {
                    notificationsType: notificationSetting
                };
                await cache.store(inMemory.notificationsSettings, newSetting);
                await updateNotifications()
            } catch (error) {
                console.error("Error while storing notification setting:", error);
            }
        }
        updateNotificationSetting();
    }, [notificationSetting]);
    const NotificationOption = ({title, value, iconName}) => (
        <TouchableOpacity
            style={styles.option}
            onPress={() => setNotificationSetting(value)}
        >
            <View style>
                <Ionicons name={iconName} size={24} color={defaultStyles.colors.primary}/>
                <Text style={defaultStyles.secondaryText}>{title}</Text>
            </View>
            <Switch
                trackColor={{false: defaultStyles.colors.accent, true: defaultStyles.colors.primary}}
                thumbColor={notificationSetting === value ? defaultStyles.colors.primaryLight : defaultStyles.colors.secondary}
                onValueChange={() => setNotificationSetting(value)}
                value={notificationSetting === value}
            />
        </TouchableOpacity>
    );

    return (
        <Screen style={styles.container}>
            <Text style={defaultStyles.title}>Notification Settings</Text>
            <NotificationOption title="On the day of the task" value={notificationTypes.dayOfTask} iconName="today"/>
            <NotificationOption title="1 day before" value={notificationTypes.oneDay} iconName="time"/>
            <NotificationOption title="3 days before" value={notificationTypes.threeDays} iconName="calendar"/>
            <NotificationOption title="1 week before" value={notificationTypes.oneWeek} iconName="calendar-outline"/>
            <NotificationOption title="1 month before" value={notificationTypes.oneMonth} iconName="calendar-sharp"/>
            <NotificationOption title="Mute Notifications" value={notificationTypes.mute} iconName="notifications-off"/>
        </Screen>
    );
}

export default SettingsPage;

const styles = StyleSheet.create({
    container: {
        backgroundColor: defaultStyles.colors.background,
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: defaultStyles.colors.primary,
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: defaultStyles.colors.secondary,
    },
    optionText: {
        color: defaultStyles.colors.primary,
        fontSize: 18,
    },
    switchContainer: {
        flexDirection: 'row',
    },
});
