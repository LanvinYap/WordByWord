import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const GameOverScreen = ({ completedWords, points, onPlayAgain, onBackToHome }) => {
    return (
        <View style={styles.container}>
            <View style={styles.container2}>

                {/* Display number of completed words */}
                <Text style={styles.text}>Completed {completedWords} Words!</Text>

                {/* Display points earned */}
                <Text style={styles.text}>Points: +{points}</Text>

                {/* Buttons to play again */}
                <TouchableOpacity style={styles.button1} onPress={onPlayAgain}>
                    <Text style={styles.buttonText}>Play Again</Text>
                </TouchableOpacity>

                {/* Button to go back to home screen */}
                <TouchableOpacity style={styles.button2} onPress={onBackToHome}>
                    <Text style={styles.buttonText}>Back to Home</Text>
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
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#4b3735',
    },
    buttonText: {
        color: '#4b3735',
    },
    button1: {
        alignItems: 'center',
        padding: 10,
        paddingLeft: 22,
        paddingRight: 22,
        backgroundColor: '#c4a586',
        borderWidth: 2,
        margin: 5,
    },
    button2: {
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#c4a586',
        borderWidth: 2,
        margin: 5,
    },
});

export default GameOverScreen;
