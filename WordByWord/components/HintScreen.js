import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const HintScreen = ({ hint, onContinue }) => {
    return (
        <View style={styles.container}>

            <View style={styles.container2}>

                {/* Display Hint */}
                <View style={styles.textContainer}>
                    <Text style={styles.text}>Hint:</Text>
                    <Text style={styles.text}>{hint}</Text>
                </View>

                {/* Button to contunue */}
                <TouchableOpacity style={styles.button} onPress={onContinue}>
                    <Text>Continue</Text>
                </TouchableOpacity>

            </View>
        </View>
    );
};

// Styles for components
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    container2: {
        backgroundColor: 'rgba(232,217,197,0.5)',
        borderRadius: 10,
        padding: 50,
        borderWidth: 2,
        alignItems: 'center',
    },
    textContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4b3735',
    },
    button: {
        width: 130,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#c4a586',
        borderWidth: 2,
        margin: 5,
    },
});

export default HintScreen;
