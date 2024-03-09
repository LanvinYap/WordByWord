import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { lettersList, validWordsList, hintWordsList } from './List2';
import LevelCompletionBoard from './LevelCompletionBoard';
import UsePointsScreen from './UsePointsScreen';
import HintScreen from './HintScreen';
import { doc, updateDoc, getDoc } from 'firebase/firestore'; // Firestore doc
import { FIREBASE_DB } from '../FirebaseConfig'; // Firebase configuration
import Ionicons from '@expo/vector-icons/Ionicons'; // Icon components

const WordLengthChallengeScreen = ({ navigation, route, user, totalPoints, setTotalPoints, userCompletedLevel, setUserCompletedLevel }) => {

    // State variables for inputWord, completedWords, correctWords, isLevelWon, initialDisplay, tempDisplay, level
    // lettersListForLevel, hintWordsListForLevel, currentHint, usedHints, letters, usepoint, hintAvailable
    const [inputWord, setInputWord] = useState('');
    const [completedWords, setCompletedWords] = useState(0);
    const [correctWords, setCorrectWords] = useState([]);
    const [isLevelWon, setLevelWon] = useState(false);
    const [initialDisplay, setInitialDisplay] = useState([]);
    const [tempDisplay, setTempDisplay] = useState(initialDisplay);

    const { level } = route.params;

    const lettersListForLevel = lettersList[level - 1];
    const validWordsListForLevel = validWordsList[level - 1];
    const hintWordsListForLevel = hintWordsList[level - 1];
    const [currentHint, setCurrentHint] = useState('');
    const [usedHints, setUsedHints] = useState([]);
    const [letters, setLetters] = useState(lettersListForLevel);
    const [usePoint, setUsePoint] = useState(false);
    const [hintAvailable, setHintAvailable] = useState(false);

    // Function provide a hint
    const provideHint = () => {
        setUsePoint(true);
    };

    // Function handle "Yes" button to use points for hint
    const handleYes = async () => {

        if (totalPoints >= 50) {

            setUsePoint(false);

            const pointsForHint = 50;

            setTotalPoints((prevPoints) => prevPoints - pointsForHint);

            if (user) {
                const userDoc = doc(FIREBASE_DB, 'users', user.uid);

                try {
                    // Fetch the existing user data
                    const docSnap = await getDoc(userDoc);

                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        const currentTotalPoints = userData.points || 0;

                        // Update the points in the database
                        await updateDoc(userDoc, {
                            points: currentTotalPoints - 50,
                        });
                    } else {
                        console.log('No such document');
                    }
                } catch (error) {
                    console.error('Error updating points in Firebase:', error);
                }
            }

            // Filter out used hints
            const availableHints = hintWordsListForLevel.filter(hint => !usedHints.includes(hint));

            console.log(availableHints);

            if (availableHints.length > 0) {
                // Select a random hint from the available hints
                const randomIndex = Math.floor(Math.random() * availableHints.length);
                const hint = availableHints[randomIndex];

                // Update the used hints list
                setUsedHints((prevHints) => [...prevHints, hint]);

                setCurrentHint(hint);
                setHintAvailable(true);
            } else {
                // Show where all hints have been used message
                alert('You have used all available hints for this level.');
            }
        } else {
            // Show where user not enough points message
            alert('You need at least 50 points to use a hint.');
        }
    };

    // Function handle "No" button to not use points for hint
    const handleNo = () => {
        setUsePoint(false);
    }

    // Function handle "Continue" button on the hint screen
    const handleContinue = () => {
        setHintAvailable(false);
    }

    // Function to update the display for correct word
    const updateDisplayForCorrectWord = (word) => {
        // Find the index of the correct word in validWordsList
        const wordIndex = validWordsListForLevel.indexOf(word);

        // Update the temporary display to reveal correct letters
        const updatedDisplay = tempDisplay.map((wordDisplay, index) => {
            if (index === wordIndex) {
                // Preserve the revealed letters and replace only unrevealed ones
                return wordDisplay.map((letter, letterIndex) =>
                    letter === '_ ' ? (word[letterIndex] === ' ' ? ' ' : word[letterIndex]) : letter
                );
            } else {
                return wordDisplay;
            }
        });

        // Update the temporary display state
        setTempDisplay(updatedDisplay);
    };


    useEffect(() => {
        // console.log("lettersListForLevel:", lettersListForLevel);
        // console.log("validWordsListForLevel:", validWordsListForLevel);
        // console.log("hintWordsListForLevel:", hintWordsListForLevel);
        // Set all letters instead of a random one
        setLetters(lettersListForLevel);

        // Initialize initialDisplay and tempDisplay arrays
        const initialDisplayArray = validWordsListForLevel.map(word => Array(word.length).fill('_ '));
        setInitialDisplay(initialDisplayArray);
        setTempDisplay(initialDisplayArray);


    }, [level, lettersListForLevel, validWordsListForLevel]);


    // Function navigate to home screen
    const handleBackToHome = () => {
        navigation.navigate('WordByWord');
    };

    // Function navigate to next level
    const handleNextLevel = () => {
        navigation.navigate('Word Length Challenge Mode', {
            level: level + 1,
        });

        // Reset completedWords state for the next level
        setCompletedWords(0);
        // Reset levelWon state
        setLevelWon(false);
    };

    // Function add a letter to the input field
    const addLetterToInput = (letter) => {
        setInputWord((prevInput) => prevInput + letter);
    };

    // Function handle word enter
    const enterWord = async () => {
        const lowerCaseInput = inputWord.toLowerCase();
        console.log("Level is: " + level);
        if (!correctWords.includes(lowerCaseInput)) {

            // Check if the word valid
            const isCorrect = validateWord(lowerCaseInput);

            if (isCorrect) {
                const isWordInCurrentLevel = validWordsListForLevel.includes(lowerCaseInput);

                if (isWordInCurrentLevel) {
                    // Update the completed words only if the word is in the current level's valid words list
                    setCompletedWords((prevPoints) => prevPoints + 1);
                    setCorrectWords((prevWords) => [...prevWords, lowerCaseInput]);

                    if (completedWords + 1 === validWordsListForLevel.length) {
                        if (level > userCompletedLevel) {
                            setUserCompletedLevel(level);
                        }
                        if (user) {
                            const userDoc = doc(FIREBASE_DB, 'users', user.uid);
                            try {
                                const docSnap = await getDoc(userDoc);
                                if (docSnap.exists()) {
                                    const userData = docSnap.data();
                                    const currentCompletedLevel = userData.completedlevels || 0;
                                    if (level > currentCompletedLevel) {
                                        await updateDoc(userDoc, {
                                            completedlevels: level,
                                        });
                                    }
                                } else {
                                    console.log('No such document');
                                }
                            } catch (error) {
                                console.error('Error updating completedlevels in Firestore:', error);
                            }
                        }
                        setLevelWon(true);
                    }
                    updateDisplayForCorrectWord(lowerCaseInput);
                } else {
                    // Show invalid word message
                    Alert.alert('Invalid Word', 'This word is not part of the current level.');
                }
                // clear input
                setInputWord('');
            } else {
                // clear input
                setInputWord('');
                Alert.alert('Incorrect word, please try again.');
            }
        } else {
            Alert.alert('You have already entered this word.');
            // clear input
            setInputWord('');
        }
    };

    // Function validate a word is correct
    const validateWord = (word) => {
        const validWords = validWordsList.flat();
        return validWords.includes(word);
    };

    return (
        <View style={styles.container}>

            {/* Display level */}
            <Text style={styles.level}>Level {level}</Text>

            {/* Display hint icon */}
            <TouchableOpacity style={styles.hintButton} onPress={provideHint}>
                <Ionicons name="bulb-outline" size={30} style={styles.iconSettings} color='black' />
            </TouchableOpacity>

            {/* Display constructed words on board */}
            <View style={styles.displayBoardContainer}>
                {tempDisplay.map((wordDisplay, columnIndex) => (
                    <View key={columnIndex} style={styles.column}>
                        <Text style={styles.displayWords}>
                            {wordDisplay.join(' ')}
                        </Text>
                    </View>
                ))}
            </View>

            {/* Display number of completed words */}
            <Text style={styles.letters}>Completed Words:</Text>
            <Text style={styles.completedWords}>{completedWords} / {validWordsListForLevel.length}</Text>

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
            <TouchableOpacity style={styles.button} onPress={enterWord}>
                <Text style={styles.text}>Enter Word</Text>
            </TouchableOpacity>

            {/* Display use point screen */}
            {usePoint && (
                <UsePointsScreen
                    onYes={handleYes}
                    onNo={handleNo}
                    totalPoints={totalPoints}
                />
            )}

            {/* Display hint screen */}
            {hintAvailable && (
                <HintScreen
                    hint={currentHint}
                    onContinue={handleContinue}
                />
            )}

            {/* Display level won screen */}
            {isLevelWon && (
                <LevelCompletionBoard
                    onBackToHome={handleBackToHome}
                    onNextLevel={handleNextLevel}
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
    level: {
        fontSize: 25,
        fontWeight: 'bold',
        padding: 10,
        color: '#4b3735',
    },
    hintButton: {
        padding: 10,
        backgroundColor: '#ebd9c3',
        height: 50,
        position: 'absolute',
        top: 2,
        right: 2,
    },
    displayBoardContainer: {
        flexWrap: 'wrap',
        alignItems: 'center',
        width: '90%',
        height: '37%',
        backgroundColor: '#f7f7e9',
        borderWidth: 2,
        marginTop: 5,
    },
    column: {
        padding: 8,
    },
    displayWords: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingLeft: 20,
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

export default WordLengthChallengeScreen;
