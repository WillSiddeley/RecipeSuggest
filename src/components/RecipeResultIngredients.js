import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

class RecipeResultIngredients extends Component {

    vanity = require("../services/vanity")

    constructor(props) {
        super(props);
        this.ingredientsList = this.props.recipe.ingredientLines || ["No ingredients found for this recipe"];
    }

    render = () => {
        return (
            <View>
                {
                    this.ingredientsList.map((ingredient, index) => (
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

export default React.memo(RecipeResultIngredients);