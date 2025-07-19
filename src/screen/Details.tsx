import {Button, StyleSheet, Text, View, Animated, Easing , Alert} from "react-native";
import React, { useEffect, useRef } from "react";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { RootStackParamList} from "../App";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/fireabaseConfig"; // Adjust path as needed

type Props = BottomTabScreenProps<RootStackParamList, 'Details'>;

export default function Details({ navigation }: Props) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Fade in animation
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();

        // Scale animation
        Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.bounce,
            useNativeDriver: true,
        }).start();

        // Continuous rotation animation
        const rotateAnimation = Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 4000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );
        rotateAnimation.start();

        // Pulse animation
        const pulseAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );
        pulseAnimation.start();

        return () => {
            rotateAnimation.stop();
            pulseAnimation.stop();
        };
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Welcome' }],
            });
        } catch (err) {
            Alert.alert('Logout Error', 'Failed to log out');
        }
    };

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            {/* Animated Background Elements */}
            <Animated.View style={[styles.backgroundCircle, styles.circle1, {
                opacity: fadeAnim,
                transform: [{ rotate: spin }]
            }]} />
            <Animated.View style={[styles.backgroundCircle, styles.circle2, {
                opacity: fadeAnim,
                transform: [{ rotate: spin }, { scale: pulseAnim }]
            }]} />
            <Animated.View style={[styles.backgroundCircle, styles.circle3, {
                opacity: fadeAnim,
                transform: [{ rotate: spin }]
            }]} />

            {/* Main Content */}
            <Animated.View style={[styles.content, {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
            }]}>
                <Animated.View style={[styles.logoContainer, {
                    transform: [{ scale: pulseAnim }]
                }]}>
                    <Text style={styles.logo}>✨</Text>
                </Animated.View>

                <Text style={styles.welcomeText}>Thanks</Text>
                <Text style={styles.subtitle}>Ready to explore?</Text>
            </Animated.View>

            {/* Logout Button */}
            <Animated.View style={[styles.buttonContainer, {
                opacity: fadeAnim,
                transform: [{ translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0]
                    }) }]
            }]}>
                <Button
                    title="Logout"
                    onPress={handleLogout}
                    color="#FF6B6B"
                />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#0A0A0A',
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        position: 'relative',
    },
    backgroundCircle: {
        position: 'absolute',
        borderRadius: 100,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    circle1: {
        width: 200,
        height: 200,
        top: '20%',
        right: '10%',
        borderColor: 'rgba(100, 200, 255, 0.2)',
    },
    circle2: {
        width: 150,
        height: 150,
        bottom: '30%',
        left: '10%',
        borderColor: 'rgba(255, 100, 200, 0.2)',
    },
    circle3: {
        width: 100,
        height: 100,
        top: '60%',
        right: '20%',
        borderColor: 'rgba(200, 255, 100, 0.2)',
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    logo: {
        fontSize: 50,
        textAlign: 'center',
    },
    welcomeText: {
        fontSize: 32,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'center',
        marginBottom: 40,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 80,
        width: '80%',
        borderRadius: 25,
        overflow: 'hidden',
    },
});