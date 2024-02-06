import MinimalListScreen from "../screens/MinimalListScreen";
import HomeScreen from "../screens/HomeScreen";
import {createStackNavigator} from "@react-navigation/stack";
import defaultStyles from "../config/styles";
import ProListScreen from "../screens/ProListScreen";
import ProCardEditScreen from "../screens/ProCardEditScreen";
import ProgressTrackerScreen from "../screens/ProgressTrackerScreen";
import SettingsPage from "../screens/SettingsPage";
import MinimalListScreenAlpha from "../screens/MinimalListScreenAlpha";
import pages from "./pages";

const Stack = createStackNavigator()

function AppNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
                name={pages.home}
                component={HomeScreen}/>
            <Stack.Screen
                name={pages.minimalList}
                options={{
                    headerStyle: {
                        backgroundColor: defaultStyles.colors.background,
                    },
                    headerTintColor: defaultStyles.colors.button,
                }}
                component={MinimalListScreenAlpha}
            />
            <Stack.Screen
                name={pages.proList}
                options={{
                    headerStyle: {
                        backgroundColor: defaultStyles.colors.background,
                    },
                    headerTintColor: defaultStyles.colors.button,
                }}
                component={ProListScreen}
            />
            <Stack.Screen
                name={pages.proCard}
                options={{
                    headerStyle: {
                        backgroundColor: defaultStyles.colors.background,
                    },
                    headerTintColor: defaultStyles.colors.button,
                }}
                component={ProCardEditScreen}
            />
            <Stack.Screen
                name={pages.progressTracker}
                options={{
                    headerStyle: {
                        backgroundColor: defaultStyles.colors.background,
                    },
                    headerTintColor: defaultStyles.colors.button,
                }}
                component={ProgressTrackerScreen}
            />
            <Stack.Screen
                name={pages.settings}
                options={{
                    headerStyle: {
                        backgroundColor: defaultStyles.colors.background,
                    },
                    headerTintColor: defaultStyles.colors.button,
                }}
                component={SettingsPage}
                />
        </Stack.Navigator>
    );
}

export default AppNavigator;