import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../FirebaseConfig'; // Firebase configuration
import Ionicons from '@expo/vector-icons/Ionicons'; // Icon components

const SettingsScreen = ({ user, setUser }) => {

    const navigation = useNavigation();

    // State variables for music and notification
    const [isMusicEnabled, setMusicEnabled] = useState(true);
    const [isNotificationsEnabled, setNotificationsEnabled] = useState(true);

    // Function toggle background music setting (no function)
    const toggleMusic = () => {
        setMusicEnabled((prev) => !prev);
        if (isMusicEnabled) {
            console.log('Background music paused');
        } else {
            console.log('Background music playing');
        }
    };

    // Function toggle notification setting (no function)
    const toggleNotifications = () => {
        setNotificationsEnabled((prev) => !prev);
        if (isNotificationsEnabled) {
            console.log('Notifications disabled');
        } else {
            console.log('Notifications enabled');
        }
    };

    // Function handle login and logout
    const handleLogin = async () => {

        if (user) {
            // User is already logged in, perform logout logic
            try {
                await FIREBASE_AUTH.signOut();
                // navigate to settings screen
                navigation.navigate("Settings");
            } catch (error) {
                console.error('Sign out failed:', error);
            }
            // show log out message
            alert("Logging Out...")
        } else {
            // Navigate to login screen if user not logged in
            navigation.navigate('Login');
        }
    };

    // Function handle feedback
    const handleFeedback = () => {
        // Feedback URL
        const feedbackURL = 'https://forms.gle/5DEc9hUUpxVpWgka6';
        // Open feedback URL in browser
        Linking.openURL(feedbackURL);
    };

    return (
        <View style={styles.container}>

            {/* Background music setting */}
            <View style={styles.settingRow}>
                <View style={styles.buttonContent}>
                    <Ionicons name="musical-notes-outline" size={30} style={styles.icon2} color='#4A3728' />
                    <Text style={styles.settingText}>Background Music</Text>
                </View>
                <Switch
                    style={[styles.switch, { transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }]}
                    value={isMusicEnabled}
                    onValueChange={toggleMusic}
                    trackColor={{ false: 'gray', true: '#ebd9c3' }}
                    thumbColor={isMusicEnabled ? '#4b3735' : 'white'}
                />
            </View>

            {/* Notification setting */}
            <View style={styles.settingRow}>
                <View style={styles.buttonContent}>
                    <Ionicons name="notifications-outline" size={30} style={styles.icon2} color='#4A3728' />
                    <Text style={styles.settingText}>Notifications</Text>
                </View>

                <Switch
                    style={[styles.switch, { transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }]}
                    value={isNotificationsEnabled}
                    onValueChange={toggleNotifications}
                    trackColor={{ false: 'gray', true: '#ebd9c3' }}
                    thumbColor={isNotificationsEnabled ? '#4b3735' : 'white'}
                />
            </View>

            {/* Display login or logout button */}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <View style={styles.buttonContent}>
                    <Ionicons name="person-outline" size={30} style={styles.icon1} color='#4A3728' />
                    <Text style={styles.buttonText}>{user ? 'Logout Account' : 'Login Account'}</Text>
                </View>
            </TouchableOpacity>

            {/* Button to feedback url */}
            <TouchableOpacity style={styles.button} onPress={handleFeedback}>
                <View style={styles.buttonContent}>
                    <Ionicons name="settings-outline" size={30} style={styles.icon1} color='#4A3728' />
                    <Text style={styles.buttonText}>Send Feedback</Text>
                </View>
            </TouchableOpacity>

        </View >
    );
};

// Styles for components
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#ebd9c3',
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 20,
        width: '100%',
        height: '13%',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        backgroundColor: '#c4a586',
    },
    settingText: {
        paddingLeft: 15,
        fontWeight: 'bold',
        fontSize: 20,
        color: '#4b3735',
    },
    switch: {
        marginRight: 20,
    },
    button: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 10,
        margin: 20,
        width: '100%',
        height: '13%',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        backgroundColor: '#c4a586',
    },
    buttonText: {
        paddingLeft: 13,
        fontWeight: 'bold',
        fontSize: 20,
        color: '#4b3735',
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon1: {
        paddingLeft: 5,
    },
    icon2: {
        paddingLeft: 15,
    },
});

export default SettingsScreen;
