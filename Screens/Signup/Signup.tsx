import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { signup } from '../../Services/Auth/authService';
import Toast from 'react-native-toast-message';

const SignupPage = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [age, setAge] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (!email || !password || !name || !age || !phoneNumber) {
            Toast.show({
                text1: "Signup Error",
                text2: "All fields are required",
                type: "error",
            });
            return;
        }

        setLoading(true); // Show loader

        try {
            await signup(name, age, email, phoneNumber, password);
            setLoading(false); // Hide loader after success
            Toast.show({
                text1: "Register Successful",
                text2: "Your account has been created successfully.",
                type: 'success',
            });
            navigation.navigate('Login');
        } catch (error) {
            setLoading(false); // Hide loader after error
            Toast.show({
                text1: "Signup Error",
                text2: error.message,
                type: 'error',
            });
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style='light' />
            <Image source={require('../../assets/loginbg.png')} style={styles.backgroundImage} />
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.innerContainer}>
                    <View style={styles.logoContainer}>
                        <Animated.Image
                            entering={FadeInUp.delay(300).duration(3000).springify()}
                            source={require('../../assets/eventx-logo.png')}
                            style={styles.logo}
                        />
                    </View>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Sign Up</Text>
                    </View>
                    <View style={styles.formContainer}>
                        <View style={styles.inputContainer}>
                            <TextInput placeholder='Name' onChangeText={setName} value={name} style={styles.input} />
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput placeholder='Email' onChangeText={setEmail} value={email} style={styles.input} />
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput placeholder='Phone No' onChangeText={setPhoneNumber} value={phoneNumber} style={styles.input} keyboardType='numeric' />
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput placeholder='Age' onChangeText={setAge} value={age} style={styles.input} keyboardType='numeric' />
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput placeholder='Password' onChangeText={setPassword} value={password} secureTextEntry style={styles.input} />
                        </View>
                        
                        <TouchableOpacity style={[styles.button, { backgroundColor: loading ? 'gray' : '#d6001c' }]} onPress={handleSignup} disabled={loading}>
                            {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Register</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.loginContainer}>
                    <Text>Already have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                        <Text style={styles.loginText}>Login</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    backgroundImage: { position: 'absolute', width: '100%', height: '100%' },
    scrollContainer: { flexGrow: 1, justifyContent: "flex-end", alignItems: 'center', marginBottom: 40 },
    innerContainer: { width: '100%', padding: 20 },
    logoContainer: { alignItems: 'center', marginBottom: 30 },
    logo: { tintColor: '#fff', height: 50, width: 150 },
    titleContainer: { alignItems: 'center', paddingTop: 20, marginBottom: 120 },
    title: { fontSize: 35, color: '#fff', fontWeight: '700' },
    formContainer: { alignItems: 'center', gap: 5 },
    inputContainer: { backgroundColor: 'rgb(245 245 244)', padding: 12, borderRadius: 15, width: '100%', marginBottom: 15 },
    input: { width: '100%' },
    button: { width: '100%', padding: 12, borderRadius: 15 },
    buttonText: { fontWeight: '700', color: '#ffffff', textAlign: 'center', fontSize: 18 },
    loginContainer: { display: 'flex', flexDirection: 'row', justifyContent: 'center' },
    loginText: { marginLeft: 5, color: '#d6001c', fontWeight: '600' },
});

export default SignupPage;
