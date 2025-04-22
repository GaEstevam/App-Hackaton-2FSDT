import React, { useState, useContext, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { TokenContext } from "../hooks/TokenContext";
import Header from "../components/HeaderApp";
import { Loading } from "../components/Loading";
import { useFocusEffect } from "@react-navigation/native";
import { THEME } from "src/theme";

const ListMeta = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { token } = useContext(TokenContext);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://fortuna-api.onrender.com/api/goals",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        setError(true);
        setLoading(false);
        return;
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [token])
  );

  const getProgressColor = (progress) => {
    if (progress <= 0.25) return '#777'; // Cinza escuro
    if (progress <= 0.75) return '#ffc107'; // Amarelo
    return '#28a745'; // Verde
  };

  const renderGoal = ({ item }) => {
    const progress = item.patrimony > 0 ? item.my_patrimony / item.patrimony : 0;
    const progressColor = getProgressColor(progress);

    console.log(`Goal: ${item.name}, Progress: ${progress}`); // Debugging line

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("GoalDetail", { goalId: item.id })}
      >
        <View style={styles.goalContainer}>
          <Text style={styles.goalName}>{item.name}</Text>
          <View style={styles.goalDetails}>
            <Text style={styles.label}>Patrimônio Atual:</Text>
            <Text style={styles.value}>R${item.patrimony}</Text>
          </View>
          <View style={styles.goalDetails}>
            <Text style={styles.label}>Meu Patrimônio:</Text>
            <Text style={styles.value}>R${item.my_patrimony}</Text>
          </View>
          <View style={styles.goalDetails}>
            <Text style={styles.label}>Dividendos Atuais:</Text>
            <Text style={styles.value}>R${item.dividends}</Text>
          </View>
          <View style={styles.goalDetails}>
            <Text style={styles.label}>Aporte Mensal:</Text>
            <Text style={styles.value}>R${item.monthly_aport.toFixed(2)}</Text>
          </View>
          <View style={styles.goalDetails}>
            <Text style={styles.label}>Tempo Desejado:</Text>
            <Text style={styles.value}>{item.time_desired.toFixed(1)} anos</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${progress * 100}%`, backgroundColor: progressColor }]} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const handleCreateGoal = () => {
    navigation.navigate("GoalCreate");
  };

  return (
    <View style={styles.container}>
      <Header title="Lista da Meta" onRefresh={fetchData} />

      {loading ? (
        <Loading title="Carregando metas..." />
      ) : (
        <FlatList
          style={{
            marginTop: 10,
            width: "90%",
            alignContent: "center",
            marginLeft: 30,
          }}
          data={data}
          renderItem={renderGoal}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
      <TouchableOpacity style={styles.createButton} onPress={handleCreateGoal}>
        <Text style={styles.buttonText}>Criar Nova Meta</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: THEME.colors.background,
  },
  goalContainer: {
    backgroundColor: "#f0f0f0",
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  goalName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  goalDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6c757d",
  },
  value: {
    fontSize: 16,
    fontWeight: "400",
    color: "#343a40",
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginTop: 10,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
  },
  createButton: {
    backgroundColor: THEME.colors.purple[700],
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 20,
    width: "80%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ListMeta;
