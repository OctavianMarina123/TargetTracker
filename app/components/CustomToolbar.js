import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';

const CustomToolbar = ({ onButtonPress }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onButtonPress} style={styles.button}>
                <Text style={styles.buttonText}>Apasă-mă</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#fff',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        backgroundColor: '#0066cc',
        padding: 10,
        borderRadius: 5
    },
    buttonText: {
        color: '#fff',
        fontSize: 16
    }
});

export default CustomToolbar;
