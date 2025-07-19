import React, { useEffect } from 'react';
import { View, Text, StyleSheet,  TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStackParamList} from '../App'; // Make sure this points to where RootTabParamList is defined
import LoginPage from './LoginPage';

type WelcomeScreenNavigationProp = BottomTabNavigationProp<RootStackParamList, 'Login'>;

function Login() {
    const navigation = useNavigation<WelcomeScreenNavigationProp>();
    const navigations =useNavigation()
    return (
        <View style={styles.container}>
            <View style={styles.inner}>
                <Text style={styles.text}>
                    Welcome to UpTodo
                </Text>
                <Text style={styles.smalltext}>
                    Please login to your account or create new account to continue
                </Text>
            </View>
            <View>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LoginPage')}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('RegisterPage')}>
                    <Text style={styles.buttonText}>CREATE AN ACCOUNT</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default Login;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical:100
    },
    inner: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    backgroundImage: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
    },
    text: {
        fontSize: 28,
        color: 'white',
        fontWeight: 'bold',
        marginTop: 20,
    },
    smalltext:{
        color: 'white',
        width:300,
        textAlign: 'center',
        marginTop: 15,
    },
    button: {
        backgroundColor: '#6200EE',
        textAlign: 'center',
        justifyContent: 'center',
        height: 50,
        width: 350,
        borderRadius: 8,
        alignItems: 'center',
        margin:10,
    },
    button2: {
        backgroundColor: 'transparent',
        borderColor: '#6200EE',
        borderWidth: 1,
        textAlign: 'center',
        justifyContent: 'center',
        height: 50,
        width: 350,
        borderRadius: 8,
        alignItems: 'center',
        margin:10
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});
