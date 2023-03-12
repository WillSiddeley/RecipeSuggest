import { Component } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { Image } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from 'react-native-elements'
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyRecipesOptions from '../components/MyRecipesOption';
import MyRecipesShow from '../components/MyRecipesShow';

export default class MyRecipesScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bookmarks: {},
            modalVisible: false,
            modalRecipe: null
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
            <MyRecipesOptions key={key} bookmark={this.state.bookmarks[key]} show={this.showModal} hide={this.hideModal}/>
        )
    }

    componentDidMount() {
        this.retrieveSavedRecipes().then(res => {
            this.setState({ bookmarks: res });
        });
    }

    componentDidUpdate() {
        this.retrieveSavedRecipes().then(res => {
            this.setState({ bookmarks: res });
        });
    }

    showModal = (recipe) => {
        this.setState({ modalVisible: true, modalRecipe: recipe });
    }

    hideModal = () => {
        this.setState({ modalVisible: false, modalRecipe: null });
    }

    renderModal = () => {
        if (!this.state.modalRecipe) {
            return null;
        }
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={this.hideModal}
            >
                <MyRecipesShow recipe={this.state.modalRecipe} hide={this.hideModal}/>
            </Modal>
        )


    }

    render = () => {
        return (
            <ScrollView style={this.styles.container}>
                {
                    (Object.keys(this.state.bookmarks).map(bookmark => (
                        this.renderBookmarkOption(bookmark)
                    )))
                }
                { this.renderModal() }
                <View style={{ marginBottom: 30 }}/>
            </ScrollView>
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