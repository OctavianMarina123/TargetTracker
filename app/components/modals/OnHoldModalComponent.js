// OnHoldModalComponent.js
import React, {useEffect, useState} from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet, TextInput, TouchableWithoutFeedback} from 'react-native';
import defaultStyles from '../../config/styles';
import {MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons';
import {Fontisto} from '@expo/vector-icons';
import {AntDesign} from '@expo/vector-icons';

const OnHoldModalComponent = ({
                                  modalVisible,
                                  setModalVisible,
                                  selectedItem,
                                  onEdit,
                                  onDelete,
                                  onFavor,
                                  onScreenshot,
                                  onUpdateItem
                              }) => {
    const [title, setTitle] = useState(selectedItem ? selectedItem.title&&selectedItem.title.length>0 : 'Untitled');


    useEffect(() => {
        if (selectedItem) {
            setTitle(selectedItem.title);
        }
    }, [selectedItem]);

    const closeModal = () => {
        let newTitle = title.length > 0 ? title : "Untitled";
        const newItem = { ...selectedItem, title: newTitle };

        onUpdateItem(newItem);
        setTitle(newTitle);
        setModalVisible(false);
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}
        >
            <TouchableOpacity
                style={styles.fullScreenTouchable}
                activeOpacity={1}
                onPress={closeModal} // Aceasta va închide modalul atunci când se face clic în afara View-ului modalView
            >
                <TouchableWithoutFeedback>
                    <View style={styles.modalView}>
                        {selectedItem && (
                            <>
                                <TouchableWithoutFeedback style={{width: "100%"}}>
                                    <TextInput
                                        multiline // Permite ca TextInput să aibă mai multe linii
                                        scrollEnabled // Permite scrollarea în interiorul TextInput
                                        maxLength={25}
                                        style={styles.modalTitleText}
                                        value={title}
                                        onChangeText={(text) => {
                                            setTitle(text);
                                            onUpdateItem({...selectedItem, title: text});
                                        }}
                                    />
                                </TouchableWithoutFeedback>
                                <View style={styles.border}/>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={() => {
                                        setModalVisible(false);
                                        onFavor();
                                    }}
                                    activeOpacity={1}
                                >


                                    {
                                        selectedItem.isFavorite ?
                                            <MaterialCommunityIcons name="pin-off" size={22}
                                                                    color={defaultStyles.colors.background}
                                                                    style={styles.icon}/>
                                            :
                                            <AntDesign name="pushpin" size={22}
                                                       color={defaultStyles.colors.background} style={styles.icon}/>
                                    }
                                    <Text style={styles.modalButtonText}>
                                        {
                                            selectedItem.isFavorite ? "Unpin Task" : "Pin Task"
                                        }
                                    </Text>


                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={() => {
                                        setModalVisible(false);
                                        onDelete()
                                    }
                                    }
                                    activeOpacity={1}
                                >
                                    <MaterialIcons name="delete" size={24} color={defaultStyles.colors.background}
                                                   style={styles.icon}/>
                                    <Text style={styles.modalButtonText}>Delete</Text>
                                </TouchableOpacity>


                                <TouchableOpacity
                                    style={[styles.modalButton, {
                                        backgroundColor: defaultStyles.colors.secondary,
                                        marginTop: 20
                                    }]}
                                    onPress={closeModal}
                                    activeOpacity={1}
                                >
                                    <MaterialIcons name="cancel" size={20} color={defaultStyles.colors.background}
                                                   style={styles.icon}/>
                                    <Text style={[styles.modalButtonText, {
                                        color: defaultStyles.colors.background,
                                        fontWeight: "bold",
                                    }]}>Cancel</Text>
                                </TouchableOpacity>
                            </>
                        )
                        }
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>
    )
        ;
};

const styles = StyleSheet.create({
    fullScreenTouchable: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    border: {
        width: 100,
        height: 1,
        backgroundColor: defaultStyles.colors.secondary,
        marginBottom: 10,
    },
    modalView: {
        margin: 20,
        backgroundColor: defaultStyles.colors.accent,
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
    modalButton: {
        backgroundColor: defaultStyles.colors.button,
        padding: 10,
        maxHeight: 50,
        marginVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        flexDirection: 'row',
    },
    modalButtonText: {
        color: defaultStyles.colors.background,
    },
    modalTitleText: {
        marginBottom: 5,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        color: defaultStyles.colors.primary,
    },
    icon: {
        marginRight: 5,
    }
});


export default OnHoldModalComponent;
