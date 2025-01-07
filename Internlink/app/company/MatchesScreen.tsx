import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Linking,
} from "react-native";
import { db, auth } from "../../firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import Swiper from "react-native-deck-swiper";

type Vacancy = {
  id: string;
  title: string;
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

const CompanyMatchScreen = () => {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [selectedVacancyId, setSelectedVacancyId] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [swipeMessage, setSwipeMessage] = useState<string>("");

  const fetchVacancies = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user logged in.");

      const vacanciesSnapshot = await getDocs(
        query(collection(db, "vacancy"), where("companyId", "==", user.uid))
      );

      const fetchedVacancies: Vacancy[] = vacanciesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Vacancy, "id">),
      }));

      setVacancies(fetchedVacancies);
    } catch (error) {
      console.error("Error fetching vacancies:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchStudentsForVacancy = async (vacancyId: string) => {
    if (!vacancyId) return;

    try {
      setLoading(true);
      const vacancyDoc = await getDoc(doc(db, "vacancy", vacancyId));
      const vacancyData = vacancyDoc.data() as Vacancy;

      const pendingSolicitants = vacancyData.solicitants.filter((s) => !s.status);

      const studentPromises = pendingSolicitants.map((solicitation) =>
        getDoc(doc(db, "students", solicitation.studentId))
      );

      const fetchedStudents = await Promise.all(studentPromises);
      setStudents(
        fetchedStudents.map((studentDoc) => ({
          id: studentDoc.id,
          ...(studentDoc.data() as Omit<Student, "id">),
        }))
      );
    } catch (error) {
      console.error("Error fetching students for vacancy:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptStudent = async (student: Student) => {
    try {
      const vacancyDocRef = doc(db, "vacancy", selectedVacancyId!);

      await updateDoc(vacancyDocRef, {
        solicitants: students.map((s) =>
          s.id === student.id ? { studentId: s.id, status: true } : s
        ),
      });

      await addDoc(collection(db, "interviews"), {
        studentId: student.id,
        vacancyId: selectedVacancyId,
        companyId: auth.currentUser?.uid,
        status: true,
      });

      setSwipeMessage(`Accepted: ${student.firstName} ${student.lastName}`);
      setStudents((prev) => prev.filter((s) => s.id !== student.id));
    } catch (error) {
      console.error("Error accepting student:", error);
    }
  };

  const handleDeclineStudent = async (student: Student) => {
    try {
      const vacancyDocRef = doc(db, "vacancy", selectedVacancyId!);

      await updateDoc(vacancyDocRef, {
        solicitants: students.map((s) =>
          s.id === student.id ? { studentId: s.id, status: true } : s
        ),
      });

      await addDoc(collection(db, "interviews"), {
        studentId: student.id,
        vacancyId: selectedVacancyId,
        companyId: auth.currentUser?.uid,
        status: false,
      });

      setSwipeMessage(`Declined: ${student.firstName} ${student.lastName}`);
      setStudents((prev) => prev.filter((s) => s.id !== student.id));
    } catch (error) {
      console.error("Error declining student:", error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchVacancies();
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

  useEffect(() => {
    fetchVacancies();
  }, []);

  useEffect(() => {
    if (selectedVacancyId) fetchStudentsForVacancy(selectedVacancyId);
  }, [selectedVacancyId]);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!selectedVacancyId) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Select a Vacancy</Text>
        </View>
        <ScrollView
          contentContainerStyle={styles.vacancyListContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {vacancies.map((vacancy) => (
            <TouchableOpacity
              key={vacancy.id}
              style={styles.vacancyItem}
              onPress={() => setSelectedVacancyId(vacancy.id)}
            >
              <Text style={styles.vacancyTitle}>{vacancy.title}</Text>
              <Text style={styles.vacancyDetails}>
                {vacancy.solicitants?.length || 0} Students
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSelectedVacancyId(null)} style={styles.goBackButton}>
          <Text style={styles.goBackButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Solicited Students</Text>
      </View>

      {students.length === 0 ? (
        <View style={styles.noStudents}>
          <Text>No students have solicited this vacancy.</Text>
        </View>
      ) : (
        <>
          {swipeMessage && <Text style={styles.swipeMessage}>{swipeMessage}</Text>}

          <Swiper
            cards={students}
            renderCard={(student) => (
              <View key={student.id} style={styles.card}>
                <ScrollView>
                  <Text style={styles.cardTitle}>
                    {student.firstName} {student.lastName}
                  </Text>
                  <Text style={styles.cardDetails}>Email: {student.email}</Text>
                  <Text style={styles.cardDetails}>Phone: {student.phoneNumber}</Text>
                  <Text style={styles.cardDetails}>Study: {student.study}</Text>
                  <Text style={styles.cardTags}>
                    Skills: {student.skills.join(", ")}
                  </Text>
                  <Text style={styles.cardTags}>
                    Industries: {student.industries.join(", ")}
                  </Text>
                  {student.externalLink && (
                    <TouchableOpacity
                      style={styles.linkedinButton}
                      onPress={() => openLinkedInProfile(student.externalLink)}
                    >
                      <Text style={styles.linkedinButtonText}>View LinkedIn Profile</Text>
                    </TouchableOpacity>
                  )}
                </ScrollView>
              </View>
            )}
            onSwipedLeft={(index) => handleDeclineStudent(students[index])}
            onSwipedRight={(index) => handleAcceptStudent(students[index])}
            stackSize={3}
            backgroundColor="#F5F7FA"
          />

          <View style={styles.swipeIndicators}>
            <Text style={styles.declineIndicator}>← Decline</Text>
            <Text style={styles.acceptIndicator}>Accept →</Text>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    padding: 15,
    backgroundColor: "#007BFF",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
  },
  goBackButton: {
    padding: 10,
    backgroundColor: "#FF6347",
    borderRadius: 8,
  },
  goBackButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  vacancyListContainer: {
    padding: 15,
  },
  vacancyItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  vacancyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  vacancyDetails: {
    fontSize: 16,
    color: "#555",
  },
  swipeMessage: {
    textAlign: "center",
    marginVertical: 10,
    fontSize: 18,
    color: "#555",
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    height: 420,
    marginHorizontal: 10,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 15,
    color: "#333",
  },
  cardDetails: {
    fontSize: 16,
    color: "#444",
    marginBottom: 8,
  },
  cardTags: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007BFF",
    marginTop: 10,
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
  swipeIndicators: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 15,
  },
  declineIndicator: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF6347",
  },
  acceptIndicator: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#32CD32",
  },
  noStudents: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CompanyMatchScreen;
