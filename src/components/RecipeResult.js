import { Component } from 'react';
import { View, Text, StyleSheet, BackHandler } from 'react-native';
import { Image } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from 'react-native-elements'
import Accordion from 'react-native-collapsible/Accordion';
import RecipeResultIngredients from './RecipeResultIngredients';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class RecipeResult extends Component {

    vanity = require("../services/vanity");

    constructor(props) {
        super(props);
        this.apiData = props.apiData;
        // State for accordion
        this.state = {
            bookmarked: false,
            expandedSections: [0],
            recipe: props.apiData[0][0].recipe,
        }
        // State for the recipe to display
        this.another = 0,
        this.similar = 0,
        // Get saved bookmarks
        this.retrieveSavedRecipes().then(res => { 
            this.bookmarks = res;
            if (this.bookmarks[this.state.recipe.label] !== undefined) {
                this.setState({ bookmarked: true });
            }
        });
        // Sections for accordion
        this.sections = [
            {
                title: "Ingredients Needed",
                icon: "add-task",
                content: "RecipeResultIngredients",
                expanded: false,
            },
            {
                title: "Recipe Steps",
                icon: "autorenew",
                content: "RecipeResultSteps",
                expanded: false,
            },
            {
                title: "Nutritional Information",
                icon: "assignment",
                content: "RecipeResultNutrition",
                expanded: false,
            }
        ]
    }

    ////////////////////
    // HELPER METHODS //
    ////////////////////

    getSubtitleString = (cuisineType, dietLabels) => {
        let combinedArr = [...cuisineType, ...dietLabels];
        let combinedCapitalized = [];
        combinedArr.forEach(word => combinedCapitalized.push(this.vanity.titleize(word)));
        return combinedCapitalized.join(" | ");
    }

    /////////////////////////////////
    // ACCORDION SECTION RENDERING //
    /////////////////////////////////

    toggleSections = (sections) => {
        // Toggle sections to keep track of expanded sections
        if (sections.length > 0) {
            sections.forEach(sectionIdx => { this.sections[sectionIdx].expanded = !this.sections[sectionIdx].expanded });
        }
        else {
            this.sections.forEach(section => { section.expanded = false });
        }
        // Set state to rerender component
        this.setState({ expandedSections: sections });
    }

    renderHeader = (section) => {
        return (
            <View style={this.styles.sectionHeader}>
                <View style={this.styles.sectionHeaderLeft}>
                    <MaterialIcons 
                        name={section.icon} 
                        size={24} 
                        color="black" 
                        style={{ marginRight: 10 }}
                    />
                    <Text style={this.styles.sectionHeaderText}>{ section.title }</Text>
                </View>
                <MaterialIcons 
                    name={ section.expanded ? "expand-less" : "expand-more" }
                    size={24} 
                    color="black"
                />
            </View>
        )
    }

    renderSection = (section) => {
        if (section.content === "RecipeResultIngredients") {
            return (
                <View style={this.styles.sectionContent}>
                    <RecipeResultIngredients key={this.state.recipe.label} recipe={this.state.recipe} />
                </View>
            )
        }
        else {
            return (
                <View style={this.styles.sectionContent}>
                    <Text>{ section.content }</Text>
                </View>
            )
        }
        
    }

    ///////////////////////////////
    // VIEW OTHER RECIPE BUTTONS //
    ///////////////////////////////

    viewAnother = () => {
        // Get max lengths
        let anotherLength = this.apiData.length;
        let similarLength = this.apiData[this.another].length;
        // Increment another
        this.another += 1;
        // Clamp another to array maximums
        this.similar = (this.similar >= similarLength) ? 0 : this.similar;
        this.another = (this.another >= anotherLength) ? 0 : this.another;
        this.similar = (this.similar >= this.apiData[this.another].length) ? this.apiData[this.another].length - 1 : this.similar;
        // Check if the new recipe is bookmarked
        let isBookmarked = this.bookmarks[this.apiData[this.another][this.similar].recipe.label] !== undefined;
        // Set state to rerender component
        this.setState({ expandedSections: [0], recipe: this.apiData[this.another][this.similar].recipe, bookmarked: isBookmarked });
    }

    viewSimilar = () => {
        // Get max lengths
        let anotherLength = this.apiData.length;
        let similarLength = this.apiData[this.another].length;
        // Increment similar
        this.similar += 1;
        // Clamp similar to array maximums
        this.similar = (this.similar >= similarLength) ? 0 : this.similar;
        this.another = (this.another >= anotherLength) ? 0 : this.another;
        this.similar = (this.similar >= this.apiData[this.another].length) ? this.apiData[this.another].length - 1 : this.similar;
        // Check if the new recipe is bookmarked
        let isBookmarked = this.bookmarks[this.apiData[this.another][this.similar].recipe.label] !== undefined;
        // Set state to rerender component
        this.setState({ expandedSections: [0], recipe: this.apiData[this.another][this.similar].recipe, bookmarked: isBookmarked });
    }

    ///////////////////////////////////////
    // BOOKMARK AND RECIPE SAVE HANDLING //
    ///////////////////////////////////////

    retrieveSavedRecipes = async () => {
        // Retrieve saved recipes from local storage or create empty array
        const savedRecipes = await AsyncStorage.getItem("savedRecipes");
        return savedRecipes ? JSON.parse(savedRecipes) : {};
    }

    toggleBookmark = async () => {
        // Get bookmarks if not gotten already
        this.bookmarks = await this.retrieveSavedRecipes();

        try {
            // Check if the current recipe is already saved
            let currentRecipe = this.state.recipe.label;

            // Guard in case the current recipe is undefined
            if (currentRecipe === undefined) {
                return;
            }

            // If the current recipe is already saved, remove it
            if (this.bookmarks[currentRecipe]) {
                delete this.bookmarks[currentRecipe];
                this.setState({ bookmarked: false });
            }
            // If the current recipe is not saved, add it
            else {
                this.bookmarks[currentRecipe] = this.state.recipe;
                this.setState({ bookmarked: true });
            }

            // Update the async storage
            await AsyncStorage.setItem("savedRecipes", JSON.stringify(this.bookmarks));
        }
        catch (err) {
            console.error(err);
        }
    }

    ///////////////////////////////////
    // HARDWARE BACK BUTTON HANDLING //
    ///////////////////////////////////

    exitRecipeResult = () => {
        this.props.updateState("FORM");
        return true;
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            this.exitRecipeResult,
        );
    }
    
    componentWillUnmount() { 
        this.backHandler.remove();
    }

    ////////////////////////
    // MAIN RENDER METHOD //
    ////////////////////////

    render = () => {
        return (
            <ScrollView style={this.styles.container}>
                <View style={this.styles.iconContainer}>
					<Button 
                        icon={<MaterialIcons name="close" size={30} color="black" />}
                        onPress={this.exitRecipeResult} 
                        buttonStyle={{ backgroundColor: "#fff" }}
                    />
                    <Button 
                        icon={<MaterialIcons key={this.state.recipe.label} name={(this.state.bookmarked) ? "bookmark" : "bookmark-outline"} size={30} color="black" />}
                        onPress={this.toggleBookmark} 
                        buttonStyle={{ backgroundColor: "#fff" }}
                    />
                </View>
                <View style={this.styles.imageContainer}>
                    <Image
                        source={{ uri: this.state.recipe.image }}
                        style={this.styles.image}
                    />
                </View>
                <View style={this.styles.textContainer}>
                    <Text style={this.styles.title}>{ this.vanity.titleize(this.state.recipe.label) }</Text>
                    <Text style={this.styles.subtitle}>{ this.getSubtitleString(this.state.recipe.cuisineType, this.state.recipe.dietLabels) }</Text>
                </View>
                <View style={this.styles.buttonContainer}>
                    <Button
						title="Another Recipie"
						buttonStyle={this.styles.anotherButton}
						titleStyle={this.styles.buttonText}
						onPress={this.viewAnother}
					/>
                    <Button
						title="Similar Recipe"
						buttonStyle={this.styles.similarButton}
						titleStyle={this.styles.buttonText}
						onPress={this.viewSimilar}
					/>
                </View>
                <Accordion style={this.styles.accordion}
                    sections={this.sections}
                    activeSections={this.state.expandedSections}
                    onChange={this.toggleSections}
                    renderHeader={this.renderHeader}
                    renderContent={this.renderSection}
                />
                <View style={{ marginBottom: 40 }}/>
			</ScrollView>
        );
    }

    styles = StyleSheet.create({
        iconContainer: {
            flexDirection: 'row',
            backgroundColor: '#fff',
            justifyContent: 'space-between',
        },
        container: {
            flex: 1,
            backgroundColor: '#fff',
            padding: 20,
        },
        imageContainer: {
            alignItems: 'center',
            marginBottom: 20,
        },
        image: {
            width: 250,
            height: 250,
            borderRadius: 35,
            borderColor: '#000',
            borderWidth: 2,
        },
        textContainer: {
            alignItems: 'center',
            marginBottom: 20,
        },
        title: {
            fontSize: 28,
            fontWeight: 'bold',
            textAlign: 'center',
        },
        subtitle: {
            fontSize: 18,
            color: '#888',
            marginBottom: 10,
        },
        sectionHeader: {
            flexDirection: 'row',
            padding: 10,
            backgroundColor: '#dfdfdf',
            borderBottomColor: '#8c8c8c',
            borderBottomWidth: 1,
            justifyContent: 'space-between'
        },
        sectionHeaderLeft: {
            flexDirection: 'row',
        },
        sectionHeaderText: {
            fontSize: 18,
            fontWeight: 'bold',
        },
        sectionContent: {
            padding: 10,
            backgroundColor: '#eeeeee',
        },
        sectionContentText: {
            fontSize: 16,
            marginBottom: 10,
        },
        buttonContainer: {
            marginBottom: 10,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            padding: 10,
        },
        buttonText: {
            fontSize: 16,
        },
        anotherButton: {
			backgroundColor: '#682d63',
			padding: 15,
			borderRadius: 10,
			alignItems: 'center',
			justifyContent: 'center',
			flexDirection: 'row-reverse',
		},
        similarButton: {
			backgroundColor: '#5fb49c',
			padding: 15,
			borderRadius: 10,
			alignItems: 'center',
			justifyContent: 'center',
			flexDirection: 'row-reverse',
		},
        buttonIcon: {
			marginLeft: 10,
		}
    });
}