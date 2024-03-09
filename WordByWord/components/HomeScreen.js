import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { doc, getDoc } from 'firebase/firestore'; // Firestore doc
import { FIREBASE_DB } from '../FirebaseConfig'; // Firebase configuration
import Ionicons from '@expo/vector-icons/Ionicons'; // Icon components

const HomeScreen = ({ navigation, user, totalPoints, setTotalPoints }) => {

    useEffect(() => {

        console.log("Points:" + totalPoints);

        // Fetch points when user change
        if (user) {
            fetchPoints();
        } else {
            // Set totalPoints to 200 when user signs out
            setTotalPoints(200);
        }
    }, [user]);

    // Function for fetch points from Firestore
    const fetchPoints = async () => {
        try {
            if (user) {
                const userDoc = doc(FIREBASE_DB, 'users', user.uid);
                const docSnap = await getDoc(userDoc);

                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    console.log('User Data:', userData);
                    setTotalPoints(userData.points);
                } else {
                    console.log('No such document!');
                }
            }
        } catch (error) {
            console.error('Error fetching points:', error);
        }
    };

    // Function navigate to the Word Formation Mode screen
    const navigateToWordFormation = () => {
        navigation.navigate('Word Formation Mode');
    };

    // Function navigate to the Levels screen
    const navigateToWordLengthChallenge = () => {
        navigation.navigate('Levels');
    };

    // Function navigate to the Leaderboard screen
    const navigateToLeaderboard = () => {
        // Check only sign in user allow navigate to the Leaderboard Screen
        if (user) {
            navigation.navigate('Leaderboard');
        } else {
            alert('Please Login First!');
        }
    };

    // Function navigate to the Settings Screen
    const navigateToSettings = () => {
        navigation.navigate('Settings');
    };

    return (
        <View style={styles.container}>

            {/* Display WordByWord logo */}
            <View style={styles.imageContainer}>
                <Image style={styles.imageStyle} source={require('./images/wordbyword-logo.png')} />
            </View>

            {/* Button navigate to Word Formation Mode Screen */}
            <TouchableOpacity style={styles.mode1Button} onPress={navigateToWordFormation}>
                <Text style={styles.fontMode}>Word Formation Mode</Text>
            </TouchableOpacity>

            {/* Button navigate to Word Length Challenge Mode Screen */}
            <TouchableOpacity style={styles.mode2Button} onPress={navigateToWordLengthChallenge}>
                <Text style={styles.fontMode}>Word Length Challenge Mode</Text>
            </TouchableOpacity>

            {/* Button navigate to Leaderboard Screen */}
            <TouchableOpacity style={styles.leaderboardButton} onPress={navigateToLeaderboard}>
                <View style={styles.buttonContent}>
                    <Ionicons name="trophy-outline" size={25} style={styles.iconLeaderboard} color='#4A3728' />
                    <Text style={styles.fontLeaderboard}>Leaderboard</Text>
                </View>
            </TouchableOpacity>

            {/* Button navigate to Settings Screen */}
            <TouchableOpacity style={styles.settingsButton} onPress={navigateToSettings}>
                <View style={styles.buttonContent}>
                    <Ionicons name="settings-outline" size={25} style={styles.iconSettings} color='#4A3728' />
                    <Text style={styles.fontSettings}>Settings</Text>
                </View>
            </TouchableOpacity>

            {/* Display user email when user logged in, otherwise, it will show "Not Logged In" */}
            {user ? (
                <Text style={styles.text}>Logged in as: {user.email}</Text>
            ) : (
                <Text style={styles.text}>Not Logged In</Text>
            )}

            {/* Display total points */}
            <Text style={styles.pointsText}>Your Points: {totalPoints}</Text>

        </View >
    );
};

// Styles for components
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ebd9c3',
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 10,
    },
    imageStyle: {
        width: 600,
        height: 310,
        borderRadius: 200,
    },
    pointsText: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    text: {
        marginTop: 15,
        marginBottom: 10,
        fontSize: 15,
        fontWeight: 'bold',
    },
    fontMode: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#4b3735',
    },
    fontLeaderboard: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#4b3735',
        paddingRight: 20,
    },
    fontSettings: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#4b3735',
        paddingRight: 40,
    },
    mode1Button: {
        height: '10%',
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#c4a586',
        borderRadius: 10,
        borderColor: '#4A3728',
        borderWidth: 1,
    },
    mode2Button: {
        height: '10%',
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        backgroundColor: '#c4a586',
        borderRadius: 10,
        borderColor: '#4A3728',
        borderWidth: 1,
    },
    leaderboardButton: {
        height: '6%',
        width: '40%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        backgroundColor: '#c4a586',
        borderRadius: 10,
        borderColor: '#4A3728',
        borderWidth: 1,
    },
    settingsButton: {
        height: '6%',
        width: '40%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        backgroundColor: '#c4a586',
        borderRadius: 10,
        borderColor: '#4A3728',
        borderWidth: 1,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconLeaderboard: {
        paddingRight: 10,
    },
    iconSettings: {
        paddingRight: 20,
    },
});

export default HomeScreen;
