import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Linking,
} from "react-native";
import { db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

type Vacancy = {
  title: string;
  description: string;
  location: string;
  remote: boolean;
  studyLevel: string;
  minDuration: string;
  tags?: string[];
  postedAt?: { toDate: () => Date };
  solicitants: { studentId: string; status: boolean }[];
};

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  study: string;
  skills: string[];
  industries: string[];
  externalLink?: string;
};

const VacancyDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [vacancy, setVacancy] = useState<Vacancy | null>(null);
  const [approvedStudents, setApprovedStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchVacancyAndStudents = async () => {
    try {
      if (!id) throw new Error("Vacancy ID is missing.");

      setLoading(true);
      const vacancyDocRef = doc(db, "vacancy", id as string);
      const vacancyDocSnap = await getDoc(vacancyDocRef);

      if (vacancyDocSnap.exists()) {
        const fetchedVacancy = vacancyDocSnap.data() as Vacancy;
        setVacancy(fetchedVacancy);

        const approvedSolicitants = fetchedVacancy.solicitants.filter(
          (solicitant) => solicitant.status === true
        );

        const studentPromises = approvedSolicitants.map((solicitant) =>
          getDoc(doc(db, "students", solicitant.studentId))
        );

        const fetchedStudents = await Promise.all(studentPromises);
        setApprovedStudents(
          fetchedStudents.map((studentDoc) => ({
            id: studentDoc.id,
            ...(studentDoc.data() as Omit<Student, "id">),
          }))
        );
      } else {
        console.error("Vacancy not found.");
      }
    } catch (error) {
      console.error("Error fetching vacancy or students:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVacancyAndStudents();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchVacancyAndStudents();
  };

  const openLinkedInProfile = (link?: string) => {
    if (link) {
      Linking.openURL(link).catch(() =>
        alert("Error: Unable to open LinkedIn profile.")
      );
    } else {
      alert("No LinkedIn profile link available.");
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Loading vacancy details...</Text>
      </View>
    );
  }

  if (!vacancy) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorMessage}>Vacancy not found.</Text>
        <TouchableOpacity style={styles.goBackButton} onPress={() => router.back()}>
          <Text style={styles.goBackButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.goBackIcon}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vacancy Details</Text>
        <TouchableOpacity
          onPress={() => router.push({ pathname: "./Edit/EditVacancyScreen", params: { id } })}
          style={styles.editIcon}
        >
          <MaterialIcons name="edit" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        <View style={styles.card}>
          <Text style={styles.title}>{vacancy.title}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.sectionContent}>{vacancy.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <Text style={styles.sectionContent}>
              {vacancy.location} {vacancy.remote && "(Remote)"}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Study Level</Text>
            <Text style={styles.sectionContent}>{vacancy.studyLevel}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Minimum Duration</Text>
            <Text style={styles.sectionContent}>{vacancy.minDuration} months</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagsContainer}>
              {vacancy.tags?.length ? (
                vacancy.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.sectionContent}>No tags available</Text>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Posted At</Text>
            <Text style={styles.sectionContent}>
              {vacancy.postedAt?.toDate().toLocaleString() || "Unknown"}
            </Text>
          </View>
        </View>

        <Text style={styles.subHeader}>Approved Students</Text>
        {approvedStudents.length === 0 ? (
          <Text style={styles.noStudentsText}>No students approved for this vacancy yet.</Text>
        ) : (
          approvedStudents.map((student) => (
            <View key={student.id} style={styles.studentCard}>
              <Text style={styles.studentName}>
                {student.firstName} {student.lastName}
              </Text>
              <Text style={styles.studentDetails}>Email: {student.email}</Text>
              <Text style={styles.studentDetails}>Phone: {student.phoneNumber}</Text>
              <Text style={styles.studentDetails}>Study: {student.study}</Text>
              <Text style={styles.studentDetails}>
                Skills: {student.skills?.join(", ") || "N/A"}
              </Text>
              <Text style={styles.studentDetails}>
                Industries: {student.industries?.join(", ") || "N/A"}
              </Text>
              {student.externalLink && (
                <TouchableOpacity
                  style={styles.linkedinButton}
                  onPress={() => openLinkedInProfile(student.externalLink)}
                >
                  <Text style={styles.linkedinButtonText}>View LinkedIn Profile</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorMessage: {
    fontSize: 16,
    color: "#E74C3C",
    marginBottom: 20,
  },
  goBackButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 8,
  },
  goBackButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  goBackIcon: {
    marginRight: 10,
  },
  editIcon: {
    backgroundColor: "#2ECC71",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 5,
  },
  sectionContent: {
    fontSize: 16,
    color: "#333",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  tag: {
    backgroundColor: "#007BFF",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  tagText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  subHeader: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 20,
  },
  noStudentsText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
  studentCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  studentName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  studentDetails: {
    fontSize: 16,
    color: "#444",
    marginBottom: 5,
  },
  linkedinButton: {
    backgroundColor: "#0077B5",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  linkedinButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default VacancyDetailScreen;
