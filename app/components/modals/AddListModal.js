// ModalComponent.js
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import defaultStyles from '../../config/styles';
import listTypes from "../../utility/listTypes";
const AddListModal = ({ modalVisible, setModalVisible, onAddList }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <TouchableOpacity
                style={styles.fullScreenTouchable}
                activeOpacity={1}
                onPress={() => setModalVisible(false)}
            >
                <View style={styles.modalViewTouchable}>
                    <TouchableOpacity
                        style={styles.modalButton}
                        onPress={() => {
                            onAddList('ToDO', '', listTypes.minimaList);
                            setModalVisible(false);
                        }}
                        activeOpacity={1}
                    >
                        <Text style={styles.modalButtonText}>Minimalist List</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.modalButton}
                        onPress={() => {
                            onAddList('New Goal', '', listTypes.proList);
                            setModalVisible(false);
                        }}
                        activeOpacity={1}
                    >
                        <Text style={styles.modalButtonText}>Pro List</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
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
        color: 'white',
        marginVertical: 10,
        borderRadius: 10,
    },
    modalButtonText: {
        color: defaultStyles.colors.background,
    },
});


export default AddListModal;
