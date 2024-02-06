import Screen from "../components/Screen";
import defaultStyles from "../config/styles";
import {Button, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import React, {useEffect, useRef, useState} from "react";
import {AntDesign} from '@expo/vector-icons';
import Toolbar from "../components/buttons/Toolbar";
import cache from "../utility/cache";
import Tag from "../components/Tag";
import {Ionicons} from '@expo/vector-icons';
import AddTagModal from "../components/modals/AddTagModal";
import DeleteTagModal from "../components/modals/DeleteTagModal";
import {useNavigation} from "@react-navigation/native";
import inMemory from "../utility/inMemory";
import pages from "../navigation/pages";

function ProCardEditScreen({route}) {
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const textInputRef = useRef(null);
    const [addTagModalVisible, setAddTagModalVisible] = useState(false);
    const [deleteTagModalVisible, setDeleteTagModalVisible] = useState(false);
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedTagIndex, setSelectedTagIndex] = useState(null);
    const [title, setTitle] = useState("Title");
    const [description, setDescription] = useState("Description");
    const navigation = useNavigation();
    const item = route.params;
    const loadTags = async () => {
        const savedTags = await cache.get(inMemory.tags);
        if (savedTags) {
            setTags(savedTags);
        }
    };
    const handleDeleteTag = async () => {
        const newTags = tags.filter((_, index) => index !== selectedTagIndex);
        setTags(newTags);
        await cache.store(inMemory.tags, newTags);
        setDeleteTagModalVisible(false);
    };

    useEffect(() => {
        loadTags();
    }, []);
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        if (show && mode === currentMode) {
            setShow(false);
        } else {
            setShow(true);
            setMode(currentMode);
        }
    };

    const updateTags = async () => {
        const savedTags = await cache.get('tags');
        if (savedTags) {
            setTags(savedTags);
        }
    };

    const updateSelectedTags = (index) => {
        const newSelectedTags = [...selectedTags];
        const tagIndex = newSelectedTags.indexOf(index);

        if (tagIndex !== -1) {
            newSelectedTags.splice(tagIndex, 1);
        } else {
            newSelectedTags.push(index);
        }

        setSelectedTags(newSelectedTags);
    };

    const handleSaveCard = async () => {
        try {
            // Ensure existingCards is always an array
            const existingCards = await cache.get(inMemory.proTasks) || [];


            const newTags = selectedTags.map(tag => tags[tag]);
            const newCard = {
                id: Date.now(),
                title: title,
                date: date,
                tags: newTags,
                description: description,
                favorite: false,
                itemId: item.id,
            };

            // Now existingCards is guaranteed to be an array
            const updatedCards = [...existingCards, newCard];

            await cache.store(inMemory.proTasks, updatedCards);
            navigation.navigate(pages.proList, {item: item});
        } catch (error) {
            console.error('Error in handleSaveCard:', error);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.areaContainer}>
                <TextInput
                    placeholder={"Title"}
                    placeholderTextColor={defaultStyles.colors.secondary}
                    onChange={(event) => setTitle(event.nativeEvent.text)}
                    style={[defaultStyles.title]}/>
                <View style={styles.separator}/>
                <View style={styles.dateContainer}>
                    <Text onPress={() => showMode('date')} style={[defaultStyles.defaultText, styles.dateText]}>
                        {date.toLocaleDateString()}
                    </Text>
                    <Text onPress={() => showMode('time')} style={defaultStyles.defaultText}>
                        {date.getHours()}:{date.getMinutes()}
                    </Text>
                </View>
                {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={mode}
                        is24Hour={true}
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={onChange}
                    />
                )}
                <View style={styles.separator}/>
                <Text
                    style={[defaultStyles.secondaryText, {color: defaultStyles.colors.secondary}]}
                >
                    #Tags
                </Text>
                <View style={styles.tagsContainer}>
                    {tags.map((tag, index) => (
                        <Tag
                            key={index}
                            tag={tag}
                            index={index}
                            onLongPress={() => {
                                if (!editable) return; // Add this check
                                setSelectedTagIndex(index);
                                setDeleteTagModalVisible(true);
                            }}
                            onPress={() => updateSelectedTags(index)}
                        />
                    ))}
                </View>
                <TouchableOpacity onPress={() => setAddTagModalVisible(true)}>
                    <Ionicons
                        name="ios-add-circle-sharp"
                        size={30}
                        color={defaultStyles.colors.primary}
                    />
                </TouchableOpacity>
                <View style={styles.separator}/>
                <TouchableOpacity style={{flex: 1, backgroundColor: defaultStyles.colors.background}}
                                  onPress={() => this.textInput.focus()}>
                    <TextInput
                        ref={(input) => {
                            this.textInput = input;
                        }}
                        multiline={true}
                        numberOfLines={10}
                        textAlignVertical='top'
                        style={defaultStyles.defaultText}
                        onChange={(event) => setDescription(event.nativeEvent.text)}
                        placeholder="Description"
                        placeholderTextColor={defaultStyles.colors.secondary}
                    />
                </TouchableOpacity>
            </View>
            <Toolbar IconComponent={AntDesign} iconName="addfile" onPress={handleSaveCard}/>
            <AddTagModal
                visible={addTagModalVisible}
                onClose={() => setAddTagModalVisible(false)}
                onAddTag={() => console.log("pressed")}
                onSuccess={updateTags}
            />
            <DeleteTagModal
                visible={deleteTagModalVisible}
                onClose={() => setDeleteTagModalVisible(false)}
                onSuccess={handleDeleteTag}
            />
        </View>
    )
}

export default ProCardEditScreen;

const styles = StyleSheet.create({
    areaContainer: {
        backgroundColor: defaultStyles.colors.background,
        marginLeft: 30,
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: defaultStyles.colors.background,
    },
    dateContainer: {
        marginVertical: 10,
        borderColor: defaultStyles.colors.secondary,
        flexDirection: 'row',

    },
    dateText: {
        marginRight: 15,
    },
    separator: {
        width: '100%',
        height: 1,
        backgroundColor: defaultStyles.colors.secondary,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 4,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
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
    modalTextInput: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: '80%',
    },
})