import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { db, auth } from "../../firebaseConfig";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import Swiper from "react-native-deck-swiper";

type Vacancy = {
  id: string;
  title: string;
  description: string;
  location: string;
  minDuration: string;
  remote: boolean;
  tags: string[];
  postedAt: string;
  solicitants: { studentId: string; status: boolean }[];
};

const MatchesScreen = () => {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRemovedVacancy, setLastRemovedVacancy] = useState<Vacancy | null>(null);
  const [lastRemovedIndex, setLastRemovedIndex] = useState<number | null>(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [swipeMessage, setSwipeMessage] = useState<string>("");

const fetchVacancies = async () => {
  try {
    const student = auth.currentUser;

    if (!student) {
      console.error("No student logged in.");
      return;
    }

    const vacanciesSnapshot = await getDocs(
      query(collection(db, "vacancy"), orderBy("postedAt", "desc"))
    );

    const fetchedVacancies: Vacancy[] = vacanciesSnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Vacancy, "id">),
      }))
      .filter((vacancy) => {
        // Ensure `solicitants` exists and is an array before calling `.some`
        if (!Array.isArray(vacancy.solicitants)) {
          return true; // Include the vacancy if `solicitants` is undefined or not an array
        }
        return !vacancy.solicitants.some(
          (solicitant) => solicitant.studentId === student.uid && solicitant.status === true
        );
      });

    setVacancies(fetchedVacancies);
  } catch (error) {
    console.error("Error fetching vacancies:", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchVacancies();
  }, []);

  const updateStudentTags = async (vacancy: Vacancy) => {
    const student = auth.currentUser;

    if (!student) {
      console.error("No student logged in.");
      return;
    }

    try {
      const studentDocRef = doc(db, "students", student.uid);
      const studentDoc = await getDoc(studentDocRef);

      if (studentDoc.exists()) {
        const studentData = studentDoc.data();
        const tagPoints = studentData.tagPoints || {}; // Initialize tagPoints if not present
        const solicitedVacancies = studentData.solicitedVacancies || []; // List of solicited vacancies

        if (!solicitedVacancies.includes(vacancy.id)) {
          // Increment points for each tag in the vacancy
          vacancy.tags.forEach((tag) => {
            if (tagPoints[tag]) {
              tagPoints[tag] += 1;
            } else {
              tagPoints[tag] = 1;
            }
          });

          // Update student data in Firestore
          await updateDoc(studentDocRef, {
            tagPoints,
            solicitedVacancies: arrayUnion(vacancy.id), // Add vacancy to solicited list
          });
        }
      }
    } catch (error) {
      console.error("Error updating student tags:", error);
    }
  };

  const handleSolicit = async (vacancy: Vacancy) => {
    const student = auth.currentUser;

    if (!student) {
      console.error("No student logged in.");
      return;
    }

    try {
      await updateDoc(doc(db, "vacancy", vacancy.id), {
        solicitants: arrayUnion({ studentId: student.uid, status: false }),
      });

      // Update student tag points
      await updateStudentTags(vacancy);

      setSwipeMessage("You solicited this vacancy.");
    } catch (error) {
      console.error("Error soliciting vacancy:", error);
    }

    setLastRemovedVacancy(vacancy);
    setLastRemovedIndex(cardIndex);
  };

  const handleSkip = async (vacancy: Vacancy) => {
    const student = auth.currentUser;

    if (!student) {
      console.error("No student logged in.");
      return;
    }

    try {
      await updateDoc(doc(db, "vacancy", vacancy.id), {
        solicitants: arrayRemove({ studentId: student.uid, status: false }),
      });
      setSwipeMessage("You skipped this vacancy.");
    } catch (error) {
      console.error("Error skipping vacancy:", error);
    }

    setLastRemovedVacancy(vacancy);
    setLastRemovedIndex(cardIndex);
  };

  const handleReset = () => {
    fetchVacancies();
    setLastRemovedVacancy(null);
    setLastRemovedIndex(null);
    setCardIndex(0);
    setSwipeMessage("");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Loading matches...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.title}>Find Your Match</Text>

      {vacancies.length === 0 ? (
        <View style={styles.noMoreCards}>
          <Text style={styles.noMoreCardsText}>No more vacancies available!</Text>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>View All Vacancies Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {swipeMessage ? <Text style={styles.swipeMessage}>{swipeMessage}</Text> : null}

          <Swiper
            cards={vacancies}
            renderCard={(vacancy) => (
              <View key={vacancy.id} style={styles.card}>
                <ScrollView>
                  <Text style={styles.cardTitle}>{vacancy.title}</Text>
                  <Text style={styles.cardDescription}>{vacancy.description}</Text>
                  <Text style={styles.cardDetails}>📍 Location: {vacancy.location}</Text>
                  <Text style={styles.cardDetails}>
                    ⏳ Minimum Duration: {vacancy.minDuration} months
                  </Text>
                  <Text style={styles.cardDetails}>
                    🏡 Remote: {vacancy.remote ? "Yes" : "No"}
                  </Text>
                  <Text style={styles.cardTags}>Tags: {vacancy.tags.join(", ")}</Text>
                  <Text style={styles.cardSolicitants}>
                    {vacancy.solicitants?.length || 0} people have solicited this vacancy
                  </Text>
                </ScrollView>
              </View>
            )}
            onSwipedLeft={(index) => handleSkip(vacancies[index])}
            onSwipedRight={(index) => handleSolicit(vacancies[index])}
            onSwipedAll={() => setVacancies([])}
            cardIndex={cardIndex}
            backgroundColor={"#F5F7FA"}
            stackSize={3}
          />

          <View style={styles.swipeIndicators}>
            <Text style={styles.skipIndicator}>← Skip</Text>
            <Text style={styles.solicitIndicator}>Solicit →</Text>
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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
    height: 450,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  cardDescription: {
    fontSize: 16,
    color: "#555",
    marginBottom: 15,
  },
  cardDetails: {
    fontSize: 16,
    color: "#777",
    marginBottom: 10,
  },
  cardTags: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
    marginTop: 15,
  },
  cardSolicitants: {
    fontSize: 16,
    color: "#888",
    marginTop: 15,
  },
  swipeIndicators: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  skipIndicator: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF6347",
  },
  solicitIndicator: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#32CD32",
  },
  swipeMessage: {
    textAlign: "center",
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  noMoreCards: {
    alignItems: "center",
    marginTop: 50,
  },
  noMoreCardsText: {
    fontSize: 18,
    color: "#555",
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  resetButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MatchesScreen;
