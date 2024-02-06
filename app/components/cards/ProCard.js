import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, LayoutAnimation, Platform, UIManager} from 'react-native';
import defaultStyles from '../../config/styles';
import TaskModal from "../modals/TaskModal";
import OptionsButton from "../buttons/OptionsButton";
import * as Haptics from "expo-haptics";
import Tag from "../Tag";
import proCardStatus from "../../config/proCardStatus";

function ProCard({title, dueDate, description, checked, onPress, onDelete, status = proCardStatus.pending, tags, onStart,onFinnish}) {
    const [expanded, setExpanded] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);

    useEffect(() => {
        if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }, []);

    const handleLongPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setEditModalVisible(true);
    };

    const formatDueDate = (dueDate) => {
        const date = new Date(dueDate);
        const formattedDate = date.toLocaleDateString();
        const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return `${formattedDate} • ${formattedTime}`;
    }


    const handlePress = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
        onPress && onPress();
    };


    return (
        <TouchableOpacity
            onLongPress={handleLongPress}
            onPress={handlePress}
        >
            <View style={styles.card}>
                <View style={styles.detailsContainer}>
                    <Text style={[defaultStyles.title, styles.title, checked && styles.titleChecked]}>{title}</Text>
                    {
                        !expanded &&
                        <>
                            <Text style={[defaultStyles.secondaryText,styles.status]}>Status: {status}</Text>
                            <Text style={[defaultStyles.defaultText, styles.dueDate]}>{formatDueDate(dueDate)}</Text>

                        </>
                    }
                    {expanded && (
                        <>
                            <Text style={[defaultStyles.defaultText, styles.description]}>{description}</Text>
                            <Text style={[defaultStyles.defaultText, styles.dueDate]}>{formatDueDate(dueDate)}</Text>

                            {tags && tags.length > 0 && (
                                <View style={styles.tagContainer}>
                                    {tags.map((tag, index) => (
                                        <Tag tag={tag} index={index} editable={false}/>
                                    ))}
                                </View>
                            )}
                        </>
                    )}
                </View>
                <OptionsButton onPress={handleLongPress}/>
                <TaskModal
                    visible={editModalVisible}
                    onClose={() => setEditModalVisible(false)}
                    onMarkFavourite={() => console.log('Mark as Favourite')}
                    onFinnishTask={onFinnish}
                    onStartTask={onStart}
                    onDelete={onDelete}
                />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 15,
        borderWidth:1,
        borderColor: defaultStyles.colors.secondary,
        backgroundColor: defaultStyles.colors.accent, // Culoarea accent
        marginBottom: 20,
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
    },
    detailsContainer: {
        flex: 1,
    },
    title: {
        marginBottom: 7,
        fontWeight: 'bold',
        fontSize: 18, // Mărit pentru lizibilitate
        color: defaultStyles.colors.primary, // Culoare principală pentru titlu
    },
    titleChecked: {
        textDecorationLine: 'line-through',
        color: defaultStyles.colors.secondary, // Culoare secundară pentru titlu verificat
    },
    dueDate: {
        position: 'absolute',
        right: 10,
        fontWeight: '500',
        color: defaultStyles.colors.button, // Culoare pentru data
    },
    description: {
        color: defaultStyles.colors.button, // Culoare principală pentru descriere
        fontWeight: '500',
        fontSize: 16, // Mărit pentru lizibilitate
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 4,
    },
    status:{
        color: defaultStyles.colors.button,
    }
});


export default ProCard;