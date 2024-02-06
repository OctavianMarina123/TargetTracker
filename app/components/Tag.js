import React, {useState} from 'react';
import {Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import defaultStyles from '../config/styles';

function Tag({tag, index, editable = true, onPress, onLongPress}) {
    const [isSelected, setIsSelected] = useState(false);

    const handlePress = () => {
        if (!editable) return;


        setIsSelected(!isSelected);
        onPress && onPress();
    };

    const TouchableComponent = editable ? TouchableOpacity : TouchableWithoutFeedback;

    return (
        <TouchableComponent onPress={handlePress} onLongPress={onLongPress}>
            <Text
                key={index}
                style={[
                    defaultStyles.defaultText,
                    styles.tag,
                    isSelected ? styles.tagSelected : null,
                ]}
            >
                {tag}
            </Text>
        </TouchableComponent>
    );
}

export default Tag;

const styles = StyleSheet.create({
    tag: {
        backgroundColor: defaultStyles.colors.buttonHighlight,
        color: defaultStyles.colors.background,
        padding: 6,
        marginRight: 7,
        marginBottom: 4,
        borderRadius: 15,
        fontSize: 14,
        overflow: 'hidden',
    },
    tagSelected: {
        backgroundColor: defaultStyles.colors.primary,
        color: defaultStyles.colors.secondary,
    },
});
