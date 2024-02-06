import defaultStyles from '../../config/styles';
import {TouchableOpacity, TouchableWithoutFeedback, View} from "react-native";
import {StyleSheet} from "react-native";
import Text from "../Text";
import {GestureHandlerRootView, Swipeable} from "react-native-gesture-handler";

function HomeCard({description, title, onPress, onHold, style, showBorder = true, renderRightActions}) {
    return (
        <GestureHandlerRootView>
            <Swipeable renderRightActions={renderRightActions}>
                <TouchableWithoutFeedback onPress={onPress}>
                    <View
                        style={[styles.container, style]}
                        onLongPress={onHold} // Adaugă aici prop-ul onLongPress
                    >
                        <Text style={defaultStyles.defaultText}>{title}</Text>
                        {
                            description &&
                            <Text
                                style={[defaultStyles.defaultText, {color: defaultStyles.colors.secondary}]}
                            >
                                {description}
                            </Text>
                        }
                        {
                            showBorder &&
                            <View style={styles.border}/>
                        }
                    </View>
                </TouchableWithoutFeedback>
            </Swipeable>
        </GestureHandlerRootView>
    )
}

export default HomeCard;

const styles = StyleSheet.create({
    border: {
        height: 1,
        width: "100%",
        marginTop: 5,
        backgroundColor: defaultStyles.colors.secondary,
    },
    container: {
        borderRadius: 15,
        marginTop: 5,
        backgroundColor: defaultStyles.colors.background,
        paddingLeft: 20,
        marginRight:10,
    }
});