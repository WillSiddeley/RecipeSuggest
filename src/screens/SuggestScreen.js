import { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import RecipeResult from '../components/RecipeResult';

export default class SuggestScreen extends Component {

	constants = require("../services/constants")

	// TODO: Select all / Deselect all options for quick add menu navigation
	// TODO: Cache for recent user entered ingredients to re-add quickly

	// Quick selection options
	commonIngredients = [
		'Chicken',
		'Beef',
		'Pork',
		'Eggs',
		'Milk',
		'Cheese',
		'Butter',
		'Onion',
		'Tomato',
		'Potato',
		'Carrot',
		'Lettuce',
		'Rice',
		'Pasta',
		'Bread',
		'Noodles',
	];

	constructor(props) {
		
		super(props);

		this.state = {
			// Ingredient state variables
			ingredients: [],
			newIngredient: '',

			// Style state variables
			textInputFocused: false,

			// Server API variables
			queryState: "FORM",
			apiData: {},
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
	
	submitIngredients = async () => {
		// Here you can send the ingredients to the server for processing
		console.log('Ingredients submitted:', this.state.ingredients);

		// Rerender component loading screen
		this.setState({ queryState: "LOAD" });

		// Query the server for the recipes from the ingredients list
		const response = await fetch(`${this.constants.baseAPI}/api/v1/recipes/getTestRecipes`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ ingredientsList: this.state.ingredients }),
		});

		// Check the server response is ok
		if (!response.ok) {

			this.setState({ queryState: "ERROR", apiData: { error: "HTTP error querying server" } });

		}

		// Retrieve the json from Edemam API
		const data = await response.json();

		console.log(data);

		// Check if data was successfully retrieved, update the state
		this.setState({ queryState: (!data.error) ? "RESULT" : "ERROR", apiData: data });

	};

	render = () => {
		// Loading screen state
		if (this.state.queryState === "LOAD") {
			return (
				<View style={this.styles.container}>
					<ActivityIndicator size="large" color="#0000ff" />
					<Text>Loading...</Text>
				</View>
			)
		}
		else if (this.state.queryState === "ERROR") {
			return (
				<View style={this.styles.container}>
					<Text>Error</Text>
				</View>
			)
		}
		else if (this.state.queryState === "RESULT") {
			return (
				<RecipeResult apiData={this.state.apiData} styles={this.styles} />
			)
		}
		// Default suggestion form
		return (
			<ScrollView style={this.styles.container}>
				<View style={this.styles.checkboxesContainer}>
					<Text style={this.styles.title}>Quick Selection:</Text>
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
					<Text style={this.styles.title}>Add Custom:</Text>
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
					<Text style={this.styles.title}>Selected Ingredients:</Text>
					<View style={this.styles.checkboxes}>
						{
							(this.state.ingredients.length > 0) ? 
							this.state.ingredients.map((ingredient) => (
								<TouchableOpacity
									key={ingredient}
									style={this.styles.ingredientChip}
									onPress={() => this.toggleIngredient(ingredient)}
								>
									<Text style={this.styles.ingredientText}>{ingredient}</Text>
									<MaterialIcons name="close" size={20} color="#FFF" style={this.styles.ingredientIcon} />
								</TouchableOpacity>
							)) : 
							<Text style={this.styles.textNoSelected}>There are no ingredients selected...</Text>
						}
					</View>
				</View>
				<View style={this.styles.checkboxesContainer}>
					<Button
						title="Suggest Me"
						icon={<MaterialIcons name="search" size={25} color="white" style={this.styles.submitButtonIcon} />}
						buttonStyle={this.styles.submitButton}
						titleStyle={this.styles.submitButtonText}
						containerStyle={{ marginVertical: 30 }}
						onPress={this.submitIngredients}
						disabled={this.state.ingredients.length <= 0}
					/>
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
		textNoSelected: {
			color: 'grey',
			opacity: 0.7,
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
		},
		submitButton: {
			backgroundColor: 'orange',
			padding: 10,
			borderRadius: 10,
			alignItems: 'center',
			justifyContent: 'center',
			flexDirection: 'row-reverse',
		},
		submitButtonText: {
			color: 'white',
			fontWeight: 'bold',
			fontSize: 20,
			marginLeft: 20,
		},
		submitButtonIcon: {
			marginLeft: 10,
		}
	});
}