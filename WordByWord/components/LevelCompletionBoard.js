import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const LevelCompletionBoard = ({ onBackToHome, onNextLevel }) => {
    return (
        <View style={styles.container}>

            <View style={styles.container2}>

                {/* Display text of "Level Completed!"" */}
                <Text style={styles.text}>Level Completed!</Text>

                {/* Button to next level*/}
                <TouchableOpacity style={styles.button} onPress={onNextLevel}>
                    <Text style={styles.buttonText}>Next Level</Text>
                </TouchableOpacity>

                {/* Button to go back to home screen */}
                <TouchableOpacity style={styles.button} onPress={onBackToHome}>
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
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#4b3735',
    },
    buttonText: {
        color: '#4b3735',
    },
    button: {
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#c4a586',
        borderWidth: 2,
        margin: 5,
    },
});

export default LevelCompletionBoard;
