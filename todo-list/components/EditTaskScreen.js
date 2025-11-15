import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { db } from "../firebase";

export default function EditTaskScreen({ route, navigation }) {
  const { task } = route.params;
  const [title, setTitle] = useState(task?.title || "");
  const [error, setError] = useState("");

  const handleUpdate = async () => {
    if (!title.trim()) {
      setError("Task cannot be empty");
      return;
    }

    try {
      await db.collection("tasks").doc(task.id).update({ title });
      navigation.goBack();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Task</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        placeholder="Update your task"
      />
      <Button title="Update Task" onPress={handleUpdate} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  error: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
});

