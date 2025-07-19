import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    StyleSheet,
    Dimensions,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from '../App';
import InputField from '../Components/Input';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { login } from '../../firebase/authService';

const { width, height } = Dimensions.get('window');

// Responsive breakpoints
const isSmallScreen = width < 350;
const isMediumScreen = width >= 350 && width < 500;
const isLargeScreen = width >= 500;
const isTablet = width >= 768;

// Responsive helper functions
const responsive = {
    width: (percentage: number): number => width * (percentage / 100),
    height: (percentage: number): number => height * (percentage / 100),
    fontSize: (size: number): number => {
        if (isSmallScreen) return size * 0.85;
        if (isMediumScreen) return size;
        if (isLargeScreen) return size * 1.1;
        return size;
    },
    spacing: (size: number): number => {
        if (isSmallScreen) return size * 0.8;
        if (isTablet) return size * 1.3;
        return size;
    }
};

type WelcomeScreenNavigationProp = BottomTabNavigationProp<RootStackParamList, 'LoginPage'>;

export type data = {
    email1: string;
    password1: string;
}

function LoginPage() {
    const navigation = useNavigation<WelcomeScreenNavigationProp>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const person : data = {
        email1: email,
        password1: password
    }

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Missing Fields", "Please enter both email and password.");
            return;
        }

        const user = await login(email, password);

        if (user) {
            // Success
            console.log("User logged in:", user.email);
            setEmail("")
            setPassword("")
            navigation.navigate("MainTabs");
        } else {
            // Failure
            Alert.alert("Login Failed", "Invalid email or password.");
        }
    };

        return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.text}>Login</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <InputField
                            label="Email"
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                        />
                        <InputField
                            label="Password"
                            placeholder="Enter your password"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />

                        <TouchableOpacity style={styles.button} onPress={handleLogin}>
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>

                        <View style={styles.orDivider}>
                            <View style={styles.horizontalLine} />
                            <Text style={styles.text1}>or</Text>
                            <View style={styles.horizontalLine} />
                        </View>

                        <TouchableOpacity style={styles.buttonOutline}>
                            <AntDesign name="google" size={responsive.fontSize(24)} color="white" />
                            <Text style={styles.buttonText}>Login with Google</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.buttonOutline}>
                            <FontAwesome name="apple" size={responsive.fontSize(24)} color="white" />
                            <Text style={styles.buttonText}>Login with Apple</Text>
                        </TouchableOpacity>

                        <Text style={styles.text1}>
                            Don't have an account? <Text style={styles.link} onPress={() => navigation.navigate("RegisterPage")}>Register</Text>
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default LoginPage;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'black',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: responsive.width(isTablet ? 25 : 5),
        paddingVertical: responsive.spacing(20),
        minHeight: height,
    },
    container: {
        flex: 1,
        maxWidth: isTablet ? 400 : '100%',
        alignSelf: 'center',
        width: '100%',
        paddingBottom: responsive.spacing(20),
    },
    header: {
        marginBottom: responsive.height(isSmallScreen ? 3 : 4),
        alignItems: 'center',
    },
    text: {
        fontSize: responsive.fontSize(isSmallScreen ? 28 : isTablet ? 36 : 32),
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    text1: {
        fontSize: responsive.fontSize(isSmallScreen ? 14 : 16),
        color: 'white',
        textAlign: 'center',
        marginVertical: responsive.spacing(16),
        lineHeight: responsive.fontSize(isSmallScreen ? 20 : 22),
    },
    link: {
        color: '#6200EE',
        textDecorationLine: 'underline',
        fontWeight: '600',
    },
    formContainer: {
        gap: responsive.spacing(20),
        paddingHorizontal: isTablet ? responsive.spacing(20) : 0,
    },
    button: {
        backgroundColor: '#6200EE',
        height: responsive.spacing(isSmallScreen ? 45 : 50),
        width: '100%',
        borderRadius: responsive.spacing(8),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: responsive.spacing(10),
        shadowColor: '#6200EE',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonOutline: {
        flexDirection: 'row',
        gap: responsive.spacing(10),
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#6200EE',
        borderWidth: 1,
        height: responsive.spacing(isSmallScreen ? 45 : 50),
        width: '100%',
        borderRadius: responsive.spacing(8),
        marginTop: responsive.spacing(10),
        backgroundColor: 'rgba(98, 0, 238, 0.1)',
    },
    buttonText: {
        color: '#fff',
        fontSize: responsive.fontSize(isSmallScreen ? 14 : 16),
        fontWeight: '600',
        textAlign: 'center',
    },
    horizontalLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'white',
        opacity: 0.3,
    },
    orDivider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: responsive.spacing(15),
        gap: responsive.spacing(10),
    },
});