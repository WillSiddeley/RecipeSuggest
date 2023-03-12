import { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from 'react-native-elements'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class MyRecipesOptions extends Component {

    vanity = require("../services/vanity");

    constructor(props) {
        super(props);
        // Non state class variables
        this.bookmark = this.props.bookmark;
    }

    getSubtitleString = (cuisineType, dietLabels) => {
        let combinedArr = [...cuisineType, ...dietLabels];
        let combinedCapitalized = [];
        combinedArr.forEach(word => combinedCapitalized.push(this.vanity.titleize(word)));
        return combinedCapitalized.join(" | ");
    }

    render = () => {
        return (
            <TouchableOpacity style={this.styles.recipeContainer} onPress={() => this.props.show(this.bookmark)}>
                <Image
                    source={{ uri: this.bookmark.image }}
                    style={this.styles.recipeImage}
                />
                <View style={this.styles.recipeDetails}>
                    <Text style={this.styles.recipeTitle}>{ this.vanity.titleize(this.bookmark.label) }</Text>
                    <Text style={this.styles.recipeSubtitle}>{ this.getSubtitleString(this.bookmark.cuisineType, this.bookmark.dietLabels) }</Text>
                    <Text>Calories: { Math.round(this.bookmark.calories) } Kcal</Text>
                </View>
            </TouchableOpacity>
        )
    }

    styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
            padding: 20,
        },
        recipeContainer: {
            padding: 20,
            opacity: 0.7,
            borderColor: '#000',
            borderRadius: 10,
            borderWidth: 1,
            marginBottom: 10,
            flexDirection: 'row',
            backgroundColor: '#efefef',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.85,
            elevation: 5,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
        },
        recipeImage: {
            width: 75,
            height: 75,
            borderRadius: 20,
            marginRight: 10,
            borderWidth: 2
        },
        recipeDetails: {
            flex: 1,
            justifyContent: 'center',
        },
        recipeTitle: {
            fontSize: 18,
            fontWeight: 'bold',
        },
        recipeSubtitle: {
            fontSize: 14,
            color: '#888',
        }
    });

}