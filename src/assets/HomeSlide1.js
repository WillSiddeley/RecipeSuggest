import React from 'react';
import { StyleSheet, ImageBackground } from "react-native";
import { Image, Text } from "react-native-elements";

export default class HomeSlide1 extends React.Component {

    constructor(props) {
        super(props);
    }

    render = () => {
        return (
            <ImageBackground source={require("./HomeSlide1Lines.png")} style={styles.container}>
                <Image source={require("./HomeSlide1Food.png")} style={styles.image}/>
                <Text style={styles.text}>Crafting Delicious Meals with Ingredients from Home</Text>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: "relative",
        width: "100%",
        height: "100%",
        minWidth: "100%",
        minHeight: "100%",
        display: "flex",
        flexWrap: "nowrap",
    },
    text: {
        position: "absolute",
        flexDirection: "row",
        top: "60%",
        left: "10%",
        color: "black",
        fontFamily: "Roboto",
        fontWeight: "bold",
        fontSize: 35,
        width: "70%",
        flexWrap: 'wrap',
        zIndex: 0
    },
    image: {
        position: "relative",
        marginTop: 50,
        marginLeft: 25,
        width: 350,
        height: 350,
        zIndex: 100
    },
});