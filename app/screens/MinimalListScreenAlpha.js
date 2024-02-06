import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform, TextInput, TouchableOpacity, Text
} from 'react-native';
import Toolbar from "../components/buttons/Toolbar";
import defaultStyles from '../config/styles';
import MinimalCardAlpha from "../components/cards/MinimalCardAlpha";
import filterItemsByList from "../utility/filterItemsByList";
import useAsyncData from "../hooks/useAsyncData";
import cache from "../utility/cache";
import inMemory from "../utility/inMemory";
import ListItemDeleteAction from "../components/ListItemDeleteAction";
import {useNavigation} from "@react-navigation/native";
import {Entypo} from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import useUpdateNotifications from "../hooks/useUpdateNotifications";

const fetchTasks = () => cache.get(inMemory.simpleTasks);

function MinimalListScreenAlpha({route}) {
    const {data: todoItems, setData: setTodoItems} = useAsyncData(fetchTasks);
    const {item} = route.params;
    const navigation = useNavigation();
    const flatListRef = useRef(null);
    const titleRef = useRef(null);
    const [focusedItemId, setFocusedItemId] = useState(null);
    const [dueDate, setDueDate] = useState(item.date);
    const [editableTitle, setEditableTitle] = useState(item.title ? item.title : "");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const {updateNotifications} = useUpdateNotifications();

    useEffect(() => {
        if (item.title.length === 0 && titleRef.current) {
            setTimeout(() => titleRef.current.focus(), 500); // Increase delay
        }
    }, [item.title]);
    const addItem = async () => {
        const focusedItem = todoItems.find(item => item.id === focusedItemId);
        if (focusedItem && focusedItem.title === "") {
            console.log("item is empty", focusedItem)
            return;
        }

        //implement add item
        const newTodoItems = [...todoItems];
        const id = newTodoItems.length + 1;

        console.log("focus is", id)
        setFocusedItemId(id);

        const newItem = {
            id,
            title: "",
            checked: false,
            itemId: item.id,
        };

        newTodoItems.push(newItem);

        try {
            const filteredItems = newTodoItems.filter(item => item.title !== "");
            await cache.store(inMemory.simpleTasks, filteredItems);
            setTodoItems(newTodoItems);
        } catch (e) {
            console.log(e);
        }

        flatListRef.current.scrollToEnd({animated: true});
    }

    const checkItem = async id => {
        const newTodoItems = [...todoItems];
        const todoItem = newTodoItems.find(item => item.id === id);
        todoItem.checked = !todoItem.checked;
        try {
            await cache.store(inMemory.simpleTasks, newTodoItems);
            setTodoItems(newTodoItems);
        } catch (e) {
            console.log(e);
        }
    };

    const updateItem = async (item, local = true,checkTitle = false) => {
        if (checkTitle && item.title === "") {
            itemLostFocus(item.id);
            return;
        }
        const newTodoItems = [...todoItems];
        const todoItem = newTodoItems.find(newItem => newItem.id === item.id);
        todoItem.title = item.title;
        try {
            if (!local) {
                //dont store items with empty title
                const filteredItems = newTodoItems.filter(newItem => newItem.title !== "");
                await cache.store(inMemory.simpleTasks, filteredItems);
            }
            setTodoItems(newTodoItems);
        } catch (e) {
            console.log(e);
        }
    }

    const onDelete = id => async () => {
        console.log("delete", id);
        const newTodoItems = [...todoItems];
        const index = newTodoItems.findIndex(item => item.id === id);
        newTodoItems.splice(index, 1);
        try {
            await cache.store(inMemory.simpleTasks, newTodoItems);
            setTodoItems(newTodoItems);
        } catch (e) {
            console.log(e);
        }
    }

    const itemLostFocus = async id => {
        //check if item is empty
        const newTodoItems = [...todoItems];
        const todoItem = newTodoItems.find(item => item.id === id);
        console.log("item lost focus", todoItem)
        if (todoItem.title.length === 0) {
            console.log("item is empty", todoItem)
            onDelete(id)();
        }
    }
    const onUpdateTasks = async (newItem) => {
        try {
            const data = await cache.get(inMemory.itemLists);
            const index = data.findIndex(i => i.id === newItem.id);
            if (index === -1) {
                console.log("Item not found");
                return;
            }
            data[index] = newItem;
            await cache.store(inMemory.itemLists, data);
            console.log("newItem", newItem)
            await updateNotifications()
        } catch (e) {
            console.log("Error updating item:", e);
        }
    };

    const saveTitle = async (text) => {
        setEditableTitle(text);
        if (text === "") {
            await onUpdateTasks({...item, title: "Untitled"});
            return;
        }
        await onUpdateTasks({...item, title: text});
    }
    const onChangeDate = async (selectedDate) => {
        const currentDate = selectedDate || dueDate;

        setShowDatePicker(Platform.OS === 'ios');
        setDueDate(currentDate.toISOString());

        // Change the title to the day of the week
        setEditableTitle(item.title);
        await onUpdateTasks({...item, title: item.title, date: currentDate.toISOString().slice(0, 10)});
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboarAvoidingView}
            keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 100}
        >
            <TextInput
                style={[defaultStyles.title, styles.headerTitle]}
                value={editableTitle}
                multiline={true}
                maxLength={100}
                onChangeText={text => saveTitle(text)}
                placeholder={"Title"}
                ref={titleRef}
                onEndEditing={event => saveTitle(event.nativeEvent.text)}
            />
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
                        Due Date: {dueDate.slice(0, 10)}
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
                    value={new Date(dueDate)}
                    mode={'date'}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, selectedDate) => onChangeDate(selectedDate)}
                />
            )}

            <View style={styles.container}>
                <FlatList
                    style={{
                        marginBottom: 60,
                    }}
                    data={filterItemsByList(todoItems, item.id)}
                    keyExtractor={item => item.id.toString()}
                    ref={flatListRef}
                    renderItem={({item, index}) => {
                        const isNewItem = index === todoItems.length - 1;
                        const showBorder = !isNewItem;
                        return (
                            <MinimalCardAlpha
                                autoFocus={item.id === focusedItemId}
                                style={styles.card}
                                textInputStyle={styles.cardTextInput}
                                checked={item.checked}
                                title={item.title}
                                onPress={async () => checkItem(item.id)}
                                onChange={text => updateItem({...item, title: text}, true)}
                                onEndEditing={text => updateItem({...item, title: text}, false,true)}
                                showBorder={showBorder}
                                renderRightActions={() => {
                                    return (
                                        <ListItemDeleteAction
                                            onPress={onDelete(item.id)}
                                        />
                                    )
                                }}
                            />
                        )
                    }}
                />
                <Toolbar
                    onPress={addItem}
                    dataLength={todoItems ? filterItemsByList(todoItems, item.id).length : 0}
                />
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: defaultStyles.colors.background,
        justifyContent: "flex-end",
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginVertical: 5,
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    cardTextInput: {
        fontSize: 16,
        color: '#333',
    },
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 15,
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: "600",
        marginLeft: 15,
    },
    keyboarAvoidingView: {
        flex: 1,
        backgroundColor: defaultStyles.colors.background,
    },
});

export default MinimalListScreenAlpha;
