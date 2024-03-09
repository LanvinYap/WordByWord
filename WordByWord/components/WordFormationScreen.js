import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { lettersList, validWordsList } from './List';
import GameOverScreen from './GameOverScreen';
import { doc, updateDoc, getDoc } from 'firebase/firestore'; // Firestore doc
import { FIREBASE_DB } from '../FirebaseConfig'; // Firebase configuration

const WordFormationScreen = ({ navigation, user, setTotalPoints }) => {

    // State variables for inputWord, letters, points, completedWords, timeRemaining, milliseconds, correctWords, gameOver
    const [inputWord, setInputWord] = useState('');
    const [letters, setLetters] = useState(lettersList[Math.floor(Math.random() * lettersList.length)]);
    const [points, setPoints] = useState(0);
    const [completedWords, setCompletedWords] = useState(0);
    // set time to 2 minutes
    const [timeRemaining, setTimeRemaining] = useState(120);
    const [milliseconds, setMilliseconds] = useState(0);
    const [correctWords, setCorrectWords] = useState([]);
    const [gameOver, setGameOver] = useState(false);

    const timerRef = useRef(null);

    useEffect(() => {
        // Timer logic
        timerRef.current = setInterval(() => {
            if (timeRemaining > 0) {
                setTimeRemaining((prevTime) => prevTime - 1);
            } else {
                // Call end game function when time out
                endGame();
            }
        }, 1000);

        // clear the time interval
        return () => clearInterval(timerRef.current);
    }, [timeRemaining]);

    // Function handle word enter
    const enterWord = async () => {
        const lowerCaseInput = inputWord.toLowerCase();

        if (!correctWords.includes(lowerCaseInput)) {

            // Check if the word valid
            const isCorrect = validateWord(lowerCaseInput);

            if (isCorrect) {

                // Increase points by 10
                const newPoints = points + 10;

                // Update local state
                setPoints(newPoints);
                setCompletedWords((prevPoints) => prevPoints + 1);
                setCorrectWords((prevWords) => [...prevWords, lowerCaseInput]);

            } else {
                // Show incorrect word message
                Alert.alert('Incorrect word, please try again.');
            }
            // Clear input field
            setInputWord('');
        } else {
            // show already entered word message
            Alert.alert('You have already entered this word.');
            // clear input
            setInputWord('');
        }
    };

    // Function add a letter to the input field
    const addLetterToInput = (letter) => {
        setInputWord((prevInput) => prevInput + letter);
    };

    // Function validate a word is correct
    const validateWord = (word) => {
        const validWords = validWordsList.flat();
        return validWords.includes(word);
    };

    // Function end game
    const endGame = async () => {

        // Clear the timer interval
        clearInterval(timerRef.current);

        if (user) {
            const userDoc = doc(FIREBASE_DB, 'users', user.uid);

            try {
                // Fetch the existing user data
                const docSnap = await getDoc(userDoc);

                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    const currentCompletedWords = userData.completedwords || 0;

                    const currentTotalPoints = userData.points || 0;

                    // Calculate additional points based on the number of correct words
                    const additionalPoints = completedWords * 10;

                    setTotalPoints((prevTotalPoints) => prevTotalPoints + additionalPoints);

                    await updateDoc(userDoc, {
                        points: currentTotalPoints + additionalPoints,
                    });

                    // Only update if the completedWords is higher
                    if (completedWords > currentCompletedWords) {
                        // Update the completedwords field in the database
                        await updateDoc(userDoc, {
                            completedwords: completedWords,
                        });
                    }
                } else {
                    console.log('No such document');
                }
            } catch (error) {
                console.error('Error updating completedwords in Firebase:', error);
            }
        }

        // Set time remaining to 0
        setTimeRemaining(0);
        // Set game over state to true
        setGameOver(true);
    };

    // Function for play again
    const handlePlayAgain = () => {
        // Reset all the state values to their initial values
        setInputWord('');
        setLetters(lettersList[Math.floor(Math.random() * lettersList.length)]);
        setPoints(0);
        setCompletedWords(0);
        // Reset time to 2 minutes
        setTimeRemaining(120);
        setMilliseconds(0);
        setCorrectWords([]);
        setGameOver(false);
    };


    // Function navigate to home screen
    const handleBackToHome = () => {
        navigation.navigate('WordByWord');
    };

    return (
        <View style={styles.container}>

            {/* Display remaining time */}
            <Text style={styles.time}>{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}:{milliseconds.toString().padStart(2, '0')}</Text>

            {/* Display constructed words on board */}
            <View style={styles.displayBoardContainer}>
                {correctWords.map((wordDisplay, index) => (
                    <View key={index} style={styles.column}>
                        <Text style={styles.displayWords}>{wordDisplay}</Text>
                    </View>
                ))}
            </View>

            {/* Display number of completed words */}
            <Text style={styles.letters}>Completed Words:</Text>

            <Text style={styles.completedWords}>{completedWords}</Text>

            {/* Horizontal line separator */}
            <View style={styles.horizontalLine} />

            {/* Display Construct word */}
            <Text style={styles.letters}>Construct Word:</Text>

            <View style={styles.constructContainer}>
                <Text style={styles.letters}>{inputWord}</Text>
            </View>

            {/* Display letters as buttons */}
            <Text style={styles.letters}>Use These Letters:</Text>

            <View style={styles.lettersContainer}>
                {letters.map((letter, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.letterButton}
                        onPress={() => addLetterToInput(letter)}
                    >
                        <Text>{letter}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Button to enter word */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    enterWord();
                }}
            >
                <Text style={styles.text}>Enter Word</Text>
            </TouchableOpacity>

            {/* Display game over screen */}
            {gameOver && (
                <GameOverScreen
                    completedWords={completedWords}
                    points={points}
                    onPlayAgain={handlePlayAgain}
                    onBackToHome={handleBackToHome}
                />
            )}

        </View>
    );
};

// Styles for components
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#ebd9c3',
    },
    time: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#4b3735',
    },
    displayBoardContainer: {
        flexWrap: 'wrap',
        alignItems: 'center',
        width: '90%',
        height: '37%',
        borderWidth: 2,
        backgroundColor: '#f7f7e9',
    },
    column: {
        padding: 8,
    },
    displayWords: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4b3735',
    },
    completedWords: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#4b3735',
    },
    horizontalLine: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        width: '100%',
        margin: 10,
    },
    constructContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        width: '80%',
        height: '6%',
        backgroundColor: '#f7f7e9',
        borderWidth: 1.5,
        borderRadius: 10,
    },
    lettersContainer: {
        flexDirection: 'row',
        margin: 10,
        backgroundColor: '#f7f7e9',
        borderWidth: 1.5,
        borderRadius: 10,
    },
    letterButton: {
        padding: 15,
        marginHorizontal: 5,
        backgroundColor: '#f7f7e9',
    },
    letters: {
        fontSize: 18,
        margin: 5,
        color: '#4b3735',
    },
    button: {
        padding: 10,
        backgroundColor: '#c4a586',
        borderRadius: 5,
        borderWidth: 1,
    },
    text: {
        fontSize: 15,
        color: 'black',
    },
    points: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default WordFormationScreen;