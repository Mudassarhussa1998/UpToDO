import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SuccessAnimationProps {
    message?: string;
    onComplete?: () => void;
    visible: boolean;
}

const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ 
    message = 'Success!', 
    onComplete,
    visible 
}) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const checkmarkAnim = useRef(new Animated.Value(0)).current;
    const confettiAnim1 = useRef(new Animated.Value(0)).current;
    const confettiAnim2 = useRef(new Animated.Value(0)).current;
    const confettiAnim3 = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            // Fade in
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();

            // Scale animation
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.2,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();

            // Checkmark animation
            Animated.timing(checkmarkAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }).start();

            // Confetti animations
            Animated.parallel([
                Animated.timing(confettiAnim1, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(confettiAnim2, {
                    toValue: 1,
                    duration: 1200,
                    useNativeDriver: true,
                }),
                Animated.timing(confettiAnim3, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ]).start();

            // Auto hide after 2 seconds
            setTimeout(() => {
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }).start(() => {
                    onComplete?.();
                });
            }, 2000);
        }
    }, [visible]);

    const checkmarkScale = checkmarkAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const confetti1TranslateY = confettiAnim1.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -100],
    });

    const confetti2TranslateY = confettiAnim2.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -80],
    });

    const confetti3TranslateY = confettiAnim3.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -120],
    });

    if (!visible) return null;

    return (
        <Animated.View 
            style={[
                styles.container,
                { opacity: fadeAnim }
            ]}
        >
            <View style={styles.overlay}>
                <Animated.View 
                    style={[
                        styles.successContainer,
                        {
                            transform: [{ scale: scaleAnim }]
                        }
                    ]}
                >
                    {/* Success icon */}
                    <Animated.View 
                        style={[
                            styles.iconContainer,
                            {
                                transform: [{ scale: checkmarkScale }]
                            }
                        ]}
                    >
                        <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
                    </Animated.View>

                    {/* Success message */}
                    <Text style={styles.message}>{message}</Text>

                    {/* Confetti effects */}
                    <Animated.View 
                        style={[
                            styles.confetti,
                            styles.confetti1,
                            {
                                transform: [
                                    { translateY: confetti1TranslateY },
                                    { rotate: '45deg' }
                                ]
                            }
                        ]} 
                    />
                    <Animated.View 
                        style={[
                            styles.confetti,
                            styles.confetti2,
                            {
                                transform: [
                                    { translateY: confetti2TranslateY },
                                    { rotate: '-30deg' }
                                ]
                            }
                        ]} 
                    />
                    <Animated.View 
                        style={[
                            styles.confetti,
                            styles.confetti3,
                            {
                                transform: [
                                    { translateY: confetti3TranslateY },
                                    { rotate: '60deg' }
                                ]
                            }
                        ]} 
                    />
                </Animated.View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    successContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 25,
        padding: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 12,
        position: 'relative',
        overflow: 'hidden',
    },
    iconContainer: {
        marginBottom: 20,
    },
    message: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    confetti: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    confetti1: {
        backgroundColor: '#FF6B6B',
        top: 20,
        left: 20,
    },
    confetti2: {
        backgroundColor: '#4ECDC4',
        top: 30,
        right: 25,
    },
    confetti3: {
        backgroundColor: '#45B7D1',
        bottom: 25,
        left: 30,
    },
});

export default SuccessAnimation; 