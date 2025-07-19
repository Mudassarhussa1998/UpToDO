import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
    TextInput,
    StatusBar,
    Dimensions,
    Animated,
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from '../App';
import { auth, db } from '../../firebase/fireabaseConfig';
import {
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    updateDoc,
    where,
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import Modal from 'react-native-modal';
import { LinearGradient } from 'expo-linear-gradient';

type Props = BottomTabScreenProps<RootStackParamList, 'Home'>;

type Task = {
    id: string;
    title: string;
    userId: string;
};

const { width, height } = Dimensions.get('window');

const Home = ({ navigation }: Props) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [updatedTitle, setUpdatedTitle] = useState('');
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    const user = auth.currentUser;

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, 'tasks'),
            where('userId', '==', user.uid)
        );

        const unsubscribe = onSnapshot(q, snapshot => {
            const userTasks = snapshot.docs.map(doc => ({
                ...(doc.data() as Omit<Task, 'id'>),
                id: doc.id,
            }));
            setTasks(userTasks);
        });

        return () => unsubscribe();
    }, [user]);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const deleteTask = async (taskId: string) => {
        try {
            await deleteDoc(doc(db, 'tasks', taskId));
        } catch (err) {
            console.error('Delete failed:', err);
        }
    };

    const openEditModal = (task: Task) => {
        setSelectedTask(task);
        setUpdatedTitle(task.title);
        setIsEditModalVisible(true);
    };

    const handleUpdateTask = async () => {
        if (!selectedTask) return;

        try {
            await updateDoc(doc(db, 'tasks', selectedTask.id), {
                title: updatedTitle,
            });
            setIsEditModalVisible(false);
            setSelectedTask(null);
        } catch (err) {
            console.error('Update failed:', err);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigation.reset({
                index: 0,
                routes: [{ name: 'LoginPage' }],
            });
        } catch (err) {
            Alert.alert('Logout Error', 'Failed to log out');
        }
    };

    const renderTaskItem = ({ item, index }: { item: Task; index: number }) => (
        <Animated.View
            style={[
                styles.taskItem,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                },
            ]}
        >
            <LinearGradient
                colors={['#2C3E50', '#34495E']}
                style={styles.taskGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.taskContent}>
                    <Text style={styles.taskTitle}>{item.title}</Text>
                    <View style={styles.actions}>
                        <TouchableOpacity 
                            style={styles.actionButton}
                            onPress={() => openEditModal(item)}
                        >
                            <LinearGradient
                                colors={['#4CAF50', '#45a049']}
                                style={styles.editGradient}
                            >
                                <Text style={styles.actionText}>Edit</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.actionButton}
                            onPress={() => deleteTask(item.id)}
                        >
                            <LinearGradient
                                colors={['#E74C3C', '#C0392B']}
                                style={styles.deleteGradient}
                            >
                                <Text style={styles.actionText}>Delete</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>
        </Animated.View>
    );

    return (
        <LinearGradient
            colors={['#0F0F23', '#1a1a2e', '#16213e']}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            
            <View style={styles.headerContainer}>
                <LinearGradient
                    colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                    style={styles.headerGradient}
                >
                    <View style={styles.headerRow}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.heading}>Your Notes</Text>
                            <Text style={styles.subheading}>
                                {tasks.length} {tasks.length === 1 ? 'note' : 'notes'}
                            </Text>
                        </View>
                    </View>
                </LinearGradient>
            </View>

            {tasks.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIcon}>
                        <Text style={styles.emptyIconText}>📝</Text>
                    </View>
                    <Text style={styles.emptyTitle}>No notes yet</Text>
                    <Text style={styles.emptySubtitle}>
                        Create your first note to get started
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={tasks}
                    keyExtractor={item => item.id}
                    renderItem={renderTaskItem}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContainer}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
            )}

            {/* Edit Task Modal */}
            <Modal 
                isVisible={isEditModalVisible} 
                onBackdropPress={() => setIsEditModalVisible(false)}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                backdropOpacity={0.7}
            >
                <LinearGradient
                    colors={['#2C3E50', '#34495E']}
                    style={styles.modalContainer}
                >
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Edit Note</Text>
                        <TouchableOpacity 
                            onPress={() => setIsEditModalVisible(false)}
                            style={styles.closeButton}
                        >
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <TextInput
                        value={updatedTitle}
                        onChangeText={setUpdatedTitle}
                        style={styles.input}
                        placeholder="Update your note"
                        placeholderTextColor="#8a8a8a"
                        multiline
                        numberOfLines={3}
                    />
                    
                    <View style={styles.modalActions}>
                        <TouchableOpacity 
                            style={styles.cancelButton}
                            onPress={() => setIsEditModalVisible(false)}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={styles.saveButton}
                            onPress={handleUpdateTask}
                        >
                            <LinearGradient
                                colors={['#4CAF50', '#45a049']}
                                style={styles.saveGradient}
                            >
                                <Text style={styles.saveText}>Save Changes</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </Modal>
        </LinearGradient>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    headerGradient: {
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleContainer: {
        flex: 1,
    },
    heading: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subheading: {
        color: '#8a8a8a',
        fontSize: 14,
        fontWeight: '500',
    },
    logoutButton: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    logoutGradient: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
    },
    logoutText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyIconText: {
        fontSize: 40,
    },
    emptyTitle: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtitle: {
        color: '#8a8a8a',
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    taskItem: {
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    taskGradient: {
        borderRadius: 16,
        padding: 1,
    },
    taskContent: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 15,
        padding: 20,
    },
    taskTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        lineHeight: 24,
        marginBottom: 16,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    actionButton: {
        borderRadius: 8,
        overflow: 'hidden',
    },
    editGradient: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    deleteGradient: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    actionText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    separator: {
        height: 8,
    },
    modalContainer: {
        borderRadius: 20,
        padding: 24,
        margin: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    input: {
        borderColor: 'rgba(255,255,255,0.2)',
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        color: 'white',
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginBottom: 24,
        fontSize: 16,
        textAlignVertical: 'top',
        minHeight: 80,
    },
    modalActions: {
        flexDirection: 'row',
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
    },
    cancelText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    saveButton: {
        flex: 2,
        borderRadius: 12,
        overflow: 'hidden',
    },
    saveGradient: {
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
