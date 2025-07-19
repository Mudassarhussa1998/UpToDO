import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface AnimatedBackgroundProps {
    children: React.ReactNode;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ children }) => {
    const floatAnim1 = useRef(new Animated.Value(0)).current;
    const floatAnim2 = useRef(new Animated.Value(0)).current;
    const floatAnim3 = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Floating animation for orb 1
        const float1 = Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim1, {
                    toValue: 1,
                    duration: 4000,
                    useNativeDriver: true,
                }),
                Animated.timing(floatAnim1, {
                    toValue: 0,
                    duration: 4000,
                    useNativeDriver: true,
                }),
            ])
        );

        // Floating animation for orb 2
        const float2 = Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim2, {
                    toValue: 1,
                    duration: 6000,
                    useNativeDriver: true,
                }),
                Animated.timing(floatAnim2, {
                    toValue: 0,
                    duration: 6000,
                    useNativeDriver: true,
                }),
            ])
        );

        // Floating animation for orb 3
        const float3 = Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim3, {
                    toValue: 1,
                    duration: 5000,
                    useNativeDriver: true,
                }),
                Animated.timing(floatAnim3, {
                    toValue: 0,
                    duration: 5000,
                    useNativeDriver: true,
                }),
            ])
        );

        // Rotation animation
        const rotate = Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 20000,
                useNativeDriver: true,
            })
        );

        // Pulse animation
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        );

        float1.start();
        float2.start();
        float3.start();
        rotate.start();
        pulse.start();

        return () => {
            float1.stop();
            float2.stop();
            float3.stop();
            rotate.stop();
            pulse.stop();
        };
    }, []);

    const translateY1 = floatAnim1.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -30],
    });

    const translateY2 = floatAnim2.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 40],
    });

    const translateY3 = floatAnim3.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -20],
    });

    const rotateValue = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            {/* Main gradient background */}
            <LinearGradient
                colors={['#667eea', '#764ba2', '#f093fb', '#f5576c']}
                style={styles.backgroundGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                {/* Animated floating orbs */}
                <Animated.View 
                    style={[
                        styles.floatingOrb,
                        styles.orb1,
                        {
                            transform: [
                                { translateY: translateY1 },
                                { scale: pulseAnim }
                            ],
                            opacity: floatAnim1
                        }
                    ]} 
                />
                
                <Animated.View 
                    style={[
                        styles.floatingOrb,
                        styles.orb2,
                        {
                            transform: [
                                { translateY: translateY2 },
                                { rotate: rotateValue }
                            ],
                            opacity: floatAnim2
                        }
                    ]} 
                />
                
                <Animated.View 
                    style={[
                        styles.floatingOrb,
                        styles.orb3,
                        {
                            transform: [
                                { translateY: translateY3 },
                                { scale: pulseAnim }
                            ],
                            opacity: floatAnim3
                        }
                    ]} 
                />

                {/* Particle effects */}
                <Animated.View 
                    style={[
                        styles.particle,
                        styles.particle1,
                        {
                            transform: [
                                { translateY: translateY1 },
                                { rotate: rotateValue }
                            ]
                        }
                    ]} 
                />
                
                <Animated.View 
                    style={[
                        styles.particle,
                        styles.particle2,
                        {
                            transform: [
                                { translateY: translateY2 },
                                { rotate: rotateValue }
                            ]
                        }
                    ]} 
                />

                {/* Glow effects */}
                <Animated.View 
                    style={[
                        styles.glowEffect,
                        styles.glow1,
                        {
                            transform: [
                                { scale: pulseAnim },
                                { rotate: rotateValue }
                            ]
                        }
                    ]} 
                />
                
                <Animated.View 
                    style={[
                        styles.glowEffect,
                        styles.glow2,
                        {
                            transform: [
                                { scale: pulseAnim },
                                { rotate: rotateValue }
                            ]
                        }
                    ]} 
                />
            </LinearGradient>

            {/* Content overlay */}
            <View style={styles.contentOverlay}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    floatingOrb: {
        position: 'absolute',
        borderRadius: 100,
    },
    orb1: {
        width: 120,
        height: 120,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        top: height * 0.1,
        right: width * 0.1,
    },
    orb2: {
        width: 80,
        height: 80,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        bottom: height * 0.2,
        left: width * 0.05,
    },
    orb3: {
        width: 60,
        height: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        top: height * 0.6,
        right: width * 0.2,
    },
    particle: {
        position: 'absolute',
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    particle1: {
        top: height * 0.3,
        left: width * 0.3,
    },
    particle2: {
        top: height * 0.7,
        right: width * 0.4,
    },
    glowEffect: {
        position: 'absolute',
        borderRadius: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    glow1: {
        width: 200,
        height: 200,
        top: height * 0.4,
        left: width * 0.1,
    },
    glow2: {
        width: 150,
        height: 150,
        bottom: height * 0.3,
        right: width * 0.15,
    },
    contentOverlay: {
        flex: 1,
        zIndex: 1,
    },
});

export default AnimatedBackground; 