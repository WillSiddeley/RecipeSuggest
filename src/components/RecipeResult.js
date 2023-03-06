import { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';

export default class RecipeResult extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // Data from the server / Edemam API
            apiData: props.apiData,
        }
        // Set styles if available
        this.styles = props.styles;
    }

    render = () => {
        return (
            <View style={this.styles.container}>
				<Text>{ this.state.apiData[0][0].recipe.label }</Text>
			</View>
        );
    }

}