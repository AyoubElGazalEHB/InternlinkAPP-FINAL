import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { db, auth } from "../../firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

type Solicitation = {
  id: string;
  title: string;
  status: string; // "Pending", "Approved", or "Declined"
};

const MySolicitationsScreen = () => {
  const router = useRouter();
  const [solicitations, setSolicitations] = useState<Solicitation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSolicitations = async () => {
    try {
      const student = auth.currentUser;

      if (!student) {
        console.error("No student logged in.");
        return;
      }

      const solicitationsList: Solicitation[] = [];

      // Fetch all vacancies
      const vacancySnapshot = await getDocs(collection(db, "vacancy"));

      for (const vacancyDoc of vacancySnapshot.docs) {
        const vacancyData = vacancyDoc.data();
        const vacancyId = vacancyDoc.id;

        // Check if the studentId exists in the solicitants array
        const solicitationEntry = vacancyData.solicitants?.find(
          (solicitant: any) => solicitant.studentId === student.uid
        );

        if (!solicitationEntry) {
          continue;
        }

        if (solicitationEntry.status === false) {
          // If status is false in the vacancy, it is pending
          solicitationsList.push({
            id: vacancyId,
            title: vacancyData.title,
            status: "Pending",
          });
        } else {
          // If status is true in the vacancy, check the interviews collection
          const interviewQuery = query(
            collection(db, "interviews"),
            where("studentId", "==", student.uid),
            where("vacancyId", "==", vacancyId)
          );
          const interviewSnapshot = await getDocs(interviewQuery);

          if (!interviewSnapshot.empty) {
            const interviewDoc = interviewSnapshot.docs[0];
            const interviewData = interviewDoc.data();

            solicitationsList.push({
              id: vacancyId,
              title: vacancyData.title,
              status: interviewData.status ? "Approved" : "Declined",
            });
          }
        }
      }

      setSolicitations(solicitationsList);
    } catch (error) {
      console.error("Error fetching solicitations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSolicitation = async (solicitationId: string) => {
    const student = auth.currentUser;

    if (!student) {
      console.error("No student logged in.");
      return;
    }

    Alert.alert(
      "Delete Solicitation",
      "Are you sure you want to delete this solicitation?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const vacancyRef = doc(db, "vacancy", solicitationId);

              // Update the vacancy by removing the student's solicitation
              await updateDoc(vacancyRef, {
                solicitants: arrayRemove({ studentId: student.uid, status: false }),
              });

              // Remove from local state
              setSolicitations((prev) =>
                prev.filter((solicitation) => solicitation.id !== solicitationId)
              );

              Alert.alert("Success", "Solicitation deleted successfully.");
            } catch (error) {
              console.error("Error deleting solicitation:", error);
              Alert.alert("Error", "Failed to delete solicitation.");
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchSolicitations();
  }, []);

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Loading solicitations...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.goBackButton}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Solicitations</Text>
      </View>

      <FlatList
        data={solicitations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.solicitationCard}>
            <View style={styles.solicitationInfo}>
              <Text style={styles.solicitationTitle}>{item.title}</Text>
              <Text
                style={[
                  styles.solicitationStatus,
                  item.status === "Pending"
                    ? styles.pendingStatus
                    : item.status === "Approved"
                    ? styles.approvedStatus
                    : styles.declinedStatus,
                ]}
              >
                Status: {item.status}
              </Text>
            </View>
            {item.status === "Pending" && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteSolicitation(item.id)}
              >
                <MaterialIcons name="delete" size={24} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>No solicitations found.</Text>
        }
        contentContainerStyle={styles.listContainer}
      />
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
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#007BFF",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 10,
  },
  goBackButton: {
    backgroundColor: "#555",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  listContainer: {
    padding: 20,
  },
  solicitationCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  solicitationInfo: {
    flex: 1,
    marginRight: 10,
  },
  solicitationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  solicitationStatus: {
    fontSize: 14,
    fontWeight: "bold",
  },
  pendingStatus: {
    color: "#FFA500", // Orange for Pending
  },
  approvedStatus: {
    color: "#32CD32", // Green for Approved
  },
  declinedStatus: {
    color: "#FF6347", // Red for Declined
  },
  deleteButton: {
    backgroundColor: "#E74C3C",
    padding: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyMessage: {
    textAlign: "center",
    color: "#555",
    fontSize: 16,
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
  },
});

export default MySolicitationsScreen;
