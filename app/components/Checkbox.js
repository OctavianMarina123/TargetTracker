import React from 'react';
import {StyleSheet, View} from 'react-native';
import defaultStyles from '../config/styles';
import {Entypo} from '@expo/vector-icons';

function Checkbox({
                      checked = false,
                      iconSize = 24,
                      checkedColor = defaultStyles.colors.accent,
                      uncheckedColor = defaultStyles.colors.background,
                      iconColor = defaultStyles.colors.primary,
                      style = {},
                  }) {
    const checkboxStyle = checked
        ? [styles.container, {backgroundColor: checkedColor}, style]
        : [styles.container, {backgroundColor: uncheckedColor}, style];

    return (
        <View style={checkboxStyle}>
            {checked && (
                <Entypo
                    name="check"
                    size={iconSize}
                    style={styles.icon}
                    color={iconColor}
                />
            )}
        </View>
    );
}

export default Checkbox;

const styles = StyleSheet.create({
    container: {
        borderRadius: 5,
        width: 30,
        height: 30,
        justifyContent: 'center',
    },
    icon: {
        alignSelf: 'center',
    },
});