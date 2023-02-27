import { Component } from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import SuggestScreen from "../screens/SuggestScreen";
import MyRecipeScreen from "../screens/MyRecipesScreen";
import MyAccountScreen from "../screens/MyAccountScreen";

const Tab = createBottomTabNavigator();

// FontAwesome icons from the following link:
// https://react-icons.github.io/react-icons/icons?name=fa

export default class TabNavigator extends Component {

    getIcon = (name) => {
        return {
            tabBarIcon: ({ color, size }) => (
                <FontAwesome name={name} color={color} size={size} />
            )
        }
    }

    render = () => {
        return (
            <Tab.Navigator>
            
                <Tab.Screen
                    name="Home"
                    component={HomeScreen}
                    options={this.getIcon("home")}
                />
    
                <Tab.Screen
                    name="Suggest Recipes"
                    component={SuggestScreen}
                    options={this.getIcon("search")}
                />
    
                <Tab.Screen
                    name="My Recipes"
                    component={MyRecipeScreen}
                    options={this.getIcon("bookmark")}
                />
    
                <Tab.Screen
                    name="My Profile"
                    component={MyAccountScreen}
                    options={this.getIcon("user")}
                />
    
            </Tab.Navigator>
        );
    }
}