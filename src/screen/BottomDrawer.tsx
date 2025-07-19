import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import {RootStackParamList} from "../App";


type Props = BottomTabScreenProps<RootStackParamList, 'BottomDrawer'>;

const BottomDrawerModal = ({ navigation }: Props) => {
    return (
        <View style={styles.drawer}>
            <View style={styles.drawerIndicator} />
            <Text style={styles.drawerText}>This is the Bottom Drawer!</Text>
        </View>
    );
};

export default BottomDrawerModal;

const styles = StyleSheet.create({
    drawer: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        minHeight: 250
    },
    drawerIndicator: {
        width: 50,
        height: 5,
        backgroundColor: '#ccc',
        borderRadius: 5,
        alignSelf: 'center',
        marginBottom: 15
    },
    drawerText: {
        fontSize: 18,
        textAlign: 'center'
    }
});
