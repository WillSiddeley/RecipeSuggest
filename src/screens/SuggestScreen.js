import { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { Button } from 'react-native-elements'
import { MaterialIcons } from '@expo/vector-icons';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import RecipeError from '../components/RecipeError';
import RecipeResult from '../components/RecipeResult';

export default class SuggestScreen extends Component {

	constants = require("../services/constants")
	vanity = require("../services/vanity")

	constructor(props) {
		super(props);
		this.state = {
			// Ingredient state variables
			ingredients: [],
			// Style state variables
			textInputFocused: false,
			// Server API variables
			queryState: "FORM",
			apiData: {},
			// Ingredient selection variables
			commonIngredients: [],
			allIngredients: [],
		};
	}

	async componentDidMount() {
		// Get common ingredients
		const commonResponse = await fetch(`${this.constants.baseAPI}/api/v1/ingredients/commonIngredients`);
		const commonData = await commonResponse.json();
		// Get all ingredients
		const allResponse = await fetch(`${this.constants.baseAPI}/api/v1/ingredients/allIngredients`);
		const allData = await allResponse.json();
		// Set the state
		this.setState({ commonIngredients: commonData, allIngredients: allData });
	}

	toggleIngredient = (ingredient) => {
		// Put everything lowercase to compare
		ingredient = ingredient.toLowerCase();
		// Add or remove the ingredient from the array
		if (this.state.ingredients.includes(ingredient)) {
			this.setState({ ingredients: this.state.ingredients.filter((item) => item !== ingredient) });
		} else {
			this.setState({ ingredients: [...this.state.ingredients, ingredient] });
		}
	};
	
	submitIngredients = async () => {
		
		console.log('Ingredients submitted:', this.state.ingredients);

		// Rerender component loading screen
		this.setState({ queryState: "LOAD" });

		// Query the server for the recipes from the ingredients list
		const response = await fetch(`${this.constants.baseAPI}/api/v1/recipes/getRecipes`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ ingredientsList: this.state.ingredients }),
		});

		// If the user backed out of loading, don't finish the request
		if (this.state.queryState !== "FORM") {
			// Check the server response is ok
			if (!response.ok) {
				this.setState({ queryState: "ERROR", apiData: { error: "HTTP error querying server" } });
			}

			// Retrieve the json from Edemam API
			let data = await response.json();

			if (data[0].length === 0) {
				// If there is no data retrieved, give an error message
				this.setState({ queryState: "ERROR", apiData: { error: "Response data empty, was there was a problem connecting to the APIs?" } });
			}
			else {
				// Remove empty lists from the response data
				data = data.filter(e => e.length > 0) ;
				// Check if data was successfully retrieved, update the state
				this.setState({ queryState: (!data.error) ? "RESULT" : "ERROR", apiData: data });
			}
			
		}

	};

	updateQueryState = (newQueryState) => {
		this.setState({ queryState: newQueryState });
	}

	renderSelectedIngredient = (ingredient) => {
		ingredient = ingredient.item;
		return (
			<TouchableOpacity style={this.styles.ingredientChip} onPress={() => this.toggleIngredient(ingredient)}>
				<Text style={this.styles.ingredientText}>{this.vanity.titleize(ingredient)}</Text>
				<MaterialIcons name="close" size={20} color="#FFF" style={this.styles.ingredientIcon} />
			</TouchableOpacity>
		)
	}

	render = () => {
		// Loading screen state
		if (this.state.queryState === "LOAD") {
			return (
				<View style={this.styles.container}>
					<View style={this.styles.iconContainer}>
						<Button 
                    	    icon={<MaterialIcons name="close" size={30} color="black" />}
                    	    onPress={() => { this.setState({ queryState: "FORM" }); }} 
                    	    buttonStyle={{ backgroundColor: "#fff" }}
                    	/>
                	</View>
					<View style={this.styles.loadContainer}>
						<ActivityIndicator size="large" color="#0000ff" />
					</View>
				</View>
			)
		}
		else if (this.state.queryState === "ERROR") {
			return (
				<RecipeError apiData={this.state.apiData} updateState={this.updateQueryState} />
			)
		}
		else if (this.state.queryState === "RESULT") {
			return (
				<RecipeResult apiData={this.state.apiData} updateState={this.updateQueryState}/>
			)
		}
		// Default suggestion form
		return (
			<View style={this.styles.container}>
				<View style={this.styles.checkboxesContainer}>
					<Text style={this.styles.title}>Quick Selection:</Text>
					<View style={this.styles.checkboxes}>
					  {this.state.commonIngredients.map((ingredient) => (
						<TouchableOpacity
							key={ingredient}
							style={[
							  this.styles.checkbox,
							  this.state.ingredients.includes(ingredient.toLowerCase()) && this.styles.checkboxSelected
							]}
							onPress={() => this.toggleIngredient(ingredient)}
						>
							<Text>{ingredient}</Text>
						</TouchableOpacity>
					  ))}
					</View>
				</View>
				<View style={this.styles.checkboxesContainer}>
					<AutocompleteDropdown
						clearOnFocus={false}
						closeOnBlur={true}
						closeOnSubmit={false}
						onSelectItem={(ingredient) => {if (ingredient) this.toggleIngredient(ingredient.title) }}
						dataSet={this.state.allIngredients}
						direction="up"
					/>
				</View>
				<View style={this.styles.checkboxesContainer}>
					<Text style={this.styles.title}>Selected Ingredients:</Text>
					{
						(this.state.ingredients.length > 0) ? (
							<FlatList 
								style={{ height: 100 }}
								containerStyle={this.styles.checkboxes}
								data={this.state.ingredients}
								renderItem={this.renderSelectedIngredient}
								keyExtractor={item => item}
								numColumns={3}
								columnWrapperStyle={{ justifyContent: 'center' }}
							/>
						) :
						<Text style={this.styles.textNoSelected}>There are no ingredients selected...</Text>
					}
					
				</View>
				<View style={this.styles.checkboxesContainer}>
					<Text style={{ color: 'grey', opacity: 0.7 }}>Please select a minimum of three ingredients to cook with...</Text>
					<Button
						title="Suggest Me"
						icon={<MaterialIcons name="search" size={25} color="white" style={this.styles.submitButtonIcon} />}
						buttonStyle={this.styles.submitButton}
						titleStyle={this.styles.submitButtonText}
						containerStyle={{ marginVertical: 30 }}
						onPress={this.submitIngredients}
						disabled={this.state.ingredients.length < 3}
					/>
				</View>
			</View>
		);
	}

	styles = StyleSheet.create({
		iconContainer: {
            flexDirection: 'row',
            backgroundColor: '#fff',
            justifyContent: 'space-between',
        },
		loadContainer: {
			flex: 1,
			backgroundColor: '#fff',
			padding: 20,
			marginTop: "50%"
		},
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
			flexWrap: 'wrap',
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
			height: 100,
		},
		ingredientChip: {
			backgroundColor: 'green',
			borderRadius: 16,
			padding: 8,
			flexDirection: 'row',
			alignItems: 'center',
			marginRight: 8,
			marginBottom: 8,
			flex: 1/3
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