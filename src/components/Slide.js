import { Component } from 'react';
import { View } from 'react-native';

export default class Slide extends Component {

    constructor(props) {
        super(props);
        this.state = {
            index: props.index,
            activeIndex: props.activeIndex,
            screenWidth: props.screenWidth,
            pixelsRatio: props.pixelsRatio,
            content: props.content,
            backgroundColor: props.backgroundColor,
        }
    }

    getSlideStyle = () => {
        return {
            width: this.state.screenWidth, 
            backgroundColor: this.state.backgroundColor,
        }
    }

    render = () => {
        return (
            <View style={this.getSlideStyle()}>
                { this.state.content }
            </View>
        );
    }
}
