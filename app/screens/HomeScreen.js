import React, {useCallback, useEffect, useState} from 'react';
import {Modal, StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import Screen from '../components/Screen';
import defaultStyles from '../config/styles';
import Toolbar from '../components/buttons/Toolbar';
import GroupedList from "../components/GroupedList";
import HomeCard from "../components/cards/HomeCard";
import ListItemDeleteAction from "../components/ListItemDeleteAction";
import listTypes from "../config/listTypes";
import useAsyncData from "../hooks/useAsyncData";
import cache from "../utility/cache";
import inMemory from "../utility/inMemory";
import AddListModal from "../components/modals/AddListModal";
import OnHoldModalComponent from "../components/modals/OnHoldModalComponent";
import pages from "../navigation/pages";
import MinimalCard from "../components/cards/MinimalCard";
import ItemCard from "../components/cards/ItemCard";
import {useFocusEffect} from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import useLocalNotifications from "../hooks/useLocalNotifications";
import notificationTypes from "../config/notificationTypes";
import useUpdateNotifications from "../hooks/useUpdateNotifications";


function HomeScreen({navigation}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [onHoldModalVisible, setOnHoldModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const fetchTasks = useCallback(() => {
        return cache.get(inMemory.itemLists);
    }, []);
    const {data, loading, error, setData} = useAsyncData(fetchTasks);
    const {updateNotifications} = useUpdateNotifications();
    const onHold = (item) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setSelectedItem(item);
        setOnHoldModalVisible(true);
    }

    useFocusEffect(
        useCallback(() => {
            console.log('HomeScreen is now in focus');
            fetchTasks().then(newData => setData(newData));
            return () => {
                console.log('HomeScreen is now out of focus');
            };
        }, [])
    );
    const addList = async (title, description, type) => {
        const id = (data ? data.length : 0) + 1;
        const newListItem = {
            id: id,
            title: title,
            description: description,
            date: new Date().toISOString().slice(0, 10),
            favorite: false,
            type: type,
            isFavorite: false,
        };

        const newData = [...(data || []), newListItem];
        await cache.store(inMemory.itemLists, newData);

        const pageMapping = {
            [listTypes.minimaList]: pages.minimalList,
            [listTypes.proList]: pages.proList,
        };

        const navigateToPage = pageMapping[type];
        if (navigateToPage) {
            navigation.navigate(navigateToPage, {item: newListItem});
        }
    }


    const addSimpleList = async (title, description) => {
        const id = (data ? data.length : 0) + 1;
        const newListItem = {
            id: id,
            title: title,
            description: description,
            // date: new Date().toISOString().slice(0, 10),
            date: new Date().toISOString().slice(0, 16), // "YYYY-MM-DDTHH:mm"
            isFavorite: false,
            type: listTypes.minimaList,
        };
        const newData = [...(data || []), newListItem];
        try {
            navigation.navigate(pages.minimalList, {item: newListItem});
            await cache.store(inMemory.itemLists, newData);
        } catch (e) {
            console.log('Eroare la adaugarea datelor:', e);
        }

        await updateNotifications()
    }


    const onPress = useCallback((item) => {
        if (item.type === listTypes.minimaList)
            navigation.navigate(pages.minimalList, {item: item});
        else if (item.type === listTypes.proList)
            navigation.navigate(listTypes.proList, {item: item});
    }, [navigation]);


    const onDelete = async (selectedItem) => {
        try {
            //delete item
            const newItems = data.filter(i => i.id !== selectedItem.id);
            await cache.store(inMemory.itemLists, newItems);
            setData(newItems);

            //delete data from item
            const simpleTasks = await cache.get(inMemory.simpleTasks);
            const newSimpleTasks = simpleTasks.filter(i => i.itemId !== selectedItem.id);
            await cache.store(inMemory.simpleTasks, newSimpleTasks);
        } catch (e) {
            console.log('Eroare la stergerea datelor:', e);
        }
    }
    const renderCard = useCallback((item, showBorder, style) =>
            (
                <ItemCard
                    title={item.title}
                    onPress={() => onPress(item)}
                    showBorder={showBorder}
                    style={style}
                    description={item.description}
                    onHold={() => onHold(item)}
                    date={item.date}
                    renderRightActions={() => {
                        return (
                            <ListItemDeleteAction
                                onPress={() => onDelete(item)}
                            />
                        )
                    }
                    }
                />)
        , [data, onPress]);
    return (
        <Screen style={styles.container}>
            {
                data && data.length === 0 &&
                <View style={styles.fullScreenTouchable}>
                    <Text style={[defaultStyles.title, {color: defaultStyles.colors.secondary}]}>Start setting your
                        goals</Text>
                </View>
            }
            <GroupedList
                items={data}
                renderCard={renderCard}
            />
            <Toolbar onPress={() => {
                addSimpleList('', '')

            }
            }
                     dataLength={data ? data.length : 0}
                     itemName={(data.length === 1) ? 'List' : 'Lists'}
                     showHistory={true}
            />
            <AddListModal
                modalVisible={modalVisible}
                setModalVisible={() => {
                    setModalVisible(true)
                }}
                onAddList={addList}
            />
            <OnHoldModalComponent
                modalVisible={onHoldModalVisible}
                setModalVisible={setOnHoldModalVisible}
                selectedItem={selectedItem}
                onFavor={async () => {
                    try {
                        const newItems = [...data];
                        const index = newItems.findIndex(item => item.id === selectedItem.id);
                        newItems[index].isFavorite = !newItems[index].isFavorite;
                        await cache.store(inMemory.itemLists, newItems);
                        setData(newItems);
                    } catch (e) {
                        console.log('Eroare la actualizarea datelor:', e);
                    }
                }}
                onDelete={() => {
                    onDelete(selectedItem)
                }}
                onScreenshot={() => {/* Functia de screenshot */
                }}
                onUpdateItem={async (newItem) => {
                    try {
                        if (newItem.title.length === 0)
                            newItem.title = "Untitled";
                        const newItems = [...data];
                        const index = newItems.findIndex(item => item.id === newItem.id);
                        newItems[index].title = newItem.title;
                        await cache.store(inMemory.itemLists, newItems);
                        setData(newItems);

                    } catch (e) {
                        console.log('Eroare la actualizarea datelor:', e);
                    }
                }}
            />
        </Screen>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: defaultStyles.colors.background
    },
    fullScreenTouchable: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalViewTouchable: {
        position: 'absolute',
        right: 60,
        bottom: 100,
        backgroundColor: defaultStyles.colors.accent,
        borderRadius: 20,
        padding: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalButton: {
        backgroundColor: defaultStyles.colors.button,
        padding: 10,
        marginVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalButtonText: {
        color: defaultStyles.colors.background,
    },
});
