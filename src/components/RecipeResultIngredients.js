import { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class RecipeResultIngredients extends Component {

    vanity = require("../services/vanity")

    constructor(props) {
        super(props);
        this.state = {
            recipe: props.recipe,
        }
    }

    render = () => {
        return (
            <View>
                {
                    this.state.recipe.ingredientLines.map((ingredient, index) => (
                        <View style={this.styles.textContainer} key={index}>
                            <Text style={this.styles.text}> - </Text>
                            <Text style={this.styles.text}>{ this.vanity.sentanceize(ingredient) }</Text>
                        </View>
                    ))
                }
            </View>
        )
    }

    styles = StyleSheet.create({
        text: {
            fontSize: 16,
        },
        textContainer: {
            padding: 10,
            flexDirection: 'row',
        }
    })

}