import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';
import { doc, setDoc } from 'firebase/firestore'; // Firestore doc
import { FIREBASE_AUTH, FIREBASE_DB } from '../FirebaseConfig'; // Firebase configuration
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Firebase function to create user with email and password
import { useNavigation } from '@react-navigation/native';

const CreateAccountScreen = () => {

    const navigation = useNavigation();

    // State variables for email, password, username, and loading indicator
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    // Function for sign up
    const signUp = async () => {
        // Start loading indicator
        setLoading(true);

        try {
            // Basic validation for username, email, and password
            if (!username.trim() || !email.trim() || !password.trim()) {
                throw new Error('Username, email, and password are required.');
            }

            // Email validation usign regular expression
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                throw new Error('Invalid email address.');
            }

            // Password validation
            // At least 8 characters, can be letters or numbers
            const passwordPattern = /^.{8,}$/;
            if (!passwordPattern.test(password)) {
                throw new Error('Password must be at least 8 characters long.');
            }

            // Create user with email and password
            const response = await createUserWithEmailAndPassword(auth, email, password);
            const userId = response.user.uid;

            // Set user data such as email, username, points, completedwords, and completedlevels in Firebase
            await setDoc(doc(FIREBASE_DB, 'users', userId), {
                email: response.user.email,
                username: username.trim(),
                points: 50,
                completedwords: 0,
                completedlevels: 0,
            });

            console.log(response);
            // Show Account Created message
            alert('Account Created');
            // Navigate to WordByWord screen which is home screen after account created
            navigation.navigate('WordByWord');
        } catch (error) {
            console.error(error.message);
            // Show Registration Failed
            alert('Registration Failed: ' + error.message);
        } finally {
            // Stop loading indicator
            setLoading(false);
        }
    };


    return (

        <View style={styles.container}>
            {/* Username input field */}
            <TextInput
                style={styles.text}
                value={username}
                placeholder='Username'
                autoCapitalize='none'
                onChangeText={(text) => setUsername(text)}
            />
            {/* Email input field */}
            <TextInput
                style={styles.text}
                value={email}
                placeholder='Email'
                autoCapitalize='none'
                onChangeText={(text) => setEmail(text)}
            />
            {/* Password input field */}
            <TextInput
                style={styles.text}
                secureTextEntry={true}
                value={password}
                placeholder='Password'
                autoCapitalize='none'
                onChangeText={(text) => setPassword(text)}
            />

            {/* Show loading indicator if loading is true, otherwise show sign up button */}
            {loading ? (
                <ActivityIndicator size="large" color="#black" />
            ) : (

                // Button to create account
                <TouchableOpacity style={styles.button} onPress={signUp}>
                    <Text style={styles.buttonText}>Create account</Text>
                </TouchableOpacity>
            )}
        </View>
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
    text: {
        margin: 5,
        height: '10%',
        width: '80%',
        borderWidth: 3,
        borderRadius: 4,
        padding: 10,
        backgroundColor: 'white',
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '8%',
        width: '80%',
        padding: 10,
        borderWidth: 1,
        backgroundColor: '#c4a586',
        margin: 10,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4b3735',
    },
});

export default CreateAccountScreen;
