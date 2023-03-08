import { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class RecipeResultIngredients extends Component {

    constructor(props) {
        super(props);
        this.recipe = props.recipe;
    }

    render = () => {
        return (
            <View>
                {
                    this.recipe.ingredientLines.map((ingredient, index) => (
                        <View style={this.styles.textContainer} key={index}>
                            <Text style={this.styles.text}> - </Text>
                            <Text style={this.styles.text}>{ingredient}</Text>
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