import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView,
    SafeAreaView,
    Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import InputField from '../Components/Input';
import { signUp } from '../../firebase/authService';
import { AntDesign, FontAwesome } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const isSmallScreen = width < 350;
const isTablet = width >= 768;

const responsive = {
    width: (percentage: number): number => width * (percentage / 100),
    height: (percentage: number): number => height * (percentage / 100),
    fontSize: (size: number): number => {
        if (isSmallScreen) return size * 0.85;
        if (isTablet) return size * 1.1;
        return size;
    },
    spacing: (size: number): number => {
        if (isSmallScreen) return size * 0.85;
        if (isTablet) return size * 1.3;
        return size;
    }
};

type RegisterScreenNavigationProp = BottomTabNavigationProp<RootStackParamList, 'LoginPage'>;

const RegisterPage = () => {
    const navigation = useNavigation<RegisterScreenNavigationProp>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async () => {
        if (!email || !password) {
            Alert.alert("Missing Fields", "Please enter both email and password.");
            return;
        }

        const user = await signUp(email, password);

        if (user) {
            Alert.alert("Success", "Account created successfully!");
            navigation.navigate('LoginPage');
        } else {
            Alert.alert("Error", "Failed to create account.");
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
                        <Text style={styles.title}>Create Account</Text>
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

                        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                            <Text style={styles.buttonText}>Sign Up</Text>
                        </TouchableOpacity>

                        <View style={styles.orDivider}>
                            <View style={styles.horizontalLine} />
                            <Text style={styles.orText}>or</Text>
                            <View style={styles.horizontalLine} />
                        </View>

                        <TouchableOpacity style={styles.buttonOutline}>
                            <AntDesign name="google" size={responsive.fontSize(24)} color="white" />
                            <Text style={styles.buttonText}>Sign up with Google</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.buttonOutline}>
                            <FontAwesome name="apple" size={responsive.fontSize(24)} color="white" />
                            <Text style={styles.buttonText}>Sign up with Apple</Text>
                        </TouchableOpacity>

                        <Text style={styles.footerText}>
                            Already have an account?{" "}
                            <Text style={styles.link} onPress={() => navigation.navigate("LoginPage")}>
                                Login
                            </Text>
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default RegisterPage;

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
        marginBottom: responsive.height(4),
        alignItems: 'center',
    },
    title: {
        fontSize: responsive.fontSize(32),
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    formContainer: {
        gap: responsive.spacing(20),
        paddingHorizontal: isTablet ? responsive.spacing(20) : 0,
    },
    button: {
        backgroundColor: '#6200EE',
        height: responsive.spacing(50),
        width: '100%',
        borderRadius: responsive.spacing(8),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: responsive.spacing(10),
        shadowColor: '#6200EE',
        shadowOffset: { width: 0, height: 2 },
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
        height: responsive.spacing(50),
        width: '100%',
        borderRadius: responsive.spacing(8),
        marginTop: responsive.spacing(10),
        backgroundColor: 'rgba(98, 0, 238, 0.1)',
    },
    buttonText: {
        color: '#fff',
        fontSize: responsive.fontSize(16),
        fontWeight: '600',
        textAlign: 'center',
    },
    orDivider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: responsive.spacing(15),
        gap: responsive.spacing(10),
    },
    horizontalLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'white',
        opacity: 0.3,
    },
    orText: {
        color: 'white',
        fontSize: responsive.fontSize(14),
    },
    footerText: {
        fontSize: responsive.fontSize(14),
        color: 'white',
        textAlign: 'center',
        marginVertical: responsive.spacing(20),
    },
    link: {
        color: '#6200EE',
        textDecorationLine: 'underline',
        fontWeight: '600',
    },
});
