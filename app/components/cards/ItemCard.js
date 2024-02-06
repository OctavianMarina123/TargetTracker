import React, {useEffect} from "react";
import {View, StyleSheet, TouchableOpacity, Text} from "react-native";
import {GestureHandlerRootView, Swipeable} from "react-native-gesture-handler";
import defaultStyles from '../../config/styles';

function ItemCard({ title, description, onPress, onHold, renderRightActions, showBorder = true, date, isFav = false }) {
    const titleMaxLength = 35; // Set the max length for title
    const descriptionMaxLength = 50; // Set the max length for description

    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    return (
        <GestureHandlerRootView>
            <Swipeable renderRightActions={renderRightActions}>
                <TouchableOpacity
                    style={[styles.container, showBorder ? styles.border : null]}
                    onPress={onPress}
                    onLongPress={onHold}
                >
                    <Text style={defaultStyles.title}>{truncateText(title, titleMaxLength)}</Text>
                    <View style={styles.descriptionContainer}>
                        <Text style={[defaultStyles.defaultText, styles.date]}>{date.slice(0, 10)}</Text>
                        {description &&
                            <Text style={[defaultStyles.defaultText, styles.description]}>{truncateText(description, descriptionMaxLength)}</Text>}
                    </View>
                </TouchableOpacity>
            </Swipeable>
        </GestureHandlerRootView>
    );
}

export default ItemCard;

const styles = StyleSheet.create({
    container: {
        backgroundColor: defaultStyles.colors.background,
        flexDirection: "column",
        paddingTop: 10,
        paddingLeft: 15,
        borderRadius: 15,
    },
    date:{
        color: defaultStyles.colors.secondary,
    },
    description: {
        marginLeft:15,
        color: defaultStyles.colors.secondary,
    },
    border: {
        borderBottomWidth: 1,
        borderBottomColor: defaultStyles.colors.secondary,
    },
    descriptionContainer: {
        flexDirection: "row",
        marginBottom: 0,
    },
});
