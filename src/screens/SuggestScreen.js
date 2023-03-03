import { Component, useCallback } from 'react';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';

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
			textInputFocused: false,
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
            <ScrollView style={this.styles.container}>
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
            	<View style={this.styles.checkboxesContainer}>
                	<Text style={this.styles.title}>Other Ingredients:</Text>
                	<TextInput
                		style={[this.styles.textInput, this.state.textInputFocused && this.styles.textInputFocused]}
                		value={this.state.newIngredient}
                		onChangeText={(text) => this.setState({newIngredient: text})}
                		placeholder="Enter an ingredient"
                		onSubmitEditing={this.addNewIngredient}
                		blurOnSubmit={false}
						onFocus={() => this.setState({textInputFocused: true})}
						onBlur={() => this.setState({textInputFocused: false})}
                	/>
            	</View>
            	<View style={this.styles.checkboxesContainer}>
                	<Text style={this.styles.title}>Ingredients:</Text>
                	<View style={this.styles.checkboxes}>
						{this.state.ingredients.map((ingredient) => (
                	    	<TouchableOpacity
                	    		key={ingredient}
                	    		style={this.styles.ingredientChip}
                	    		onPress={() => this.toggleIngredient(ingredient)}
                	    	>
                	    		<Text style={this.styles.ingredientText}>{ingredient}</Text>
								<MaterialIcons name="close" size={20} color="#FFF" style={this.styles.ingredientIcon} />
                	    	</TouchableOpacity>
                		))}
                	</View>
            	</View>
				<View style={this.styles.checkboxesContainer}>
					<TouchableOpacity style={this.styles.submitButton} onPress={this.submitIngredients}>
                		<Text style={this.styles.submitButtonText}>Suggest Recipes</Text>
            		</TouchableOpacity>
				</View>
            </ScrollView>
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
		textInput: {
			height: 50,
			borderWidth: 1,
			borderColor: 'grey',
			borderRadius: 5,
			padding: 10,
			marginBottom: 20
		},
		textInputFocused: {
			borderColor: 'black',
		},
		ingredientChip: {
			backgroundColor: 'green',
			borderRadius: 16,
			padding: 8,
			flexDirection: 'row',
			alignItems: 'center',
			marginRight: 8,
			marginBottom: 8
		},
		ingredientText: {
			color: 'white',
			fontSize: 16,
			marginRight: 8
		},
		ingredientIcon: {
			color: 'white',
			fontSize: 16
		}
    });
}