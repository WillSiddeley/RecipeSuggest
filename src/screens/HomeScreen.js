import React from 'react';
import { Component } from 'react';
import { View, FlatList, Dimensions, PixelRatio } from 'react-native';
import HomeSlide1 from '../assets/HomeSlide1';
import Slide from '../components/Slide';

// Home screen inspiration from:
// https://piggy.to/@magic/emwmoc

export default class HomeScreen extends Component {

    slides = [
        { id: '1', content: <HomeSlide1 />, backgroundColor: '#d6b5b3' },
        { id: '2', content: <HomeSlide1 />, backgroundColor: 'blue' },
        { id: '3', content: <HomeSlide1 />, backgroundColor: 'green' },
    ]

    constructor(props) {
        super(props);
        this.state = {
            slideIndex: 0,
            screenWidth: Dimensions.get('window').width,
            screenHeight: Dimensions.get('window').height,
            pixelsRatio: PixelRatio.get(),
        }
        this.slideRef = React.createRef();
    }

    renderItem = ({item, index}) => {
        return (
            <Slide 
                index={index}
                activeIndex={this.state.activeIndex}
                screenWidth={this.state.screenWidth}
                pixelsRatio={this.state.pixelsRatio}
                content={item.content}
                backgroundColor={item.backgroundColor}
            />
        )
    }

    render = () => {
        return (
            <View>
                <FlatList
                    ref={this.slideRef}
                    data={this.slides}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    renderItem={this.renderItem}
                    onScrollToIndexFailed={() => {}}
                    onMomentumScrollEnd={(event) => {
                        this.setState({ slideIndex: Math.round(
                            event.nativeEvent.contentOffset.x / 
                            event.nativeEvent.layoutMeasurement.width
                        )});
                    }}
                />
            </View>
        );
    }
}