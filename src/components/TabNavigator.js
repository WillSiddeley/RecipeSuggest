import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import SuggestScreen from "../screens/SuggestScreen";
import MyRecipeScreen from "../screens/MyRecipesScreen";
import MyAccountScreen from "../screens/MyAccountScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {

    return (
        <Tab.Navigator screenOptions={{ activeTintColor: 'tomato', inactiveTintColor: 'grey', }}>

            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="home" color={color} size={size} />
                    )
                }}
            />

            <Tab.Screen
                name="Suggest Recipes"
                component={SuggestScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="search" color={color} size={size} />
                    )
                }}
            />

            <Tab.Screen
                name="My Recipes"
                component={MyRecipeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="bookmark" color={color} size={size} />
                    )
                }}
            />

            <Tab.Screen
                name="My Profile"
                component={MyAccountScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="user" color={color} size={size} />
                    )
                }}
            />


        </Tab.Navigator>
    )
}