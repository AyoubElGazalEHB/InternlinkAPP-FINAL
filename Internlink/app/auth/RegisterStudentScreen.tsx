import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { auth, db } from "../../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "expo-router";

const RegisterStudentScreen = () => {
  const router = useRouter();

  // State for form inputs
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [study, setStudy] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [externalLink, setExternalLink] = useState(""); // State for LinkedIn link
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customIndustry, setCustomIndustry] = useState("");
  const [customSkill, setCustomSkill] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success" | "">("");

  const industries = ["Technology", "Marketing", "Finance", "Healthcare"];
  const skills = ["Communication", "Problem Solving", "Teamwork", "Creativity"];

  const handleRegister = async () => {
    setMessage("");
    setMessageType("");

    if (
      !firstName ||
      !lastName ||
      !study ||
      !email ||
      !phoneNumber ||
      !password ||
      !repeatPassword ||
      !externalLink // Ensure LinkedIn link is provided
    ) {
      setMessage("Please fill out all fields.");
      setMessageType("error");
      return;
    }
    if (password !== repeatPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }

    // Add custom entries if they are not empty
    if (customIndustry.trim()) {
      selectedIndustries.push(customIndustry.trim());
    }
    if (customSkill.trim()) {
      selectedSkills.push(customSkill.trim());
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = userCredential.user.uid;

      // Use setDoc to set the uid as the document ID
      await setDoc(doc(db, "students", userId), {
        uid: userId,
        firstName,
        lastName,
        study,
        email,
        phoneNumber,
        externalLink, // Save LinkedIn link
        industries: selectedIndustries,
        skills: selectedSkills,
        createdAt: new Date(),
      });

      setMessage("Student account created successfully!");
      setMessageType("success");
      setTimeout(() => router.replace("/auth/LoginStudentScreen"), 1500);
    } catch (error: any) {
      setMessage(error.message || "An error occurred during registration.");
      setMessageType("error");
    }
  };

  const toggleSelection = (
    item: string,
    selectedItems: string[],
    setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((i) => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
    return age;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.avoidingView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Register as a Student</Text>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Account Information</Text>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
            />
            <TextInput
              style={styles.input}
              placeholder="Study (e.g., Computer Science)"
              value={study}
              onChangeText={setStudy}
            />
            <TextInput
              style={styles.input}
              placeholder="Student Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="LinkedIn Profile Link"
              value={externalLink}
              onChangeText={setExternalLink}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="Repeat Password"
              value={repeatPassword}
              onChangeText={setRepeatPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Industries</Text>
            <View style={styles.tagContainer}>
              {industries.map((industry) => (
                <TouchableOpacity
                  key={industry}
                  style={[
                    styles.tag,
                    selectedIndustries.includes(industry) && styles.selectedTag,
                  ]}
                  onPress={() =>
                    toggleSelection(industry, selectedIndustries, setSelectedIndustries)
                  }
                >
                  <Text
                    style={[
                      styles.tagText,
                      selectedIndustries.includes(industry) && styles.selectedTagText,
                    ]}
                  >
                    {industry}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.input}
              placeholder="Add a custom industry"
              value={customIndustry}
              onChangeText={setCustomIndustry}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.tagContainer}>
              {skills.map((skill) => (
                <TouchableOpacity
                  key={skill}
                  style={[
                    styles.tag,
                    selectedSkills.includes(skill) && styles.selectedTag,
                  ]}
                  onPress={() =>
                    toggleSelection(skill, selectedSkills, setSelectedSkills)
                  }
                >
                  <Text
                    style={[
                      styles.tagText,
                      selectedSkills.includes(skill) && styles.selectedTagText,
                    ]}
                  >
                    {skill}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.input}
              placeholder="Add a custom skill"
              value={customSkill}
              onChangeText={setCustomSkill}
            />
          </View>

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

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.secondaryButton, styles.leftButton]}
              onPress={() => router.push("/auth/LoginStudentScreen")}
            >
              <Text style={styles.secondaryButtonText}>Go to Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.secondaryButton, styles.rightButton]}
              onPress={() => router.push("/auth/UserTypeSelectionScreen")}
            >
              <Text style={styles.secondaryButtonText}>Change Role</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  avoidingView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#F5F7FA",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#555",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#F0F4F8",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    fontSize: 14,
    borderColor: "#E0E6ED",
    borderWidth: 1,
    color: "#333",
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
  },
  tag: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "#F0F4F8",
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedTag: {
    backgroundColor: "#007BFF",
  },
  tagText: {
    fontSize: 14,
    color: "#555",
  },
  selectedTagText: {
    color: "#fff",
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  leftButton: {
    backgroundColor: "#EAF4FF",
  },
  rightButton: {
    backgroundColor: "#EAF4FF",
  },
  secondaryButtonText: {
    color: "#007BFF",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
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

export default RegisterStudentScreen;
