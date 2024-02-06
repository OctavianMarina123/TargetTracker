import React, {useState} from "react";
import cache from "../../utility/cache";
import {Modal, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import defaultStyles from "../../config/styles";


function DeleteTagModal({visible, onClose, onSuccess}) {

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={defaultStyles.defaultText}>
                        Are you sure you want to delete this tag?
                    </Text>
                    <View style = {styles.buttonsContainer}>
                        <TouchableOpacity style={styles.yesButton} onPress={onSuccess}>
                            <Text style={styles.buttonText}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.noButton} onPress={onClose}>
                            <Text style={styles.buttonText}>No</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

export default DeleteTagModal;

const styles = StyleSheet.create({
    buttonsContainer: {
        flexDirection: 'row',
    },
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
    noButton: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        backgroundColor: defaultStyles.colors.button,
        marginLeft: 20,
    },
    buttonText: {
        color: defaultStyles.colors.background,
        fontWeight: "bold",
        textAlign: "center"
    },
    yesButton: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        marginRight: 20,
        backgroundColor: defaultStyles.colors.secondary,
    },
});
