import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { doc, onSnapshot } from 'firebase/firestore'; // Firestore doc and onSnapshot
import { FIREBASE_DB } from '../FirebaseConfig'; // Firebase configuration

const Levels = ({ user, userCompletedLevel }) => {
    const navigation = useNavigation();
    // State variable for completed level
    const [completedLevel, setCompletedLevel] = useState(0);

    useEffect(() => {
        if (user) {
            // Fetch the completed level from Firebase
            const fetchCompletedLevel = async () => {
                const userDoc = doc(FIREBASE_DB, 'users', user.uid);
                try {
                    const unsubscribe = onSnapshot(userDoc, (docSnap) => {
                        if (docSnap.exists()) {
                            const userData = docSnap.data();
                            const completedLevel = userData.completedlevels || 0;
                            setCompletedLevel(completedLevel);
                        }
                    });

                    return () => unsubscribe();
                } catch (error) {
                    console.error('Error fetching completed level:', error);
                }
            };

            // call fetchCompletedLevel function
            fetchCompletedLevel();
        } else {
            // If user is not logged in, use the userCompletedLevel state
            setCompletedLevel(userCompletedLevel);
        }
    }, [user, userCompletedLevel]);

    // Function for level prees
    const handleLevelPress = (level) => {
        if (level <= completedLevel + 1) {
            // Navigate to Word Length Challenge Mode with the selected level
            navigation.navigate('Word Length Challenge Mode', { level });
        } else {
            // Show level locked message if level is locked
            alert('Level locked. Please complete the previous levels first.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

            {/* Render level buttons */}
            {Array.from({ length: 10 }, (_, index) => index + 1).map(level => (
                <TouchableOpacity
                    key={level}
                    style={[styles.levelButton, level > completedLevel + 1 && styles.lockedLevelButton]}
                    onPress={() => handleLevelPress(level)}
                    disabled={level > completedLevel + 1}
                >
                    <Text style={styles.text}>Level {level}</Text>
                </TouchableOpacity>
            ))}

        </ScrollView>
    );
};

// Styles for components
const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        backgroundColor: '#ebd9c3',
    },
    levelButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#c4a586',
        borderRadius: 5,
        width: 200,
        height: 60,
        borderWidth: 1,
        marginTop: 20,
    },
    lockedLevelButton: {
        backgroundColor: 'gray',
    },
    text: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#4b3735',
    },
});

export default Levels;
