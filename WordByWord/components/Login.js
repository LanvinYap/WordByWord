import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';
import { FIREBASE_AUTH } from '../FirebaseConfig'; // Firebase authentication
import { signInWithEmailAndPassword } from 'firebase/auth'; // Firebase function to sign in with email and password
import { useNavigation } from '@react-navigation/native';

const Login = () => {

    const navigation = useNavigation();

    // State variables for email, password, and loading
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    // Function for sign in
    const signIn = async () => {
        // Start loading indicator
        setLoading(true);
        try {
            // sign in with provided email and password
            const response = await signInWithEmailAndPassword(auth, email, password);
            // log response
            console.log(response);
            // navigate to home screen if successful sign in
            navigation.navigate('WordByWord');
        } catch (error) {
            console.log(error);
            // show sign in failed message
            alert('Sign in failed: ' + error.message);
        } finally {
            // stop loading indicator
            setLoading(false);
        }
    }

    // Function navigate to create account screen
    const signUp = async () => {
        navigation.navigate('Create Account');
    };

    return (
        <View style={styles.container}>
            {/* Email input field */}
            <TextInput style={styles.textInput} value={email} placeholder='Email' autoCapitalize='none' onChangeText={(text) => setEmail(text)}></TextInput>
            {/* Password input field */}
            <TextInput style={styles.textInput} secureTextEntry={true} value={password} placeholder='Password' autoCapitalize='none' onChangeText={(text) => setPassword(text)}></TextInput>

            {/* Show loading indicator if loading is true */}
            {loading ? (
                <ActivityIndicator size="large" color="#black" />
            ) : (
                <>

                    <TouchableOpacity style={styles.button} onPress={signIn}>
                        <Text style={styles.text}>Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={signUp}>
                        <Text style={styles.text}>Create account</Text>
                    </TouchableOpacity>

                </>
            )
            }
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
    textInput: {
        margin: 5,
        height: "10%",
        width: '80%',
        borderWidth: 3,
        borderRadius: 4,
        padding: 10,
        backgroundColor: 'white',
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        height: "8%",
        width: '80%',
        padding: 10,
        borderWidth: 1,
        backgroundColor: '#c4a586',
        margin: 10,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4b3735',
    },
});

export default Login;
