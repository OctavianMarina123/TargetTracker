import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import defaultStyles from '../../config/styles';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
const TaskModal = ({ visible, onClose, onMarkFavourite, onFinnishTask, onDelete,onStartTask }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <TouchableOpacity style={styles.button} onPress={onStartTask}>
                        <AntDesign name="stepforward" size={20} color={defaultStyles.colors.background} />
                        <Text style={styles.buttonText}>Start Task</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button,{marginBottom: 20}]} onPress={onFinnishTask}>
                        <MaterialIcons name="stop" size={20} color={defaultStyles.colors.background} />
                        <Text style={styles.buttonText}>Finnish Task</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={onMarkFavourite}>
                        <AntDesign name="star"  size={20} color={defaultStyles.colors.background} />
                        <Text style={styles.buttonText}>Mark as Favourite</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={onDelete}>
                        <MaterialCommunityIcons name="delete"  size={20} color={defaultStyles.colors.background} />
                        <Text style={styles.buttonText}>Delete Task</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cancel} onPress={onClose}>
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonClose} onPress={onClose}>
                        <Ionicons name="ios-close" size={30} color={
                            defaultStyles.colors.button
                        } />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalView: {
        margin: 20,
        backgroundColor: defaultStyles.colors.background,
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        backgroundColor: defaultStyles.colors.button,
        marginBottom: 10,
        flexDirection: 'row',
    },
    buttonText: {
        color: defaultStyles.colors.background,
        fontWeight: "bold",
        textAlign: "center"
    },
    buttonClose: {
        position:"absolute",
        top: 0,
        right: 0,
    },
    cancel:{
        borderRadius: 10,
        padding: 5,
        elevation: 2,
        backgroundColor: defaultStyles.colors.secondary,
        marginTop: 10,
    }
});

export default TaskModal;