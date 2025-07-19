import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AnimatedLoaderProps {
    message?: string;
    size?: 'small' | 'medium' | 'large';
    color?: string;
}

const AnimatedLoader: React.FC<AnimatedLoaderProps> = ({ 
    message = 'Loading...', 
    size = 'medium',
    color = '#667eea'
}) => {
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const dotAnim1 = useRef(new Animated.Value(0)).current;
    const dotAnim2 = useRef(new Animated.Value(0)).current;
    const dotAnim3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Fade in animation
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();

        // Rotation animation
        const rotate = Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            })
        );

        // Pulse animation
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );

        // Dot animations
        const dot1 = Animated.loop(
            Animated.sequence([
                Animated.timing(dotAnim1, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(dotAnim1, {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ])
        );

        const dot2 = Animated.loop(
            Animated.sequence([
                Animated.delay(200),
                Animated.timing(dotAnim2, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(dotAnim2, {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ])
        );

        const dot3 = Animated.loop(
            Animated.sequence([
                Animated.delay(400),
                Animated.timing(dotAnim3, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(dotAnim3, {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ])
        );

        rotate.start();
        pulse.start();
        dot1.start();
        dot2.start();
        dot3.start();

        return () => {
            rotate.stop();
            pulse.stop();
            dot1.stop();
            dot2.stop();
            dot3.stop();
        };
    }, []);

    const rotateValue = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const getSize = () => {
        switch (size) {
            case 'small': return 24;
            case 'large': return 48;
            default: return 36;
        }
    };

    const iconSize = getSize();

    return (
        <Animated.View 
            style={[
                styles.container,
                { opacity: fadeAnim }
            ]}
        >
            <View style={styles.loaderContainer}>
                <Animated.View 
                    style={[
                        styles.iconContainer,
                        {
                            transform: [
                                { rotate: rotateValue },
                                { scale: scaleAnim }
                            ]
                        }
                    ]}
                >
                    <Ionicons 
                        name="refresh" 
                        size={iconSize} 
                        color={color} 
                    />
                </Animated.View>

                <View style={styles.messageContainer}>
                    <Text style={[styles.message, { color }]}>{message}</Text>
                    <View style={styles.dotsContainer}>
                        <Animated.View 
                            style={[
                                styles.dot,
                                { 
                                    backgroundColor: color,
                                    opacity: dotAnim1,
                                    transform: [{ scale: dotAnim1 }]
                                }
                            ]} 
                        />
                        <Animated.View 
                            style={[
                                styles.dot,
                                { 
                                    backgroundColor: color,
                                    opacity: dotAnim2,
                                    transform: [{ scale: dotAnim2 }]
                                }
                            ]} 
                        />
                        <Animated.View 
                            style={[
                                styles.dot,
                                { 
                                    backgroundColor: color,
                                    opacity: dotAnim3,
                                    transform: [{ scale: dotAnim3 }]
                                }
                            ]} 
                        />
                    </View>
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    loaderContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    iconContainer: {
        marginBottom: 15,
    },
    messageContainer: {
        alignItems: 'center',
    },
    message: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
        textAlign: 'center',
    },
    dotsContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
});

export default AnimatedLoader; 