import React from 'react';
import { StyleSheet, ImageBackground } from "react-native";

export default class HomeSlide2 extends React.Component {

    constructor(props) {
        super(props);
    }

    render = () => {
        return (
            <ImageBackground source={require("./HomeSlide2.png")} style={styles.container} />
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
});