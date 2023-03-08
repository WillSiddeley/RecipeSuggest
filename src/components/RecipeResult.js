import { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import Accordion from 'react-native-collapsible/Accordion';

export default class RecipeResult extends Component {

    sections = [
        {
            title: "Ingredients Needed",
            icon: "add-task",
            content: "x",
            expanded: false,
        },
        {
            title: "Recipe Steps",
            icon: "autorenew",
            content: "y",
            expanded: false,
        },
        {
            title: "Nutritional Information",
            icon: "assignment",
            content: "z",
            expanded: false,
        }
    ]

    constructor(props) {
        super(props);
        // Set recipe from props
        this.recipe = props.apiData;
        // State for accordion
        this.state = {
            expandedSections: []
        }
    }

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
        return (
            <View style={this.styles.sectionContent}>
                <Text style={this.styles.sectionContentText}>{section.content}</Text>
            </View>
        )
    }

    render = () => {
        return (
            <ScrollView style={this.styles.container}>
                <View style={this.styles.imageContainer}>
                    <Image
                        source={{ uri: this.recipe.image }}
                        style={this.styles.image}
                    />
                </View>
                <View style={this.styles.textContainer}>
                    <Text style={this.styles.title}>{ this.recipe.label }</Text>
                    <Text style={this.styles.subtitle}>{ this.recipe.cuisineType.join(' | ') } | { this.recipe.dietLabels.join(' | ') }</Text>
                </View>
                <Accordion
                    sections={this.sections}
                    activeSections={this.state.expandedSections}
                    onChange={this.toggleSections}
                    renderHeader={this.renderHeader}
                    renderContent={this.renderSection}
                />
			</ScrollView>
        );
    }

    styles = StyleSheet.create({
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
    });
}