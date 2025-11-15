import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { auth } from "../firebase"; // Firebase v8 setup

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const signup = async () => {
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      console.log("✅ Signup successful:", userCredential.user.email);
      navigation.replace("Home"); // Use replace to prevent back navigation
    } catch (err) {
      console.error("❌ Signup failed:", err.message);
      setError(err.message);
    }
  };
 return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 25, marginBottom: 20 }}>Signup</Text>

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

      <Button title="Signup" onPress={signup} />

      {error ? <Text style={{ color: "red", marginTop: 10 }}>{error}</Text> : null}

      <Text
        style={{ marginTop: 20, color: "blue" }}
        onPress={() => navigation.navigate("Login")}
      >
        Already have an account? Login
      </Text>
    </View>
  );
}

