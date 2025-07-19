import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Animated, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface FloatingActionButtonProps {
    onPress: () => void;
    icon: string;
    size?: number;
    colors?: string[];
    disabled?: boolean;
    loading?: boolean;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
    onPress,
    icon,
    size = 60,
    colors = ['#ff6b6b', '#ee5a24'],
    disabled = false,
    loading = false
}) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const rippleAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Pulse animation
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        );

        // Rotation animation for loading state
        const rotate = Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            })
        );

        pulse.start();
        if (loading) {
            rotate.start();
        } else {
            rotate.stop();
        }

        return () => {
            pulse.stop();
            rotate.stop();
        };
    }, [loading]);

    const handlePressIn = () => {
        if (disabled) return;
        
        Animated.parallel([
            Animated.timing(scaleAnim, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(rippleAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handlePressOut = () => {
        if (disabled) return;
        
        Animated.parallel([
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(rippleAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handlePress = () => {
        if (disabled) return;
        onPress();
    };

    const rippleScale = rippleAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 2],
    });

    const rippleOpacity = rippleAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.5, 0],
    });

    const rotateValue = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            {/* Ripple effect */}
            <Animated.View
                style={[
                    styles.ripple,
                    {
                        transform: [{ scale: rippleScale }],
                        opacity: rippleOpacity,
                    },
                ]}
            />
            
            {/* Main button */}
            <Animated.View
                style={[
                    styles.buttonContainer,
                    {
                        transform: [
                            { scale: Animated.multiply(scaleAnim, pulseAnim) },
                        ],
                    },
                ]}
            >
                <TouchableOpacity
                    style={[
                        styles.button,
                        {
                            width: size,
                            height: size,
                            borderRadius: size / 2,
                            opacity: disabled ? 0.5 : 1,
                        },
                    ]}
                    onPress={handlePress}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    disabled={disabled}
                    activeOpacity={1}
                >
                    <LinearGradient
                        colors={disabled ? ['#666', '#666'] : colors as any}
                        style={[
                            styles.gradient,
                            {
                                width: size,
                                height: size,
                                borderRadius: size / 2,
                            },
                        ]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Animated.View
                            style={[
                                styles.iconContainer,
                                {
                                    transform: [
                                        { rotate: loading ? rotateValue : '0deg' },
                                    ],
                                },
                            ]}
                        >
                            <Ionicons
                                name={loading ? 'refresh' : (icon as any)}
                                size={size * 0.4}
                                color="white"
                            />
                        </Animated.View>
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    ripple: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    buttonContainer: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 10,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    gradient: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default FloatingActionButton; 