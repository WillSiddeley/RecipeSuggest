import { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from 'react-native-elements'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class MyRecipesScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bookmarks: {}
        }
        this.retrieveSavedRecipes().then(res => {
            this.setState({ bookmarks: res });
        });
    }

    retrieveSavedRecipes = async () => {
        // Retrieve saved recipes from local storage or create empty array
        const savedRecipes = await AsyncStorage.getItem("savedRecipes");
        return savedRecipes ? JSON.parse(savedRecipes) : {};
    }

    renderBookmarkOption = (key) => {
        return (
            <View key={key} style={this.styles.recipeContainer}>
                <Text>{ this.state.bookmarks[key].label }</Text>
            </View>
        )
    }

    componentDidMount() {
        this.retrieveSavedRecipes().then(res => {
            this.setState({ bookmarks: res });
        });
    }

    render = () => {
        return (
            <View style={this.styles.container}>
                {
                    (Object.keys(this.state.bookmarks).map(bookmark => (
                        this.renderBookmarkOption(bookmark)
                    )))
                }
            </View>
        );
    }

    styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
            padding: 20,
        },
        recipeContainer: {
            padding: 30,
            borderColor: '#000',
            borderRadius: 10,
            borderWidth: 1,
            marginBottom: 10,
        },
    });
}