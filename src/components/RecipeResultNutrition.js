import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

class RecipeResultNutrition extends Component {

    vanity = require("../services/vanity")

    constructor(props) {
        super(props);
        this.nutrients = Object.values(this.props.recipe.totalNutrients) || [{ label: 'No nutritional information found for this recipe', quantity: 0, unit: ''}];
    }

    render = () => {
        return (
            <View>
                {
                    this.nutrients.map((nutrient, index) => (
                        <View style={this.styles.textContainer} key={index}>
                            <Text style={this.styles.text}>{ nutrient.label }  - </Text>
                            <Text style={this.styles.text}> { Math.round(nutrient.quantity) } { nutrient.unit }</Text>
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
            padding: 5,
            flexDirection: 'row',
        }
    })

}

export default React.memo(RecipeResultNutrition);