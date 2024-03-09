import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const UsePointsScreen = ({ onYes, onNo, totalPoints }) => {
    return (
        <View style={styles.container}>

            {/* Background container */}
            <View style={styles.container2}>

                {/* Text for use points and user total points */}
                <Text style={styles.text}>Use 50 points for Hint</Text>
                <Text style={styles.text}>(Your points: {totalPoints})</Text>

                {/* Button for Yes and No */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={onYes}>
                        <Text>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={onNo}>
                        <Text>No</Text>
                    </TouchableOpacity>
                </View>

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
        alignItems: 'center'
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4b3735',
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    button: {
        width: '40%',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#c4a586',
        borderWidth: 2,
        marginTop: 30,
        margin: 10,

    },
});

export default UsePointsScreen;
