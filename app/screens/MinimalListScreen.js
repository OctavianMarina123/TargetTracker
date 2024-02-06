import defaultStyles from "../config/styles";
import MinimalCard from "../components/cards/MinimalCard";
import React, {useCallback, useLayoutEffect, useRef, useState} from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TextInput,
    View,
    Text,
    TouchableOpacity
} from "react-native";
import ListItemDeleteAction from "../components/ListItemDeleteAction";
import Toolbar from "../components/buttons/Toolbar";
import {useNavigation} from "@react-navigation/native";
import inMemory from "../utility/inMemory";
import cache from "../utility/cache";
import useAsyncData from "../hooks/useAsyncData";
import filterItemsByList from "../utility/filterItemsByList";
import DateTimePicker from "@react-native-community/datetimepicker";
import {Entypo} from '@expo/vector-icons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import useUpdateNotifications from "../hooks/useUpdateNotifications";

function MinimalListScreen({route}) {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const isDayOfWeek = (title) => daysOfWeek.includes(title);

    const { updateNotifications } = useUpdateNotifications();
    const {item} = route.params;
    const [editableTitle, setEditableTitle] = useState(item.title);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dueDate, setDueDate] = useState(new Date(item.date));
    const navigation = useNavigation();
    const flatListRef = useRef(null);
    const onChangeDate = async (selectedDate) => {
        const currentDate = selectedDate || dueDate;
        setShowDatePicker(Platform.OS === 'ios');
        setDueDate(currentDate);
        // Verifică dacă titlul curent este o zi a săptămânii
        if (isDayOfWeek(editableTitle)) {
            const newTitle = daysOfWeek[currentDate.getDay()];
            setEditableTitle(newTitle);
            await onUpdateItem({ ...item, title: newTitle, date: currentDate.toISOString().slice(0, 10) });
        } else {
            await onUpdateItem({ ...item, date: currentDate.toISOString().slice(0, 10) });
        }
    };
    const fetchTasks = useCallback(() => cache.get(inMemory.simpleTasks), []);
    const {data: todoItems, setData: setTodoItems} = useAsyncData(fetchTasks);
    const [newItemFocus, setNewItemFocus] = useState(false);
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: item.title
        });
    }, [item.title, navigation]);

    const onUpdateItem = async (newItem) => {
        try {
            const data = await cache.get(inMemory.itemLists);
            const index = data.findIndex(i => i.id === newItem.id);
            if (index === -1) {
                console.log("Item not found");
                return;
            }
            data[index] = newItem;
            await cache.store(inMemory.itemLists, data);
            console.log("newItem",newItem)
            await updateNotifications()
        } catch (e) {
            console.log("Error updating item:", e);
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <TextInput
                    style={[defaultStyles.defaultText, styles.headerTitle]}
                    onChangeText={setEditableTitle}
                    value={editableTitle}
                    onEndEditing={async () => {
                        if(editableTitle.length>1)
                            await onUpdateItem({...item, title: editableTitle});
                        else
                            setEditableTitle(item.title)
                    }}
                />
            ),
        });
    }, [editableTitle, navigation]);

    const isAnyTitleEmpty = () => {
        return todoItems.some(item => item.title.trim() === "");
    };

    const addItem = useCallback(async (id) => {
        console.log("items are", todoItems);
        if (!todoItems.some(item => item.title.trim() === "")) {
            const newItems = [...todoItems, {
                id: Date.now(),
                title: "",
                checked: false,
                itemId: item.id,
                isNew: true,
                isFavorite: false
            }];
            flatListRef.current.scrollToEnd({ animated: true });
            await cache.store(inMemory.simpleTasks, newItems);
            setTodoItems(newItems);
            setNewItemFocus(true);
        }
    }, [todoItems]);



    const handleEndEditing = useCallback(async (id, text) => {
        let newItems = [...todoItems];
        if (text.trim() === "") {
            // Elimină elementul dacă textul este gol
            newItems = newItems.filter(i => i.id !== id);
        } else {
            // Actualizează titlul elementului
            const index = newItems.findIndex(i => i.id === id);
            if (index !== -1) {
                newItems[index].title = text;
                newItems[index].isNew = false; // Setează elementul ca fiind nu mai nou
            }
        }
        try {
            await cache.store(inMemory.simpleTasks, newItems);
            setTodoItems(newItems);
        } catch (e) {
            console.log(e);
        }
        setNewItemFocus(false); // Reset focus
    }, [todoItems]);
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "padding"}
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
            <View style={styles.dateContainer}>
                <TouchableOpacity
                    onPress={() => {
                        if (Platform.OS === 'ios' && showDatePicker) {
                            setShowDatePicker(false);
                        } else {
                            setShowDatePicker(true);
                        }
                    }}
                >
                    <Text
                        style={[defaultStyles.secondaryText]}>
                        Due Date: {dueDate.toLocaleDateString()}
                    </Text>
                </TouchableOpacity>
                <Entypo name="dot-single" size={30} color={defaultStyles.colors.secondary}/>
                <Text style={[defaultStyles.secondaryText]}>
                    Progress: {Math.floor((filterItemsByList(todoItems, item.id).filter(i => i.checked).length / filterItemsByList(todoItems, item.id).length) * 100)}%
                </Text>
            </View>
            {showDatePicker && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={dueDate}
                    mode={'date'}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, selectedDate) => onChangeDate(selectedDate)}
                />
            )}

            <FlatList
                ref={flatListRef}
                data={filterItemsByList(todoItems, item.id)}
                keyExtractor={item => item.id.toString()}
                renderItem={({item, index}) => {
                    const isNewItem = index === todoItems.length - 1;
                    const showBorder = !isNewItem; // Verifică dacă elementul este ultimul și setează showBorder în funcție de asta
                    return (
                        <MinimalCard
                            onEndEditing={(text) => handleEndEditing(item.id, text)}
                            title={item.title}
                            checked={item.checked}
                            onTitleChange={
                                (title)=>{
                                    const newItems = [...todoItems];
                                    const index = newItems.indexOf(item);
                                    newItems[index].title = title;
                                    setTodoItems(newItems);
                                }
                            }
                            isNewItem={item.isNew && newItemFocus}
                            onPress={async () => {
                                const newItems = [...todoItems];
                                const index = newItems.indexOf(item);
                                newItems[index].checked = !newItems[index].checked;
                                try {
                                    await cache.store(inMemory.simpleTasks, newItems);
                                    setTodoItems(newItems);
                                } catch (e) {
                                    console.log(e);
                                }
                            }}
                            onDelete={async () => {
                                const newItems = todoItems.filter(i => i.id !== item.id);
                                try{
                                    await cache.store(inMemory.simpleTasks, newItems);
                                    setTodoItems(newItems);
                                    await updateNotifications()
                                }catch (e) {
                                    console.log(e);
                                }
                            }}
                            renderRightActions={() => {
                                return (
                                    <ListItemDeleteAction onPress={async () => {
                                        try {
                                            const newItems = todoItems.filter(i => i.id !== item.id);
                                            await cache.store(inMemory.simpleTasks, newItems);
                                            setTodoItems(newItems);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }}/>
                                )
                            }}
                            showBorder={showBorder}
                        />
                    )
                }}
            />

            <Toolbar
                dataLength={todoItems ? filterItemsByList(todoItems, item.id).length : 0}
                onPress={addItem}
                disabled={isAnyTitleEmpty()}
            />
        </KeyboardAvoidingView>
    );
}

export default MinimalListScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: defaultStyles.colors.background,
        flex: 1,
    },
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 15,
    },
    headerTitle: {
        color: defaultStyles.colors.button,
        fontWeight: "600",
    }
})