import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/fireabaseConfig';
import RegisterPage from "./screen/RegisterPage";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Dimensions,
    PixelRatio,
    ImageBackground,
    Animated,
    Easing,
    StatusBar,
    Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import Home from './screen/Home';
import Details from './screen/Details';
import Welcome from './screen/Welcome';
import Login from './screen/Login';
import LoginPage from './screen/LoginPage';

import { AuthProvider } from '../context/AuthProvider';
import { TodoProvider } from '../context/TodoProvider';
import InputField from './Components/Input';
import AnimatedBackground from './Components/AnimatedBackground';
import AnimatedLoader from './Components/AnimatedLoader';
import SuccessAnimation from './Components/SuccessAnimation';
import FloatingActionButton from './Components/FloatingActionButton';

const { width, height } = Dimensions.get('window');

const wp = (percentage: number): number => Math.round(PixelRatio.roundToNearestPixel((percentage * width) / 100));
const hp = (percentage: number): number => Math.round(PixelRatio.roundToNearestPixel((percentage * height) / 100));
const responsiveFont = (size: number): number => Math.max(12, Math.min(size * (width / 375), 30));

export type RootStackParamList = {
    MainTabs: undefined;
    LoginPage: undefined;
    Login: undefined;
    Welcome: undefined;
    Details: { ProductId: string };
    Home: undefined;
    BottomDrawer: undefined;
    RegisterPage: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

const DummyScreen = () => null;

function MainTabs() {
    const [isDrawerVisible, setIsDrawerVisible] = React.useState(false);
    const [Task, setTask] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [showSuccess, setShowSuccess] = React.useState(false);
    
    // Animation values
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const slideAnim = React.useRef(new Animated.Value(0)).current;
    const scaleAnim = React.useRef(new Animated.Value(0)).current;
    const rotateAnim = React.useRef(new Animated.Value(0)).current;

    const toggleDrawer = () => {
        if (isDrawerVisible) {
            // Close animation
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => setIsDrawerVisible(false));
        } else {
            setIsDrawerVisible(true);
            // Open animation
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    };



    const handleTask = async () => {
        const user = auth.currentUser;

        if (!user) {
            Alert.alert('Error', 'You must be logged in to add tasks.');
            return;
        }

        if (!Task.trim()) {
            Alert.alert('Error', 'Please enter a task title.');
            return;
        }

        setIsLoading(true);
        
        // Success animation
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

        try {
            console.log('Adding task:', Task, 'for user:', user.uid);
            
            await addDoc(collection(db, 'tasks'), {
                title: Task.trim(),
                userId: user.uid,
                createdAt: Timestamp.now(),
                completed: false,
            });

            // Success feedback animation
            Animated.sequence([
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(rotateAnim, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                }),
            ]).start();

            setShowSuccess(true);
            setTask('');
            toggleDrawer();
        } catch (error: any) {
            console.error("Error adding task:", error);
            
            if (error.code === 'permission-denied') {
                Alert.alert('Permission Error', 'You do not have permission to add tasks. Please check your Firebase security rules.');
            } else if (error.code === 'unavailable') {
                Alert.alert('Network Error', 'Unable to connect to Firebase. Please check your internet connection.');
            } else {
                Alert.alert('Error', `Failed to add task: ${error.message || 'Unknown error'}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <AnimatedBackground>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            <Tab.Navigator
                screenOptions={{
                    tabBarStyle: styles.tabBar,
                    tabBarActiveTintColor: '#fff',
                    tabBarInactiveTintColor: 'rgba(255,255,255,0.6)',
                    headerShown: false,
                }}
            >
                <Tab.Screen
                    name="Home"
                    component={Home}
                    options={{
                        tabBarIcon: ({ color, focused }) => (
                            <Animated.View style={[
                                styles.tabIconContainer,
                                focused && { transform: [{ scale: 1.2 }] }
                            ]}>
                                <Ionicons name="home" size={24} color={color} />
                            </Animated.View>
                        ),
                    }}
                />
                <Tab.Screen
                    name="BottomDrawer"
                    component={DummyScreen}
                    listeners={{
                        tabPress: e => {
                            e.preventDefault();
                            toggleDrawer();
                        },
                    }}
                    options={{
                        tabBarIcon: ({ color }) => (
                            <FloatingActionButton
                                onPress={toggleDrawer}
                                icon="add"
                                size={60}
                                colors={['#ff6b6b', '#ee5a24']}
                                loading={false}
                            />
                        ),
                        
                        tabBarLabel: '',
                    }}
                />
                <Tab.Screen
                    name="Details"
                    component={Details}
                    options={{
                        tabBarIcon: ({ color, focused }) => (
                            <Animated.View style={[
                                styles.tabIconContainer,
                                focused && { transform: [{ scale: 1.2 }] }
                            ]}>
                                <Ionicons name="person" size={24} color={color} />
                            </Animated.View>
                        ),
                        tabBarLabel: 'Logout',
                    }}
                />
            </Tab.Navigator>

            {/* Enhanced Bottom Drawer */}
            <Modal
                isVisible={isDrawerVisible}
                onBackdropPress={toggleDrawer}
                backdropOpacity={0.7}
                style={styles.modal}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                animationInTiming={400}
                animationOutTiming={300}
            >
                <Animated.View 
                    style={[
                        styles.drawer,
                        {
                            transform: [
                                {
                                    translateY: slideAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [300, 0],
                                    }),
                                },
                            ],
                            opacity: fadeAnim,
                        },
                    ]}
                >
                    {/* Enhanced Handle */}
                    <View style={styles.drawerHandleContainer}>
                        <View style={styles.drawerHandle} />
                    </View>
                    
                    {/* Enhanced Header */}
                    <View style={styles.drawerHeader}>
                        <Animated.View style={[styles.headerIcon, { transform: [{ rotate: spin }] }]}>
                            <Ionicons name="checkmark-circle" size={40} color="#4CAF50" />
                        </Animated.View>
                        <Text style={styles.drawerTitle}>Create New Task</Text>
                        <Text style={styles.drawerSubtitle}>Stay organized and boost your productivity</Text>
                    </View>

                    {/* Enhanced Input Section */}
                    <View style={styles.inputSection}>
                        <Text style={styles.inputLabel}>Task Title</Text>
                        <View style={styles.inputContainer}>
                            <InputField 
                                placeholder="What needs to be done?"
                                onChangeText={setTask} 
                                value={Task}
                                inputStyle={styles.taskInput}
                                multiline={false}
                                maxLength={100}
                            />
                            <Animated.View style={[styles.inputIcon, { transform: [{ scale: scaleAnim }] }]}>
                                <Ionicons name="create-outline" size={20} color="#667eea" />
                            </Animated.View>
                        </View>
                        <Text style={styles.characterCount}>{Task.length}/100</Text>
                    </View>

                    {/* Enhanced Action Buttons */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity 
                            style={styles.cancelButton} 
                            onPress={toggleDrawer}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={[
                                styles.addButton,
                                !Task.trim() && styles.disabledButton
                            ]} 
                            onPress={handleTask}
                            disabled={!Task.trim() || isLoading}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={Task.trim() ? ['#667eea', '#764ba2'] : ['#666', '#666']}
                                style={styles.addButtonInnerGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                {isLoading ? (
                                    <Animated.View style={{ transform: [{ rotate: spin }] }}>
                                        <Ionicons name="refresh" size={20} color="white" />
                                    </Animated.View>
                                ) : (
                                    <Ionicons name="add-circle" size={20} color="white" />
                                )}
                                <Text style={styles.addButtonText}>
                                    {isLoading ? 'Adding...' : 'Add Task'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* Enhanced Quick Add Suggestions */}
                    <View style={styles.suggestionsContainer}>
                        <Text style={styles.suggestionsTitle}>Quick Add</Text>
                        <View style={styles.suggestionsRow}>
                            {[
                                { text: 'Buy groceries', icon: 'cart-outline' },
                                { text: 'Call mom', icon: 'call-outline' },
                                { text: 'Exercise', icon: 'fitness-outline' },
                                { text: 'Read book', icon: 'book-outline' }
                            ].map((suggestion, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.suggestionChip}
                                    onPress={() => setTask(suggestion.text)}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name={suggestion.icon as any} size={16} color="#667eea" />
                                    <Text style={styles.suggestionText}>{suggestion.text}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </Animated.View>
            </Modal>

            {/* Success Animation */}
            <SuccessAnimation 
                visible={showSuccess}
                message="Task added successfully!"
                onComplete={() => setShowSuccess(false)}
            />
        </AnimatedBackground>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <TodoProvider>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="LoginPage" component={LoginPage} />
                        <Stack.Screen name="MainTabs" component={MainTabs} />
                        <Stack.Screen name="Login" component={Login} />
                        <Stack.Screen name="Welcome" component={Welcome} />
                        <Stack.Screen name="Details" component={Details} />
                        <Stack.Screen name="Home" component={Home} />
                        <Stack.Screen name="RegisterPage" component={RegisterPage} />
                    </Stack.Navigator>
                </NavigationContainer>
            </TodoProvider>
        </AuthProvider>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderTopWidth: 0,
        height: 80,
        paddingBottom: 10,
        paddingTop: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
    tabIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    drawer: {
        backgroundColor: 'rgba(26, 26, 26, 0.95)',
        padding: wp(5),
        borderTopLeftRadius: wp(8),
        borderTopRightRadius: wp(8),
        minHeight: hp(50),
        maxHeight: hp(85),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -8,
        },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 20,
    },
    drawerHandleContainer: {
        alignItems: 'center',
        marginBottom: hp(3),
    },
    drawerHandle: {
        width: wp(15),
        height: hp(0.5),
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: wp(0.8),
    },
    drawerHeader: {
        marginBottom: hp(4),
        alignItems: 'center',
    },
    headerIcon: {
        marginBottom: hp(2),
    },
    drawerTitle: {
        fontSize: responsiveFont(26),
        fontWeight: 'bold',
        color: 'white',
        marginBottom: hp(1),
        textAlign: 'center',
    },
    drawerSubtitle: {
        fontSize: responsiveFont(15),
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'center',
        lineHeight: responsiveFont(15) * 1.5,
    },
    inputSection: {
        marginBottom: hp(4),
    },
    inputLabel: {
        fontSize: responsiveFont(17),
        color: 'white',
        marginBottom: hp(1.5),
        fontWeight: '600',
    },
    inputContainer: {
        position: 'relative',
    },
    taskInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: wp(4),
        padding: wp(4),
        paddingRight: wp(12),
        fontSize: responsiveFont(16),
        color: 'white',
        minHeight: hp(7),
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    inputIcon: {
        position: 'absolute',
        right: wp(4),
        top: hp(2.5),
    },
    characterCount: {
        fontSize: responsiveFont(12),
        color: 'rgba(255, 255, 255, 0.5)',
        alignSelf: 'flex-end',
        marginTop: hp(1),
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: wp(3),
        marginBottom: hp(3),
    },
    cancelButton: {
        flex: 1,
        borderRadius: wp(4),
        paddingVertical: hp(2),
        paddingHorizontal: wp(4),
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButtonText: {
        color: 'white',
        fontSize: responsiveFont(16),
        fontWeight: '600',
    },
    addButton: {
        flex: 2,
        borderRadius: wp(4),
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    addButtonInnerGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: hp(2),
        paddingHorizontal: wp(4),
        gap: wp(1),
    },
    addButtonText: {
        color: 'white',
        fontSize: responsiveFont(16),
        fontWeight: '600',
    },
    disabledButton: {
        opacity: 0.5,
    },
    suggestionsContainer: {
        marginTop: hp(2),
    },
    suggestionsTitle: {
        fontSize: responsiveFont(15),
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: hp(2),
        fontWeight: '600',
    },
    suggestionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: wp(2.5),
    },
    suggestionChip: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: wp(6),
        paddingVertical: hp(1),
        paddingHorizontal: wp(3),
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(1),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    suggestionText: {
        fontSize: responsiveFont(13),
        color: 'white',
        fontWeight: '500',
    },
});
