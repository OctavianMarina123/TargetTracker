import React from "react";
import Constants from "expo-constants";
import {SafeAreaView, View, StyleSheet, Platform} from "react-native";
import defaultStyles from "../config/styles";

function Screen({children, style}) {
    return (
        <SafeAreaView style={[styles.screen, style]}>
            <View style={[styles.view, style]}>{children}</View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screen: {
        paddingTop: Platform.OS === "android" ? Constants.statusBarHeight : Constants.statusBarHeight + 10,
        flex: 1,
    },
    view: {
        flex: 1,
    },
});

export default Screen;