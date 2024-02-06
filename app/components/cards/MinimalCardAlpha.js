import {GestureHandlerRootView, Swipeable} from "react-native-gesture-handler";
import {StyleSheet, TextInput, TouchableWithoutFeedback, View} from "react-native";
import Checkbox from "../Checkbox";
import defaultStyles from "../../config/styles";

function MinimalCardAlpha({checked, onPress, onDelete,onChange, renderRightActions, title="", showBorder = true,autoFocus=false,onBlur,onEndEditing}) {
    return(
        <GestureHandlerRootView>
            <Swipeable renderRightActions={renderRightActions}>
                <TouchableWithoutFeedback onPress={onPress}>
                    <View style={[styles.card, showBorder ? styles.border : null]}>
                        <Checkbox checked={checked} uncheckedColor={defaultStyles.colors.secondary} />
                        <TextInput
                            style={[defaultStyles.defaultText, styles.text]}
                            multiline
                            autoFocus={autoFocus}
                            numberOfLines={1}
                            onChangeText={onChange}
                            onEndEditing={e => onEndEditing(e.nativeEvent.text)}
                            value={title}
                            placeholder="Enter title here"
                        />
                    </View>
                </TouchableWithoutFeedback>
            </Swipeable>
        </GestureHandlerRootView>
    )
}
const styles = StyleSheet.create({
    card: {
        backgroundColor: defaultStyles.colors.background,
        borderRadius: 15,
        flexDirection: "row",
        padding: 15,
    },
    text: {
        flex:1,
        marginHorizontal: 15,
    },
    border: {
        borderBottomWidth: 1,
        borderBottomColor: defaultStyles.colors.secondary,
    },
});

export default MinimalCardAlpha;