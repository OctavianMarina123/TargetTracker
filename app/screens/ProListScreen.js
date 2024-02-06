import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import defaultStyles from "../config/styles";
import ProCard from "../components/cards/ProCard";
import GroupedList from "../components/GroupedList";
import Toolbar from "../components/buttons/Toolbar";
import {useNavigation} from "@react-navigation/native";
import cache from "../utility/cache";
import inMemory from "../utility/inMemory";
import useAsyncData from "../hooks/useAsyncData";
import pages from "../navigation/pages";
import filterItemsByList from "../utility/filterItemsByList";
import proCardStatus from "../config/proCardStatus";

function ProListScreen({route}) {
    /*
    const [data,setData] = useState([
        { id: 18, title: 'Task 0', date: '2023-12-19', description: 'Descriere Task 0 ASFDJKASLDFKJALSKDFJLASKDFJALSDKFJALDSKJ', checked: false, status: 'În așteptare', tags: ['Urgent', 'Personal'] },
        { id: 19, title: 'Task 0', date: '2023-12-20', description: 'Descriere Task 0', checked: false, status: 'În progres', tags: ['Muncă'] },
        { id: 20, title: 'Task 0', date: '2023-12-21', description: 'Descriere Task 0', checked: false, status: 'Finalizat', tags: ['Studiu'] },
        { id: 1, title: 'Task 1', date: '2024-01-01', description: 'Descriere Task 1', checked: false, status: 'În așteptare', tags: ['Personal', 'Fitness'] },
        { id: 2, title: 'Task 2', date: '2024-01-02', description: 'Descriere Task 2', checked: false, status: 'În progres', tags: ['Muncă', 'Proiect'] },
        { id: 3, title: 'Task 3', date: '2024-01-05', description: 'Descriere Task 3', checked: false, status: 'Finalizat', tags: ['Călătorie'] },
        { id: 4, title: 'Task 4', date: '2024-01-10', description: 'Descriere Task 4', checked: false, status: 'În așteptare', tags: ['Studiu', 'Cercetare'] },
        { id: 5, title: 'Task 5', date: '2024-01-15', description: 'Descriere Task 5', checked: false, status: 'În progres', tags: ['Personal', 'Sănătate'] },
        { id: 6, title: 'Task 6', date: '2024-02-01', description: 'Descriere Task 6', checked: false, status: 'Finalizat', tags: ['Muncă', 'Urgent'] },
        { id: 7, title: 'Task 7', date: '2024-02-20', description: 'Descriere Task 7', checked: false, status: 'În așteptare', tags: ['Vacanță'] },
        { id: 8, title: 'Task 8', date: '2024-03-05', description: 'Descriere Task 8', checked: false, status: 'În progres', tags: ['Proiect', 'Echipă'] },
        { id: 9, title: 'Task 9', date: '2024-04-01', description: 'Descriere Task 9', checked: false, status: 'Finalizat', tags: ['Personal', 'Hobby'] },
        { id: 10, title: 'Task 10', date: '2024-05-15', description: 'Descriere Task 10', checked: false, status: 'În așteptare', tags: ['Studiu', 'Online'] },
        { id: 11, title: 'Task 11', date: '2024-06-20', description: 'Descriere Task 11', checked: false, status: 'În progres', tags: ['Muncă', 'Termen Limită'] },
        { id: 12, title: 'Task 12', date: '2024-07-30', description: 'Descriere Task 12', checked: false, status: 'Finalizat', tags: ['Vacanță', 'Familie'] },
        { id: 13, title: 'Task 13', date: '2024-08-15', description: 'Descriere Task 13', checked: false, status: 'În așteptare', tags: ['Renovare', 'Acasă'] },
    ]);
     */
    const {item, onUpdateItem} = route.params;
    const [editableTitle, setEditableTitle] = useState(item.title);
    const fetchTasks = useCallback(() => {
        return cache.get(inMemory.proTasks);
    }, []);

    const {data, loading, error, setData} = useAsyncData(fetchTasks);
    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <TextInput
                    style={[defaultStyles.defaultText, styles.headerTitle]}
                    onChangeText={setEditableTitle}
                    value={editableTitle}
                    onEndEditing={() => {
                        onUpdateItem({...item, title: editableTitle});
                    }}
                />
            ),
        });
    }, [editableTitle, navigation]);
    useEffect(() => {
        fetchTasks().then((newData) => setData(newData));
    });

    const handleDeleteTask = async (id) => {
        const newItems = data.filter(item => item.id !== id);
        try {
            await cache.store(inMemory.proTasks, newItems);
            setData(newItems);
        } catch (e) {
            console.log(e);
        }
    }

    const handleStartTask = async (id) => {
        const newItems = [...data];
        const index = newItems.findIndex(item => item.id === id);
        newItems[index].status = proCardStatus.inProgress;
        try {
            await cache.store(inMemory.proTasks, newItems);
            setData(newItems);
        } catch (e) {
            console.log(e);
        }
    }

    const handleFinnishTask = async (id) => {
        const newItems = [...data];
        const index = newItems.findIndex(item => item.id === id);
        newItems[index].status = proCardStatus.done;
        try {
            await cache.store(inMemory.proTasks, newItems);
            setData(newItems);
        } catch (e) {
            console.log(e);
        }
    }

    const renderCard = (item, showSeparator) => {
        return (
            <ProCard
                title={item.title}
                dueDate={item.date}
                description={item.description}
                checked={item.checked}
                onPress={() => console.log('Card pressed', item.id)}
                onDelete={() => handleDeleteTask(item.id)}
                onStart={() => handleStartTask(item.id)}
                onFinnish={() => handleFinnishTask(item.id)}
                status={item.status}
                tags={item.tags}
            />
        );
    };

    return (
        <View style={styles.container}>
            <GroupedList
                style={styles.list}
                items={item && item.id ? filterItemsByList(data, item.id) : []}
                renderCard={renderCard}
            />

            <Toolbar
                dataLength={data ? data.length : 0}
                onPress={() => navigation.navigate(pages.proCard, item)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: defaultStyles.colors.background,
        flex: 1,
    },
    list: {
        marginHorizontal: 15,
    }
});
export default ProListScreen;
