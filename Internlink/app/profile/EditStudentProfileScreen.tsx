import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateEmail, updatePassword } from "firebase/auth";
import { useRouter } from "expo-router";

const EditStudentProfileScreen = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [newIndustry, setNewIndustry] = useState("");

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          Alert.alert("Error", "No user is currently logged in.");
          router.replace("/auth/LoginStudentScreen");
          return;
        }

        const docRef = doc(db, "students", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setFirstName(data.firstName || "");
          setLastName(data.lastName || "");
          setEmail(data.email || "");
          setPhoneNumber(data.phoneNumber || "");
          setBio(data.bio || "");
          setExternalLink(data.externalLink || "");
          setSkills(data.skills || []);
          setIndustries(data.industries || []);
        } else {
          Alert.alert("Error", "No data found for the logged-in student.");
        }
      } catch (error) {
        Alert.alert("Error", "An error occurred while fetching student data.");
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      if (email !== user.email) await updateEmail(user, email);
      if (password) await updatePassword(user, password);

      const docRef = doc(db, "students", user.uid);
      await updateDoc(docRef, {
        firstName,
        lastName,
        email,
        phoneNumber,
        bio,
        externalLink,
        skills,
        industries,
      });

      Alert.alert("Success", "Profile updated successfully!");
      router.back();
    } catch (error: any) {
      console.error("Error during profile save:", error);
      Alert.alert("Error", `Failed to save profile: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Edit Student Profile</Text>

          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />

          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Password (leave blank to keep current password)</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={styles.input}
            placeholder="Bio"
            value={bio}
            onChangeText={setBio}
          />

          <Text style={styles.label}>LinkedIn Link</Text>
          <TextInput
            style={styles.input}
            placeholder="LinkedIn Link"
            value={externalLink}
            onChangeText={setExternalLink}
          />

          <View style={styles.skillsContainer}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {skills.map((skill, index) => (
              <View key={index} style={styles.skillItem}>
                <Text style={styles.skillText}>{skill}</Text>
                <TouchableOpacity onPress={() => setSkills(skills.filter((s) => s !== skill))}>
                  <Text style={styles.removeButton}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TextInput
              style={styles.input}
              placeholder="Add Skill"
              value={newSkill}
              onChangeText={setNewSkill}
              onSubmitEditing={() => {
                if (newSkill.trim()) setSkills([...skills, newSkill.trim()]);
                setNewSkill("");
              }}
            />
          </View>

          <View style={styles.industriesContainer}>
            <Text style={styles.sectionTitle}>Industries</Text>
            {industries.map((industry, index) => (
              <View key={index} style={styles.industryItem}>
                <Text style={styles.industryText}>{industry}</Text>
                <TouchableOpacity
                  onPress={() => setIndustries(industries.filter((i) => i !== industry))}
                >
                  <Text style={styles.removeButton}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TextInput
              style={styles.input}
              placeholder="Add Industry"
              value={newIndustry}
              onChangeText={setNewIndustry}
              onSubmitEditing={() => {
                if (newIndustry.trim()) setIndustries([...industries, newIndustry.trim()]);
                setNewIndustry("");
              }}
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
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
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#F5F7FA",
  },
  scrollContent: {
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    width: "100%",
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginBottom: 5,
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
    width: "100%",
  },
  saveButton: {
    backgroundColor: "#2ECC71",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    width: "100%",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  skillsContainer: {
    marginTop: 20,
    width: "100%",
  },
  industriesContainer: {
    marginTop: 20,
    width: "100%",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#555",
    marginBottom: 10,
  },
  skillItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  skillText: {
    fontSize: 14,
    color: "#333",
  },
  removeButton: {
    color: "#E74C3C",
    fontSize: 14,
  },
  industryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  industryText: {
    fontSize: 14,
    color: "#333",
  },
});

export default EditStudentProfileScreen;
