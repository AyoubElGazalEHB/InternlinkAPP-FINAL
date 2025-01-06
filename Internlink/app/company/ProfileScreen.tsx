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
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from "../../firebaseConfig";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const CompanyProfileScreen = () => {
  const router = useRouter();
  const [companyData, setCompanyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profileColor, setProfileColor] = useState("");

  // Generate or retrieve a random color
  const getRandomColor = async () => {
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#F1C40F", "#8E44AD"];
    try {
      const storedColor = await AsyncStorage.getItem("companyProfileColor");
      if (storedColor) {
        return storedColor;
      }
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      await AsyncStorage.setItem("companyProfileColor", randomColor);
      return randomColor;
    } catch (error) {
      console.error("Error accessing AsyncStorage:", error);
      return colors[0]; // Default color in case of error
    }
  };

  useEffect(() => {
    const fetchProfileColorAndData = async () => {
      setProfileColor(await getRandomColor());
      fetchCompanyData();
    };

    const fetchCompanyData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, "company", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setCompanyData(docSnap.data());
          } else {
            Alert.alert("Error", "Company data not found.");
          }
        }
      } catch (error: any) {
        console.error("Error fetching company data:", error.message);
        Alert.alert("Error", "An error occurred while fetching company data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileColorAndData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Logout Successful", "You have been logged out.");
      router.replace("/auth/LoginCompanyScreen");
    } catch (error: any) {
      console.error("Error logging out:", error);
      Alert.alert("Logout Failed", error.message || "An error occurred during logout.");
    }
  };

  const handleEditProfile = () => {
    router.push("../profile/EditCompanyProfileScreen");
  };

  const handleVacancies = () => {
    router.push("../vacancy/CompanyVacanciesScreen");
  };

  const openLinkedInProfile = () => {
    if (companyData?.externalLink) {
      Linking.openURL(companyData.externalLink).catch(() => {
        Alert.alert("Error", "Failed to open LinkedIn profile.");
      });
    } else {
      Alert.alert("Error", "No LinkedIn profile link available.");
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
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileCard}>
          {/* Profile Circle */}
          <View
            style={[
              styles.profileCircle,
              { backgroundColor: profileColor || "#FF5733" },
            ]}
          >
            <Text style={styles.profileCircleText}>
              {companyData?.companyName?.[0]?.toUpperCase() || "?"}
            </Text>
          </View>

          {/* Edit Icon */}
          <TouchableOpacity onPress={handleEditProfile} style={styles.editIcon}>
            <MaterialIcons name="edit" size={24} color="#fff" />
          </TouchableOpacity>

          {companyData ? (
            <View>
              <Text style={styles.label}>Company Name:</Text>
              <Text style={styles.value}>{companyData.companyName}</Text>

              <Text style={styles.label}>First Name:</Text>
              <Text style={styles.value}>{companyData.firstName}</Text>

              <Text style={styles.label}>Last Name:</Text>
              <Text style={styles.value}>{companyData.lastName}</Text>

              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{companyData.email}</Text>

              <Text style={styles.label}>Phone Number:</Text>
              <Text style={styles.value}>{companyData.phoneNumber}</Text>

              <Text style={styles.label}>Address:</Text>
              <Text style={styles.value}>{companyData.address}</Text>
            </View>
          ) : (
            <Text>No company data found.</Text>
          )}

          <TouchableOpacity style={styles.linkedInButton} onPress={openLinkedInProfile}>
            <Text style={styles.linkedInButtonText}>View LinkedIn Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.vacanciesButton} onPress={handleVacancies}>
            <Text style={styles.vacanciesButtonText}>View Vacancies</Text>
          </TouchableOpacity>

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
    position: "relative",
    alignItems: "flex-start",
  },
  editIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#3498DB",
    padding: 10,
    borderRadius: 20,
  },
  profileCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#007BFF",
    marginBottom: 20,
  },
  profileCircleText: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginTop: 10,
    textAlign: "left",
    width: "100%",
  },
  value: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
    textAlign: "left",
    width: "100%",
  },
  linkedInButton: {
    backgroundColor: "#0077B5",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
    width: "100%",
  },
  linkedInButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  vacanciesButton: {
    backgroundColor: "#2ECC71",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
    width: "100%",
  },
  vacanciesButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#E74C3C",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
    width: "100%",
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default CompanyProfileScreen;
