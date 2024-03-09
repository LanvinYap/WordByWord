import { registerRootComponent } from 'expo';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/HomeScreen';
import WordFormationScreen from './components/WordFormationScreen';
import WordLengthChallengeScreen from './components/WordLengthChallengeScreen';
import Levels from './components/Levels';
import LeaderboardScreen from './components/LeaderboardScreen';
import SettingsScreen from './components/SettingsScreen';
import Login from './components/Login';
import CreateAccountScreen from './components/CreateAccountScreen';
import { FIREBASE_AUTH } from './FirebaseConfig'; // Firebase authentication
import { onAuthStateChanged } from 'firebase/auth'; // Firebase onAuthStateChanged function

const Stack = createStackNavigator();

export default function App() {

    // State variables for user, totalPoints, and userCompletedLevel
    const [user, setUser] = useState(null);
    const [totalPoints, setTotalPoints] = useState(0);
    const [userCompletedLevel, setUserCompletedLevel] = useState(0);

    useEffect(() => {
        onAuthStateChanged(FIREBASE_AUTH, (data) => {
            // Set user state based on authentication data
            setUser(data);
        })
    }, []);

    return (
        <NavigationContainer>
            {/* Navigation stack */}
            <Stack.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: 'black',
                    },
                    headerTintColor: 'white',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
                initialRouteName={'WordByWord'}
            >
                {/* Home Screen */}
                <Stack.Screen name="WordByWord">
                    {(props) =>
                        <HomeScreen
                            {...props}
                            user={user}
                            totalPoints={totalPoints}
                            setTotalPoints={setTotalPoints} />}
                </Stack.Screen>

                {/* Word Formation Mode Screen */}
                <Stack.Screen name="Word Formation Mode">
                    {(props) =>
                        <WordFormationScreen
                            {...props}
                            user={user}
                            setTotalPoints={setTotalPoints} />}
                </Stack.Screen>

                {/* Word Length Challenge Mode Screen */}
                <Stack.Screen name="Word Length Challenge Mode">
                    {(props) => (
                        <WordLengthChallengeScreen
                            {...props}
                            user={user}
                            totalPoints={totalPoints}
                            setTotalPoints={setTotalPoints}
                            userCompletedLevel={userCompletedLevel}
                            setUserCompletedLevel={setUserCompletedLevel}
                        />
                    )}
                </Stack.Screen>

                {/* Levels Screen */}
                <Stack.Screen name="Levels">
                    {(props) => <Levels
                        {...props}
                        key={userCompletedLevel}
                        user={user}
                        userCompletedLevel={userCompletedLevel} />}
                </Stack.Screen>

                {/* Leaderboard Screen */}
                <Stack.Screen name="Leaderboard">
                    {(props) => <LeaderboardScreen {...props} />}
                </Stack.Screen>

                {/* Settings Screen */}
                <Stack.Screen name="Settings">
                    {(props) => <SettingsScreen {...props} user={user} setUser={setUser} />}
                </Stack.Screen>

                {/* Login Screen */}
                <Stack.Screen name="Login" component={Login} />

                {/* Create Account Screen */}
                <Stack.Screen name="Create Account" component={CreateAccountScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

// Registering the root component
registerRootComponent(App);
