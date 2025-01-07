import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { db, auth } from "../../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

type Vacancy = {
  id: string;
  title: string;
  description: string;
  location: string;
  remote: boolean;
  minDuration: string;
};

const CompanyVacanciesScreen = () => {
  const router = useRouter();
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchVacancies = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("No user is logged in.");
        return;
      }
      const vacanciesQuery = query(
        collection(db, "vacancy"),
        where("companyId", "==", user.uid)
      );
      const querySnapshot = await getDocs(vacanciesQuery);

      const fetchedVacancies: Vacancy[] = querySnapshot.docs.map((doc) => ({
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

  useEffect(() => {
    fetchVacancies();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchVacancies();
  };

  const handleCreateVacancy = () => {
    router.push("../vacancy/CreateVacancyScreen");
  };

  const handleGoBack = () => {
    router.back();
  };

  const renderVacancy = ({ item }: { item: Vacancy }) => (
    <TouchableOpacity
      style={styles.vacancyCard}
      onPress={() =>
        router.push({
          pathname: "../vacancy/VacancyDetailScreen",
          params: { id: item.id },
        })
      }
    >
      <Text style={styles.vacancyTitle}>{item.title}</Text>
      <Text style={styles.vacancyDescription}>
        {item.description.length > 100
          ? `${item.description.substring(0, 100)}...`
          : item.description}
      </Text>
      <Text style={styles.vacancyDetails}>
        📍 Location: {item.location || "N/A"} | 🏡 Remote:{" "}
        {item.remote ? "Yes" : "No"}
      </Text>
      <Text style={styles.vacancyDetails}>
        ⏳ Duration: {item.minDuration || "N/A"} months
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Loading vacancies...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.goBackButton}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Vacancies</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateVacancy}
        >
          <MaterialIcons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={vacancies}
        keyExtractor={(item) => item.id}
        renderItem={renderVacancy}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>No vacancies found.</Text>
        }
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
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#007BFF",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  goBackButton: {
    backgroundColor: "#555",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  createButton: {
    backgroundColor: "#2ECC71",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  listContainer: {
    padding: 20,
  },
  vacancyCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vacancyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  vacancyDescription: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  vacancyDetails: {
    fontSize: 12,
    color: "#777",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
  },
  emptyMessage: {
    textAlign: "center",
    color: "#555",
    fontSize: 16,
    marginTop: 20,
  },
});

export default CompanyVacanciesScreen;
