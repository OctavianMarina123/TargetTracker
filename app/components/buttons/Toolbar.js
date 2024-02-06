import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import defaultStyles from '../../config/styles';
import {Ionicons} from '@expo/vector-icons';
import {FontAwesome} from '@expo/vector-icons';
import {useNavigation} from "@react-navigation/native";
import pages from "../../navigation/pages";

function Toolbar({disabled= false,onPress, dataLength, IconComponent, iconName, itemName = "goals", showHistory = false}) {
    const [isAddPressed, setIsAddPressed] = useState(false);
    const [isHistoryPressed, setIsHistoryPressed] = useState(false);
    const Icon = IconComponent || Ionicons;
    const iconToUse = iconName || "ios-add-circle-sharp";
    const navigation = useNavigation();
    const [id,setId] = useState(Date.now())
    return (
        <View style={styles.container}>
            {showHistory &&
                <TouchableOpacity
                    onPressIn={() => {
                        setIsHistoryPressed(true);
                        navigation.navigate(pages.progressTracker);
                    }}
                    onPressOut={() => setIsHistoryPressed(false)}
                    style={styles.historyButton}
                >
                    <FontAwesome
                        name="list-ul"
                        size={35}
                        color={isHistoryPressed ? defaultStyles.colors.primaryLight : defaultStyles.colors.primary}
                    />
                </TouchableOpacity>
            }
            <View style={styles.textContainer}>
                {dataLength > 0 &&
                    <Text style={[defaultStyles.secondaryText, styles.text]}>
                        {dataLength} {itemName}
                    </Text>
                }
            </View>
            <TouchableOpacity
                onPress={()=>onPress(id)}
                onPressIn={() => setIsAddPressed(true)}
                onPressOut={() => setIsAddPressed(false)}
                style={styles.addButton}
            >
                <Icon
                    name={iconToUse}
                    size={40}
                    color={isAddPressed ? defaultStyles.colors.primaryLight : defaultStyles.colors.primary}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1, // Adaugă un border la partea superioară
        borderTopColor: defaultStyles.colors.secondary,
        backgroundColor: defaultStyles.colors.background,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    historyButton: {
        justifyContent: 'center',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        marginLeft: 15, // Ajustează în funcție de nevoie
    },
    addButton: {
        justifyContent: 'center',
    }
});

export default Toolbar;
