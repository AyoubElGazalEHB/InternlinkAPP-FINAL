import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { db, auth } from "../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const CreateVacancyScreen = () => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [remote, setRemote] = useState(false);
  const [studyLevel, setStudyLevel] = useState("");
  const [minDuration, setMinDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const predefinedTags = [
    "Technology",
    "Finance",
    "Marketing",
    "Healthcare",
    "Education",
    "Retail",
    "Real Estate",
    "Consulting",
    "Construction",
    "Logistics",
    "Entertainment",
    "Hospitality",
  ];

  const handleTagSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSaveVacancy = async () => {
    setMessage("");
    setMessageType("");

    if (!title || !description || !location || !studyLevel || !minDuration) {
      setMessage("Please fill out all required fields.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);

      const user = auth.currentUser;
      if (!user) {
        setMessage("You must be logged in to create a vacancy.");
        setMessageType("error");
        return;
      }

      const vacancyData = {
        title,
        description,
        tags: selectedTags,
        location,
        remote,
        studyLevel,
        minDuration,
        postedAt: new Date(),
        companyId: user.uid,
      };

      await addDoc(collection(db, "vacancy"), vacancyData);

      setMessage("Vacancy created successfully!");
      setMessageType("success");

      setTimeout(() => router.replace("../vacancy/CompanyVacanciesScreen"), 1500);
    } catch (error: any) {
      console.error("Error creating vacancy:", error);
      setMessage("Failed to create the vacancy.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header with Go Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.goBackButton}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Vacancy</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          {/* Title */}
          <Text style={styles.label}>Vacancy Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter vacancy title"
            value={title}
            onChangeText={setTitle}
          />

          {/* Description */}
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Enter vacancy description"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          {/* Tags */}
          <Text style={styles.label}>Tags (Select sectors)</Text>
          <View style={styles.tagsContainer}>
            {predefinedTags.map((tag, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.tagItem,
                  selectedTags.includes(tag) && styles.tagItemSelected,
                ]}
                onPress={() => handleTagSelect(tag)}
              >
                <Text
                  style={[
                    styles.tagText,
                    selectedTags.includes(tag) && styles.tagTextSelected,
                  ]}
                >
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Location */}
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter location"
            value={location}
            onChangeText={setLocation}
          />

          {/* Remote */}
          <Text style={styles.label}>Remote</Text>
          <View style={styles.remoteContainer}>
            <TouchableOpacity
              style={[
                styles.remoteButton,
                remote && styles.remoteButtonSelected,
              ]}
              onPress={() => setRemote(true)}
            >
              <Text style={styles.remoteButtonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.remoteButton,
                !remote && styles.remoteButtonSelected,
              ]}
              onPress={() => setRemote(false)}
            >
              <Text style={styles.remoteButtonText}>No</Text>
            </TouchableOpacity>
          </View>

          {/* Study Level */}
          <Text style={styles.label}>Study Level</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter study level (e.g., Bachelor, Master)"
            value={studyLevel}
            onChangeText={setStudyLevel}
          />

          {/* Minimum Duration */}
          <Text style={styles.label}>Minimum Duration (in months)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter minimum duration"
            value={minDuration}
            onChangeText={setMinDuration}
            keyboardType="number-pad"
          />

          {/* Message Display */}
          {message ? (
            <Text
              style={[
                styles.message,
                messageType === "error" ? styles.error : styles.success,
              ]}
            >
              {message}
            </Text>
          ) : null}

          {/* Save Button */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveVacancy}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? "Saving..." : "Save Vacancy"}
            </Text>
          </TouchableOpacity>
        </View>
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
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#007BFF",
  },
  goBackButton: {
    backgroundColor: "#555",
    padding: 10,
    borderRadius: 20,
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
    backgroundColor: "#F5F7FA",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    borderColor: "#E0E6ED",
    borderWidth: 1,
    fontSize: 14,
    color: "#333",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  tagItem: {
    backgroundColor: "#F0F4F8",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  tagItemSelected: {
    backgroundColor: "#007BFF",
  },
  tagText: {
    color: "#555",
  },
  tagTextSelected: {
    color: "#fff",
  },
  remoteContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  remoteButton: {
    flex: 1,
    backgroundColor: "#F0F4F8",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
  },
  remoteButtonSelected: {
    backgroundColor: "#007BFF",
  },
  remoteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#3498DB",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  message: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 14,
  },
  error: {
    color: "#E74C3C",
  },
  success: {
    color: "#2ECC71",
  },
});

export default CreateVacancyScreen;
