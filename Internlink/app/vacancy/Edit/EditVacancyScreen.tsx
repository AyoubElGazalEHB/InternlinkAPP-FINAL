import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { db } from "../../../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const EditVacancyScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [remote, setRemote] = useState(false);
  const [studyLevel, setStudyLevel] = useState("");
  const [minDuration, setMinDuration] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVacancy = async () => {
      try {
        if (!id) throw new Error("Vacancy ID is missing.");
        const docRef = doc(db, "vacancy", id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || "");
          setDescription(data.description || "");
          setLocation(data.location || "");
          setRemote(data.remote || false);
          setStudyLevel(data.studyLevel || "");
          setMinDuration(data.minDuration || "");
          setTags(data.tags || []);
        } else {
          console.error("Vacancy not found.");
        }
      } catch (error) {
        console.error("Error fetching vacancy:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVacancy();
  }, [id]);

  const handleSave = async () => {
    try {
      const docRef = doc(db, "vacancy", id as string);
      await updateDoc(docRef, {
        title,
        description,
        location,
        remote,
        studyLevel,
        minDuration,
        tags,
      });
      Alert.alert("Success", "Vacancy updated successfully!");
      router.back();
    } catch (error) {
      console.error("Error updating vacancy:", error);
      Alert.alert("Error", "Failed to update the vacancy.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.goBackIcon}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Vacancy</Text>
        <View style={{ width: 24 }} /> 
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter vacancy title"
          value={title}
          onChangeText={setTitle}
        />
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Enter description"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter location"
          value={location}
          onChangeText={setLocation}
        />
        <Text style={styles.label}>Study Level</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter study level"
          value={studyLevel}
          onChangeText={setStudyLevel}
        />
        <Text style={styles.label}>Minimum Duration</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter minimum duration"
          value={minDuration}
          onChangeText={setMinDuration}
          keyboardType="number-pad"
        />
        <Text style={styles.label}>Tags</Text>
        <Text>{tags.join(", ") || "No tags selected"}</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  goBackIcon: {
    backgroundColor: "#555",
    borderRadius: 20,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#F0F4F8",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E6ED",
  },
  saveButton: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default EditVacancyScreen;
