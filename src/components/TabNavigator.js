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

    constructor(props) {
        super(props);
        this.state = {
            activeTab: "Home"
        }
    }

    getIcon = (name) => {
        return {
            tabBarIcon: ({ color, size }) => (
                <FontAwesome name={name} color={color} size={size} />
            )
        }
    }

    setActiveTab = (tabName) => {
        console.log("Active Tab: " + tabName)
        this.setState({ activeTab: tabName });
    }

    render = () => {
        return (
            <Tab.Navigator>
            
                <Tab.Screen
                    name="Home"
                    component={HomeScreen}
                    options={this.getIcon("home")}
                    initialParams={{ activeTab: this.state.activeTab }}
                    listeners={{ tabPress: () => this.setActiveTab("Home") }}
                />
    
                <Tab.Screen
                    name="Suggest Recipes"
                    component={SuggestScreen}
                    options={this.getIcon("search")}
                    initialParams={{ activeTab: this.state.activeTab }}
                    listeners={{ tabPress: () => this.setActiveTab("Suggest Recipes") }}
                />
    
                <Tab.Screen
                    name="My Recipes"
                    component={MyRecipeScreen}
                    options={this.getIcon("bookmark")}
                    initialParams={{ activeTab: this.state.activeTab }}
                    listeners={{ tabPress: () => this.setActiveTab("My Recipes") }}
                />
    
                <Tab.Screen
                    name="My Profile"
                    component={MyAccountScreen}
                    options={this.getIcon("user")}
                    initialParams={{ activeTab: this.state.activeTab }}
                    listeners={{ tabPress: () => this.setActiveTab("My Profile") }}
                />
    
            </Tab.Navigator>
        );
    }
}