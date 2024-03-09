import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore'; // Firestore collection and onSnapshot function
import { FIREBASE_DB } from '../FirebaseConfig'; // Firebase configuration

const LeaderboardScreen = () => {

    // State variables for selected mode and user list for leaderboard
    const [selectedMode, setSelectedMode] = useState('WordFormation');
    const [userList, setUserList] = useState([]);

    // Function to handle mode change
    const handleModeChange = (mode) => {
        setSelectedMode(mode);
        fetchLeaderboardData(mode);
    };

    // Function to fetch leaderboard data from Firebase
    const fetchLeaderboardData = (mode) => {
        // Decide the leaderboard field based on the mode
        const leaderboardField = mode === 'WordFormation' ? 'completedwords' : 'completedlevels';
        // Reference to users collection in Firestore
        const usersCollection = collection(FIREBASE_DB, 'users');
        // Real-time listener for changes in user collection
        const unsubscribe = onSnapshot(usersCollection, (querySnapshot) => {
            const users = [];
            querySnapshot.forEach((doc) => {
                const userData = doc.data();
                users.push({
                    username: userData.username,
                    completedValue: userData[leaderboardField] || 0,
                });
            });

            // Sort the users array in descending order based on completedValue
            users.sort((a, b) => b.completedValue - a.completedValue);

            // Update the user list state
            setUserList(users);
        });

        return unsubscribe;
    };


    useEffect(() => {
        // Fetch initial leaderboard data
        const unsubscribe = fetchLeaderboardData(selectedMode);

        // Clean up listener
        return () => {
            unsubscribe();
        };
    }, [selectedMode]);


    return (
        <View style={styles.container}>
            {/* Mode selection buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.modeButton, selectedMode === 'WordFormation' && styles.selectedButton]}
                    onPress={() => handleModeChange('WordFormation')}
                >
                    <Text style={styles.buttonText}>Word Formation</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.modeButton, selectedMode === 'WordLengthChallenge' && styles.selectedButton]}
                    onPress={() => handleModeChange('WordLengthChallenge')}
                >
                    <Text style={styles.buttonText}>Word Length Challenge</Text>
                </TouchableOpacity>
            </View>

            {/* Horizontal line separator */}
            <View style={styles.horizontalLine} />

            {/* Leaderboard list */}
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.leaderboardContainer}>

                    {userList.map((user, index) => (
                        <View key={index} style={styles.userPanel}>
                            <View style={styles.userPanelRank}>
                                <Text style={styles.textRank}>{`${index + 1}`}</Text>
                            </View>
                            <Text style={styles.textName}>{`${user.username}`}</Text>
                            <Text style={styles.text}>{`${selectedMode === 'WordFormation' ? 'Completed Words (In 2 Minutes)' : 'Completed Level'}: ${user.completedValue}`}</Text>

                        </View>
                    ))}
                </View>
            </ScrollView>

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
    buttonContainer: {
        flexDirection: 'row',
        margin: 10,
    },
    modeButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 180,
        height: 50,
        marginHorizontal: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#4A3728',
        backgroundColor: 'gray',
    },
    selectedButton: {
        backgroundColor: '#f7f7e9',
    },
    buttonText: {
        fontWeight: 'bold',
        color: '#4b3735',

    },
    leaderboardContainer: {
        marginTop: 10,
    },
    userPanelRank: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 35,
        height: 35,
        borderRadius: 30,
        borderWidth: 1.5,
        backgroundColor: '#f7f7e9',
    },
    userPanel: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 300,
        height: 60,
        margin: 11,
        paddingBottom: 25,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#4A3728',
        backgroundColor: '#c4a586',
    },
    textRank: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'black',

    },
    textName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#4b3735',
    },
    text: {
        fontSize: 15,
        color: '#4b3735',
    },
    horizontalLine: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        width: '100%',
        margin: 10,
    },
});

export default LeaderboardScreen;
