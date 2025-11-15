import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { auth, db } from "../firebase";
import { useFocusEffect } from "@react-navigation/native";
import Checkbox from "expo-checkbox";

export default function HomeScreen({ navigation }) {
  const [userEmail, setUserEmail] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) setUserEmail(user.email);
      else navigation.replace("Login");
    });
    return unsubscribe;
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = db
        .collection("tasks")
        .orderBy("createdAt", "desc")
        .onSnapshot((snapshot) => {
          const fetched = snapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter((task) => task.user === auth.currentUser.email);

          setTasks(fetched);
        });

      return () => unsubscribe();
    }, [])
  );

  const handleLogout = () => {
    auth.signOut().then(() => navigation.replace("Login"));
  };

  const handleDelete = (id) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await db.collection("tasks").doc(id).delete();
          } catch (err) {
            console.error("Delete error:", err.message);
          }
        },
      },
    ]);
  };

  const toggleCompleted = async (task) => {
    try {
      await db.collection("tasks").doc(task.id).update({
        completed: !task.completed,
      });
    } catch (err) {
      console.log("Completion update error:", err.message);
    }
  };

  const handleEdit = (task) => {
    navigation.navigate("EditTask", { task });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📝 My TODOs</Text>
      <Text style={styles.subheader}>Welcome, {userEmail}</Text>

      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <View style={styles.taskRow}>
            <Checkbox
              style={styles.checkbox}
              value={item.completed}
              onValueChange={() => toggleCompleted(item)}
            />
            <TouchableOpacity
              style={styles.taskItem}
              onPress={() => handleEdit(item)}
              onLongPress={() => handleDelete(item.id)}
            >
              <Text
                style={[
                  styles.taskText,
                  item.completed && styles.completedText,
                ]}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.empty}>No tasks yet</Text>}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddTask")}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Text style={styles.logoutText}>LOGOUT</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 20,
    paddingTop: 60,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  subheader: {
    fontSize: 16,
    marginBottom: 20,
    color: "#666",
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkbox: {
    marginRight: 10,
  },
  taskItem: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  taskText: {
    fontSize: 16,
    color: "#333",
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  empty: {
    textAlign: "center",
    color: "#aaa",
    marginTop: 50,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 80,
    backgroundColor: "#007AFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  fabText: {
    fontSize: 30,
    color: "#fff",
  },
  logout: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#ff3b30",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
