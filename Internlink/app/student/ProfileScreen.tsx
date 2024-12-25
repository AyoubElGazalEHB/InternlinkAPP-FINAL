import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Linking,
} from "react-native";
import { auth, db } from "../../firebaseConfig";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const StudentProfileScreen = () => {
  const router = useRouter();
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch student data
  const fetchStudentData = async () => {
    try {
      const user = auth.currentUser;

      if (user) {
        const docRef = doc(db, "students", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setStudentData(docSnap.data());
        } else {
          Alert.alert("Error", "No data found for the logged-in student.");
        }
      } else {
        Alert.alert("Error", "No user is currently logged in.");
        router.replace("/auth/LoginStudentScreen");
      }
    } catch (error: any) {
      Alert.alert("Error", "An error occurred while fetching student data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  // Refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    fetchStudentData();
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Logout Successful", "You have been logged out.");
      router.replace("/auth/LoginStudentScreen");
    } catch (error: any) {
      Alert.alert(
        "Logout Failed",
        error.message || "An error occurred during logout."
      );
    }
  };

  // Navigate to Edit Profile
  const handleEditProfile = () => {
    router.push("../profile/EditStudentProfileScreen");
  };

  // Navigate to My Solicitations
  const handleMySolicitations = () => {
    router.push("../solicitation/MySolicitationsScreen");
  };

  // Generate a random background color
  const getRandomColor = () => {
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#F1C40F", "#8E44AD"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Open LinkedIn Profile
  const openLinkedInProfile = () => {
    if (studentData?.externalLink) {
      Linking.openURL(studentData.externalLink).catch(() =>
        Alert.alert("Error", "Unable to open LinkedIn profile.")
      );
    } else {
      Alert.alert("Error", "No LinkedIn profile link found.");
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
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#007BFF"]}
          />
        }
      >
        <View style={styles.profileCard}>
          {/* Edit Profile Icon */}
          <TouchableOpacity onPress={handleEditProfile} style={styles.editIcon}>
            <MaterialIcons name="edit" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Profile Picture */}
          <View
            style={[
              styles.profilePicture,
              { backgroundColor: getRandomColor() },
            ]}
          >
            <Text style={styles.profilePictureText}>
              {studentData.firstName?.[0]?.toUpperCase() || "?"}
            </Text>
          </View>

          {/* Profile Information */}
          <View style={styles.infoSection}>
            <Text style={styles.label}>First Name:</Text>
            <Text style={styles.value}>{studentData.firstName}</Text>

            <Text style={styles.label}>Last Name:</Text>
            <Text style={styles.value}>{studentData.lastName}</Text>

            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{studentData.email}</Text>

            <Text style={styles.label}>Phone Number:</Text>
            <Text style={styles.value}>{studentData.phoneNumber}</Text>

            <Text style={styles.label}>Study:</Text>
            <Text style={styles.value}>{studentData.study}</Text>

            {studentData.industries && (
              <>
                <Text style={styles.label}>Industries:</Text>
                <Text style={styles.value}>
                  {studentData.industries.join(", ")}
                </Text>
              </>
            )}

            {studentData.skills && (
              <>
                <Text style={styles.label}>Skills:</Text>
                <Text style={styles.value}>
                  {studentData.skills.join(", ")}
                </Text>
              </>
            )}
          </View>

          {/* LinkedIn Button */}
          {studentData.externalLink && (
            <TouchableOpacity
              style={styles.linkedinButton}
              onPress={openLinkedInProfile}
            >
              <Text style={styles.linkedinButtonText}>
                View LinkedIn Profile
              </Text>
            </TouchableOpacity>
          )}

          {/* My Solicitations Button */}
          <TouchableOpacity
            style={styles.mySolicitationsButton}
            onPress={handleMySolicitations}
          >
            <Text style={styles.mySolicitationsButtonText}>
              My Solicitations
            </Text>
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
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
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#F5F7FA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
  },
  profileCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
    alignItems: "center",
    position: "relative",
  },
  editIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#3498DB",
    padding: 10,
    borderRadius: 20,
  },
  profilePicture: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  profilePictureText: {
    fontSize: 34,
    color: "#fff",
    fontWeight: "bold",
  },
  infoSection: {
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  linkedinButton: {
    backgroundColor: "#0077B5",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  linkedinButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  mySolicitationsButton: {
    backgroundColor: "#3498DB",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  mySolicitationsButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#E74C3C",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default StudentProfileScreen;
