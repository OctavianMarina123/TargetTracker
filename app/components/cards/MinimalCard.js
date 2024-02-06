import { TouchableWithoutFeedback, View, StyleSheet, TextInput } from "react-native";
import defaultStyles from "../../config/styles";
import React, {forwardRef, useEffect, useRef, useState} from "react";
import Text from "../Text";
import Checkbox from "../Checkbox";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";

// ...

const MinimalCard = forwardRef(({
                                    checked, onPress, onDelete, renderRightActions, title:initialTitle, showBorder, isNewItem, onEndEditing, onTitleChange
                                }, ref) => {
    const [title, setTitle] = useState(initialTitle);
    const inputRef = ref || useRef(null);
    const maxLength = 20;
    useEffect(() => {
        if (isNewItem) {
            inputRef.current?.focus();
        }
    }, [isNewItem, inputRef]);

    const handleTextChange = (text) => {
        let truncatedText = text;
        if (text.length > maxLength) {
            truncatedText = text.substring(0, maxLength) + '...';
        }
        setTitle(truncatedText); // Update local state
        onTitleChange(truncatedText); // Call callback function to update title in parent component
    };

    const handleEndEditing = () => {
        onEndEditing(title); // Update parent component when editing ends
    };
    return (
        <GestureHandlerRootView>
            <Swipeable renderRightActions={renderRightActions}>
                <TouchableWithoutFeedback onPress={onPress}>
                    <View style={[styles.card, showBorder ? styles.border : null]}>
                        <Checkbox checked={checked} uncheckedColor={defaultStyles.colors.secondary} />
                        <TextInput
                            style={[defaultStyles.defaultText, styles.text]}
                            multiline
                            numberOfLines={1}
                            ref={inputRef}
                            value={title}
                            onChangeText={handleTextChange}
                            onEndEditing={handleEndEditing}
                            placeholder="Enter title here"
                        />
                    </View>
                </TouchableWithoutFeedback>
            </Swipeable>
        </GestureHandlerRootView>
    );
});

export default MinimalCard;


const styles = StyleSheet.create({
    card: {
        backgroundColor: defaultStyles.colors.background,
        borderRadius: 15,
        flexDirection: "row",
        padding: 15,
    },
    text: {
        marginHorizontal: 15,
    },
    border: {
        borderBottomWidth: 1,
        borderBottomColor: defaultStyles.colors.secondary,
    },
});
