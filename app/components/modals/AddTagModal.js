import React, {Component, useState} from 'react';
import {Modal, View, Text, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import defaultStyles from '../../config/styles';
import cache from "../../utility/cache";
function AddTagModal({visible, onClose, onSuccess}) {
    const [newTag, setNewTag] = useState("");
    const handleAddTag = async () => {
        try {
            const existingTags = await cache.get("tags") || [];
            const updatedTags = [...existingTags, newTag];
            await cache.store("tags", updatedTags);
            onSuccess();
        } catch (error) {
            console.error("Error in handleAddTag:", error);
        }
        finally {
            setNewTag("");
            onClose();
        }
    };
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <TextInput
                        style={defaultStyles.secondaryText}
                        placeholder="Enter Tag Name"
                        value={newTag}
                        onChangeText={(text) => setNewTag(text)}
                    />
                    <TouchableOpacity style={styles.button} onPress={handleAddTag}>
                        <Text style={styles.buttonText}>Add Tag</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancel} onPress={onClose}>
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    textInput: {
        height: 40,
        width: '80%',
        borderBottomColorColor: defaultStyles.colors.secondary,
        borderBottomWidth: 1,
        marginBottom: 20,
        padding: 10,
    },
    button: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        backgroundColor: defaultStyles.colors.button,
        marginBottom: 10,
    },
    buttonText: {
        color: defaultStyles.colors.background,
        fontWeight: "bold",
        textAlign: "center"
    },
    cancel: {
        borderRadius: 10,
        padding: 5,
        elevation: 2,
        backgroundColor: defaultStyles.colors.secondary,
        marginTop: 10,
    },
});

export default AddTagModal;
