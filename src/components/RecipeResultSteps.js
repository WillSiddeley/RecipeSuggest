import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

class RecipeResultSteps extends Component {

    vanity = require("../services/vanity")

    constructor(props) {
        super(props);
        this.directions = this.props.recipe.directions;
        if (!this.directions || this.directions.length === 0 || this.directions[0] === "") {
            this.directions = ["No directions found for this recipe"]
        }
    }

    render = () => {
        return (
            <View>
                {
                    this.directions.map((direction, index) => (
                        <View style={this.styles.textContainer} key={index}>
                            <Text style={this.styles.text}> - </Text>
                            <Text style={this.styles.text}>{ this.vanity.sentanceize(direction) }</Text>
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

export default React.memo(RecipeResultSteps);