// components/InputField.tsx
import React, { useState, useRef } from 'react';
import { 
    TextInput, 
    StyleSheet, 
    Text, 
    View, 
    TextInputProps, 
    StyleProp, 
    ViewStyle, 
    TextStyle,
    Animated,
    TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputFieldProps extends TextInputProps {
    label?: string;
    containerStyle?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<TextStyle>;
    labelStyle?: StyleProp<TextStyle>;
    icon?: string;
    onIconPress?: () => void;
    error?: string;
    success?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ 
    label, 
    containerStyle, 
    inputStyle, 
    labelStyle,
    icon,
    onIconPress,
    error,
    success,
    onFocus,
    onBlur,
    ...props 
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);
    
    // Animation values
    const focusAnim = useRef(new Animated.Value(0)).current;
    const labelAnim = useRef(new Animated.Value(props.value ? 1 : 0)).current;
    const shakeAnim = useRef(new Animated.Value(0)).current;

    const handleFocus = (e: any) => {
        setIsFocused(true);
        Animated.parallel([
            Animated.timing(focusAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(labelAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();
        onFocus?.(e);
    };

    const handleBlur = (e: any) => {
        setIsFocused(false);
        if (!props.value) {
            Animated.timing(labelAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
        Animated.timing(focusAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
        onBlur?.(e);
    };

    const handleChangeText = (text: string) => {
        setHasValue(text.length > 0);
        props.onChangeText?.(text);
    };

    // Shake animation for error
    React.useEffect(() => {
        if (error) {
            Animated.sequence([
                Animated.timing(shakeAnim, {
                    toValue: 10,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(shakeAnim, {
                    toValue: -10,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(shakeAnim, {
                    toValue: 10,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(shakeAnim, {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [error]);

    const borderColor = focusAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [
            error ? '#ff6b6b' : 'rgba(255, 255, 255, 0.3)',
            success ? '#4CAF50' : '#667eea'
        ],
    });

    const labelTranslateY = labelAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -25],
    });

    const labelScale = labelAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.85],
    });

    return (
        <Animated.View 
            style={[
                styles.wrapper, 
                containerStyle,
                { transform: [{ translateX: shakeAnim }] }
            ]}
        >
            {label && (
                <Animated.Text 
                    style={[
                        styles.label, 
                        labelStyle,
                        {
                            transform: [
                                { translateY: labelTranslateY },
                                { scale: labelScale }
                            ],
                            color: isFocused 
                                ? (success ? '#4CAF50' : '#667eea')
                                : error 
                                    ? '#ff6b6b' 
                                    : 'rgba(255, 255, 255, 0.8)'
                        }
                    ]}
                >
                    {label}
                </Animated.Text>
            )}
            
            <View style={styles.inputContainer}>
                <Animated.View 
                    style={[
                        styles.inputWrapper,
                        {
                            borderColor: borderColor,
                            backgroundColor: isFocused 
                                ? 'rgba(255, 255, 255, 0.15)' 
                                : 'rgba(255, 255, 255, 0.1)',
                        }
                    ]}
                >
                    <TextInput
                        style={[styles.input, inputStyle]}
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onChangeText={handleChangeText}
                        {...props}
                    />
                    
                    {icon && (
                        <TouchableOpacity 
                            style={styles.iconContainer}
                            onPress={onIconPress}
                            activeOpacity={0.7}
                        >
                            <Ionicons 
                                name={icon as any} 
                                size={20} 
                                color={isFocused ? '#667eea' : 'rgba(255, 255, 255, 0.6)'} 
                            />
                        </TouchableOpacity>
                    )}
                    
                    {success && (
                        <View style={styles.successIcon}>
                            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                        </View>
                    )}
                    
                    {error && (
                        <View style={styles.errorIcon}>
                            <Ionicons name="alert-circle" size={20} color="#ff6b6b" />
                        </View>
                    )}
                </Animated.View>
            </View>
            
            {error && (
                <Animated.Text 
                    style={[styles.errorText, { opacity: focusAnim }]}
                >
                    {error}
                </Animated.Text>
            )}
        </Animated.View>
    );
};

export default InputField;

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: 20,
    },
    label: {
        marginBottom: 8,
        fontSize: 16,
        fontWeight: '600',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
    },
    inputContainer: {
        position: 'relative',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        minHeight: 48,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    input: {
        flex: 1,
        color: 'white',
        fontSize: 16,
        paddingVertical: 0,
    },
    iconContainer: {
        marginLeft: 12,
        padding: 4,
    },
    successIcon: {
        marginLeft: 12,
    },
    errorIcon: {
        marginLeft: 12,
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
        fontWeight: '500',
    },
});
