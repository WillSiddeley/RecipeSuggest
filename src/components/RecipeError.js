import { Component } from 'react';
import { View, Text, StyleSheet, BackHandler, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from 'react-native-elements'

export default class RecipeErrror extends Component {

    constructor(props) {
        super(props);
        this.apiData = props.apiData;
        // Dummy data for testing
        if (this.apiData.error === undefined) {
            this.apiData.error = "Internal server error";
        }
    }

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

    render = () => {
        return (
            <View style={this.styles.container}>
                <View style={this.styles.iconContainer}>
                    <Button 
                        icon={<MaterialIcons name="close" size={30} color="black" />}
                        onPress={this.exitRecipeResult} 
                        buttonStyle={{ backgroundColor: "#fff" }}
                    />
                </View>
                <View style={this.styles.container}>
			    	<Text style={this.styles.largeText}>:(</Text>
                    <Text style={this.styles.smallText}>Something has gone wrong! Please try again.</Text>
                    <Text style={this.styles.monospaceText}>Error Code:</Text>
			    	<Text style={this.styles.monospaceText}>{ this.apiData.error }</Text>
			    </View>
            </View>
        )
    }

    styles = StyleSheet.create({
		container: {
			backgroundColor: '#fff',
			padding: 20
		},
        iconContainer: {
            flexDirection: 'row',
            backgroundColor: '#fff',
        },
        largeText: {
            fontSize: 50,
            marginBottom: 20
        },
        smallText: {
            fontSize: 18,
            marginBottom: 20
        },
        monospaceText: {
            fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace'
        }
    });
}

