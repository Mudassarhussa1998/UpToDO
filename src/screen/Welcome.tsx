import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from '../App'; // Adjust path as needed

type WelcomeScreenNavigationProp = BottomTabNavigationProp<RootStackParamList, 'Welcome'>;

function Welcome() {
    const navigation = useNavigation<WelcomeScreenNavigationProp>();

    useFocusEffect(
        useCallback(() => {
            const timer = setTimeout(() => {
                navigation.navigate('Login');
            }, 3000);

            return () => clearTimeout(timer);
        }, [navigation])
    );

    return (
        <View style={styles.container}>
            <View style={styles.inner}>
                <Image
                    source={require('../../assets/welcomepg.png')}
                    style={styles.backgroundImage}
                />
            </View>
            <View>
                <Text style={styles.text}>UpToDo</Text>
            </View>
        </View>
    );
}

export default Welcome;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
});
