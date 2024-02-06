import React, { useState } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import defaultStyles from '../../config/styles';
import * as Haptics from "expo-haptics";

function OptionsButton({ onPress }) {
    const [isPressed, setIsPressed] = useState(false);
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
        >
            <View style={styles.button}>
                <MaterialIcons
                    name="pending"
                    size={30}
                    color={
                        isPressed ? defaultStyles.colors.buttonLight : defaultStyles.colors.button
                    }
                />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        // Adaugă stiluri pentru container dacă este necesar
    },
    button: {
        // Adaugă stiluri pentru buton dacă este necesar
    },
    // Poți adăuga și alte stiluri aici
});

export default OptionsButton;