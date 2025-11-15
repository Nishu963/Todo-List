import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { db, auth } from "../firebase";

export default function AddTaskScreen({ navigation }) {
  const [task, setTask] = useState("");
  const [error, setError] = useState("");

  const handleAddTask = async () => {
    if (!task.trim()) {
      setError("Task cannot be empty");
      return;
    }

    try {
      await db.collection("tasks").add({
        title: task,
        user: auth.currentUser.email,
        completed: false, 
        createdAt: new Date(),
      });
      console.log("✅ Task added:", task);
      navigation.goBack();
    } catch (err) {
      console.error("❌ Add task error:", err.message);
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add New Task</Text>

      <TextInput
        placeholder="Enter your task"
        value={task}
        onChangeText={setTask}
        style={styles.input}
      />

      <Button title="Add Task" onPress={handleAddTask} />

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#f9f9f9" },
  header: { fontSize: 24, marginBottom: 20, textAlign: "center", fontWeight: "bold", color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  error: { color: "red", marginTop: 10, textAlign: "center" },
});


