import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useAuth } from "../../Context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  const { login } = useAuth();

  const handleLogin = async () => {
    setLoading(true); // Show loader
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setEmailError("Email field cannot be empty");
    } else if (!validateEmail(trimmedEmail)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password field cannot be empty");
    } else if (password.length < 3) {
      setPasswordError("Password must be at least 3 characters long");
    } else {
      setPasswordError("");
    }

    if (
      trimmedEmail &&
      password &&
      validateEmail(trimmedEmail) &&
      password.length >= 3
    ) {
      try {
        const res = await login(trimmedEmail, password);
        const loggedInUser = await AsyncStorage.getItem("loggedIn");

        if (loggedInUser) {
          navigation.navigate("HomePage");
          Toast.show({
            text1: "Success",
            text2: "Login successful",
            type: "success",
          });

          setEmail("");
          setPassword("");
        }
      } catch (error) {
        console.error("Login error:", error);

        Toast.show({
          text1: "Login Error",
          text2: error.message || "Something went wrong",
          type: "error",
        });
      }
    }

    setLoading(false); // Hide loader
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const isDisabled = !email || password.length < 3 || !validateEmail(email) || loading;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={require("../../assets/loginbg.png")}
        style={{ flex: 1, position: "absolute", width: "100%", height: "100%" }}
      />

      <View style={styles.innerContainer}>
        <View style={styles.logoContainer}>
          <Animated.Image
            entering={FadeInUp.delay(300).duration(3000).springify()}
            source={require("../../assets/eventx-logo.png")}
            style={styles.logo}
          />
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Sign In</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Email"
              placeholderTextColor={"gray"}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError("");
              }}
              value={email}
            />
          </View>
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Password"
              placeholderTextColor={"gray"}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError("");
              }}
              value={password}
              secureTextEntry
            />
          </View>
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

          <View style={{ width: "100%", marginBottom: 10 }}>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: isDisabled ? "gray" : "#d6001c" },
              ]}
              onPress={handleLogin}
              disabled={isDisabled}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.signupContainer}>
            <Text>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text style={styles.signupText}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
  },
  innerContainer: {
    display: "flex",
    width: "100%",
    height: "100%",
    justifyContent: "space-around",
    paddingTop: 40,
    paddingBottom: 10,
  },
  logoContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    position: "absolute",
  },
  logo: {
    tintColor: "#fff",
    height: 50,
    width: 150,
  },
  titleContainer: {
    display: "flex",
    alignItems: "center",
    paddingTop: 40,
  },
  title: {
    fontSize: 35,
    color: "#fff",
    fontWeight: "700",
  },
  formContainer: {
    display: "flex",
    alignItems: "center",
    marginHorizontal: 10,
    gap: 15,
  },
  inputContainer: {
    backgroundColor: "rgb(245 245 244)",
    padding: 12,
    borderRadius: 15,
    width: "100%",
  },
  errorText: {
    color: "red",
  },
  button: {
    width: "100%",
    padding: 12,
    borderRadius: 15,
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
    fontSize: 18,
  },
  signupContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  signupText: {
    marginLeft: 5,
    color: "#d6001c",
    fontWeight: "600",
  },
});

export default LoginPage;
