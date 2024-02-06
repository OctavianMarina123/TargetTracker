import React, {useCallback, useLayoutEffect, useState} from "react";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import Screen from "../components/Screen";
import defaultStyles from "../config/styles";
import cache from "../utility/cache";
import inMemory from "../utility/inMemory";
import useAsyncData from "../hooks/useAsyncData";
import {CircularProgress} from 'react-native-circular-progress';
import getProgressColor from "../utility/getProgressColor";
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from "@react-navigation/native";
import pages from "../navigation/pages";

function ProgressTrackerScreen() {
    const fetchTasks = useCallback(() => {
        return cache.get(inMemory.simpleTasks);
    }, []);
    const itemsFunction = useCallback(() => {
        return cache.get(inMemory.itemLists);
    }, []);
    const [isSettingsPressed, setIsSettingsPressed] = useState(false);
    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    onPress={
                        () => {
                            setIsSettingsPressed(true);
                            navigation.navigate(pages.settings);
                        }
                    }
                    style={styles.settingsButton}
                >
                    <Ionicons name="ios-settings" size={30} color={!isSettingsPressed?defaultStyles.colors.primary:defaultStyles.colors.primaryLight}/>
                </TouchableOpacity>
            ),
        });
    }, [navigation]);
    const {data} = useAsyncData(fetchTasks);
    const {data: items} = useAsyncData(itemsFunction);
    console.log("items are", items);
    if (!data || data.length === 0) {
        return (
            <Screen style={styles.container}>
                <View style={styles.fullScreenTouchable}>
                    <Text style={[defaultStyles.title, {color: defaultStyles.colors.secondary}]}>You have no activity
                        yet!</Text>
                </View>
            </Screen>
        );
    }

    const progressByList = data.reduce((acc, task) => {
        const {itemId} = task;
        // Find the item with the matching id in items
        const item = items.find(i => i.id === itemId);
        const itemTitle = item ? item.title : "Unknown Title"; // Fallback title

        acc[itemId] = acc[itemId] || {total: 0, checked: 0, title: itemTitle};
        acc[itemId].total++;
        if (task.checked) {
            acc[itemId].checked++;
        }
        return acc;
    }, {});

    return (
        <Screen style={styles.container}>
            {Object.keys(progressByList).map(itemId => {
                const {total, checked, title} = progressByList[itemId];
                const progressPercent = total > 0 ? (checked / total) * 100 : 0;
                const progressColor = getProgressColor(progressPercent);

                return (
                    <View key={itemId} style={styles.progressContainer}>
                        <CircularProgress
                            size={100}
                            width={15}
                            fill={progressPercent}
                            tintColor={progressColor}
                            backgroundColor={defaultStyles.colors.background}
                        >
                            {(fill) => (
                                <Text style={styles.progressText}>
                                    {`${Math.round(fill)}%`}
                                </Text>
                            )}
                        </CircularProgress>
                        <Text style={[styles.progressText, {color: progressColor}]}>
                            {title} - {progressPercent.toFixed(0)}% Complete
                        </Text>
                    </View>
                );
            })}
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: defaultStyles.colors.background,
        flex: 1,
    },
    fullScreenTouchable: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 525,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        paddingHorizontal: 20,
    },
    progressText: {
        marginLeft: 10,
    },
    settingsButton: {
        marginRight: 15,
    },
});

export default ProgressTrackerScreen;
