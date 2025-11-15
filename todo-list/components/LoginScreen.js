import React, { useState } from "react";
import { View, TextInput, Text, Button } from "react-native";
import { auth } from "../firebase"; // Firebase v8 setup

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async () => {
    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      console.log("✅ Login successful:", userCredential.user.email);
      navigation.replace("Home"); // Use replace to prevent back navigation
    } catch (err) {
      console.error("❌ Login failed:", err.message);
      setError(err.message);
    }
  };
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 25, marginBottom: 20 }}>Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
      />

      <Button title="Login" onPress={login} />

      {error ? <Text style={{ color: "red", marginTop: 10 }}>{error}</Text> : null}

      <Text
        style={{ marginTop: 20, color: "blue" }}
        onPress={() => navigation.navigate("Signup")}
      >
        Create new account
      </Text>
    </View>
  );
}
