import { Component, useCallback } from 'react';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default class SuggestScreen extends Component {

    commonIngredients = [
        'Chicken',
        'Beef',
        'Pork',
        'Fish',
        'Eggs',
        'Milk',
        'Cheese',
        'Butter',
        'Garlic',
        'Onion',
        'Tomato',
        'Potato',
        'Carrot',
        'Broccoli',
        'Spinach',
        'Lettuce',
        'Rice',
        'Pasta',
        'Bread',
        'Flour',
        'Sugar',
        'Salt',
        'Pepper'
    ];

    constructor(props) {
        super(props);
        this.state = {
            ingredients: [],
            newIngredient: '',
        };
    }

    toggleIngredient = (ingredient) => {
        if (this.state.ingredients.includes(ingredient)) {
            this.setState({ ingredients: this.state.ingredients.filter((item) => item !== ingredient) });
        } else {
            this.setState({ ingredients: [...this.state.ingredients, ingredient] });
        }
    };
    
    addNewIngredient = () => {
        if (this.state.newIngredient !== '') {
            this.setState({ ingredients: [...this.state.ingredients, this.state.newIngredient], newIngredient: '' });
        }
    };
    
    submitIngredients = () => {
        // Here you can send the ingredients to the server for processing
        console.log('Ingredients submitted:', this.state.ingredients);
    };

    getIngredientsList = () => {
        return this.state.ingredients.join(', ');
    }

    render = () => {
        return (
            <View style={this.styles.container}>
              <View style={this.styles.checkboxesContainer}>
                <Text style={this.styles.title}>Quick Add:</Text>
                <View style={this.styles.checkboxes}>
                  {this.commonIngredients.map((ingredient) => (
                    <TouchableOpacity
                      key={ingredient}
                      style={[
                        this.styles.checkbox,
                        this.state.ingredients.includes(ingredient) && this.styles.checkboxSelected
                      ]}
                      onPress={() => this.toggleIngredient(ingredient)}
                    >
                      <Text>{ingredient}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View style={this.styles.textInputContainer}>
                <Text style={this.styles.title}>Other Ingredients:</Text>
                <TextInput
                  style={this.styles.textInput}
                  value={this.state.newIngredient}
                  onChangeText={(text) => this.setState({newIngredient: text})}
                  placeholder="Enter an ingredient"
                  onSubmitEditing={this.addNewIngredient}
                  blurOnSubmit={false}
                />
              </View>
              <View style={this.styles.ingredientsContainer}>
                <Text style={this.styles.title}>Ingredients:</Text>
                <View style={this.styles.ingredients}>
                    <Text>{this.getIngredientsList()}</Text>
                </View>
              </View>
              <TouchableOpacity style={this.styles.submitButton} onPress={this.submitIngredients}>
                <Text style={this.styles.submitButtonText}>Suggest Recipes</Text>
              </TouchableOpacity>
            </View>
        );
    }

    styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: '#fff',
          padding: 20
        },
        checkboxesContainer: {
          marginBottom: 20
        },
        title: {
          fontSize: 20,
          fontWeight: 'bold',
          marginBottom: 10
        },
        checkboxes: {
          flexDirection: 'row',
          flexWrap: 'wrap'
        },
        checkbox: {
          borderWidth: 1,
          borderRadius: 4,
          padding: 10,
          marginRight: 10,
          marginBottom: 10
        },
        checkboxSelected: {
          backgroundColor: 'lightblue'
        },
    });
}