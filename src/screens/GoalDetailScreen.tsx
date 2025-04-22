import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { TokenContext } from "../hooks/TokenContext";
import Header from "../components/HeaderApp";
import { Text, Divider, useTheme } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { List } from "react-native-paper";
import { Loading } from "../components/Loading";

export interface Step {
  step: number;
  description: string;
  actions: string[];
  timeline: string;
}

export interface Planning {
  objective?: string;
  steps?: Step[];
  resources?: { description: string; resource: string }[];
  savings_tips?: string[];
  contingency_plan?: string[];
  additional_income_sources?: string[];
  monitoring_adjustments?: string[];
  current_situation?: {
    expenses?: string;
    income: string;
    savings?: string;
  };
}

export interface Goal {
  id: string;
  name: string;
  patrimony: string;
  my_patrimony: string;
  monthly_aport: number;
  dividends: string;
  rate: string;
  status: boolean;
  time_desired: number;
  planning?: Planning;
  summary?: string;
}

type GoalDetailScreenProps = {
  route: {
    params: {
      goalId: string;
      updatedGoalData?: Goal;
    };
  };
  navigation: any;
};

const GoalDetailScreen: React.FC<GoalDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { goalId, updatedGoalData } = route.params;
  const { token } = useContext(TokenContext);
  const [goalData, setGoalData] = useState<Goal | null>(
    updatedGoalData || null
  );
  const [loading, setLoading] = useState(!updatedGoalData);
  const theme = useTheme();

  const fetchGoalData = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `https://fortuna-api.onrender.com/api/goals/${goalId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Error response data:", errorData);
        throw new Error("Failed to fetch goal data");
      }

      const data = await response.json();
      setGoalData(data[0]);
    } catch (error) {
      Alert.alert("Erro", "Falha ao buscar os dados da meta.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteGoal = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `https://fortuna-api.onrender.com/api/goals/${goalId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Error response data:", errorData);
        throw new Error("Failed to delete goal");
      }

      navigation.navigate("Metas");
    } catch (error) {
      Alert.alert("Erro", "Falha ao deletar a meta.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const finalizeGoal = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `https://fortuna-api.onrender.com/api/goals/finalize/${goalId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Error response data:", errorData);
        throw new Error("Failed to finalize goal");
      }

      fetchGoalData();
      Alert.alert("Sucesso", "Meta finalizada com sucesso.");
    } catch (error) {
      Alert.alert("Erro", "Falha ao finalizar a meta.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const reopenGoal = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `https://fortuna-api.onrender.com/api/goals/reopen/${goalId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Error response data:", errorData);
        throw new Error("Failed to reopen goal");
      }

      fetchGoalData();
      Alert.alert("Sucesso", "Meta reaberta com sucesso.");
    } catch (error) {
      Alert.alert("Erro", "Falha ao reabrir a meta.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!updatedGoalData) {
        fetchGoalData();
      }
    }, [goalId, token, updatedGoalData])
  );

  if (loading) {
    return <Loading title="Carregando detalhes da meta..." />;
  }

  if (!goalData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Erro ao carregar os dados do plano de ação.
        </Text>
      </View>
    );
  }

  const { planning, summary } = goalData;
  const timeRemaining = Number(goalData.time_desired).toFixed(1);

  const renderListItems = (items: string[]) => {
    return items.map((item, index) => (
      <Text key={index} style={styles.listItem}>
        * {item}
      </Text>
    ));
  };

  return (
    <View style={styles.container}>
      <Header title="Detalhes da Meta" onRefresh={fetchGoalData} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.metaContainer}>
          <Text style={styles.metaTitle}>{goalData.name}</Text>

          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Patrimônio:</Text>
            <Text style={styles.metaValue}>
              {goalData.patrimony && !isNaN(parseFloat(goalData.patrimony))
                ? `R$${parseFloat(goalData.patrimony).toFixed(2)}`
                : "R$0.00"}
            </Text>
          </View>

          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Meu Patrimônio:</Text>
            <Text style={styles.metaValue}>
              {goalData.my_patrimony && !isNaN(parseFloat(goalData.my_patrimony))
                ? `R$${parseFloat(goalData.my_patrimony).toFixed(2)}`
                : "R$0.00"}
            </Text>
          </View>

          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Aporte Mensal:</Text>
            <Text style={styles.metaValue}>
              {goalData.monthly_aport && !isNaN(goalData.monthly_aport)
                ? goalData.monthly_aport.toFixed(2)
                : "R$0.00"}
            </Text>
          </View>

          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Dividendos:</Text>
            <Text style={styles.metaValue}>
              {goalData.dividends && !isNaN(parseFloat(goalData.dividends))
                ? goalData.dividends
                : "N/A"}
            </Text>
          </View>

          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Rendimento:</Text>
            <Text style={styles.metaValue}>
              {goalData.rate && !isNaN(parseFloat(goalData.rate))
                ? goalData.rate
                : "N/A"}
            </Text>
          </View>

          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Status:</Text>
            <Text style={styles.metaValue}>
              {goalData.status ? "Concluída" : "Em Andamento"}
            </Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.highlightContainer}>
          <Text style={styles.highlightText}>
            Aporte Necessário:{" "}
            {goalData.monthly_aport && !isNaN(goalData.monthly_aport)
              ? goalData.monthly_aport.toFixed(2)
              : "R$0.00"}
          </Text>
          <Text style={styles.highlightText}>
            Tempo Estimado: {timeRemaining} anos
          </Text>
        </View>

        <View style={styles.transactionButtonContainer}>
          <TouchableOpacity
            style={styles.transactionButton}
            onPress={() =>
              navigation.navigate("TransactionScreen", { goalId: goalData.id })
            }
          >
            <MaterialIcons name="attach-money" size={24} color="#fff" />
            <Text style={styles.buttonText}>Realizar Depósito</Text>
          </TouchableOpacity>
        </View>

        {/* Outras partes do JSX */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 4,
  },
  AccordionColor: {
    backgroundColor: "#fff",
  },
  subtitle: {
    fontSize: 20,
    color: "#d3d3d3",
    marginBottom: 10,
    marginTop: 16,
    paddingHorizontal: 20,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    paddingHorizontal: 20,
  },
  stepContainer: {
    backgroundColor: "#f0edf2",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  stepTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  stepDetail: {
    fontSize: 14,
    marginBottom: 5,
  },
  listItem: {
    fontSize: 14,
    marginLeft: 20,
    marginBottom: 5,
  },
  topButtonContainer: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 20,
    alignItems: "center",
  },
  transactionButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 20,
  },
  transactionButton: {
    backgroundColor: "#9a67ea",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
  },
  finalizeButton: {
    backgroundColor: "#28a745",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
  },
  reopenButton: {
    backgroundColor: "#ffc107",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "space-between",
    padding: 20,
    alignItems: "center",
  },
  goalsButton: {
    backgroundColor: "#9a67ea",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "70%",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "20%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  divider: {
    marginVertical: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#9a67ea",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#e74c3c",
  },
  metaContainer: {
    justifyContent: "center",
    backgroundColor: "#d4d4d4",
    padding: 15,
    borderRadius: 16,
    marginBottom: 20,
    margin: 8,
  },
  metaTitle: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#442c50",
    marginVertical: 12,
  },
  metaItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  metaLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6c757d",
  },
  metaValue: {
    fontSize: 16,
    fontWeight: "400",
    color: "#343a40",
  },
  highlightContainer: {
    backgroundColor: "#ffeeba",
    padding: 10,
    borderRadius: 8,
    margin: 10,
    alignItems: "center",
  },
  highlightText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#856404",
  },
  resourceItem: {
    marginBottom: 10,
  },
  resourceText: {
    fontSize: 14,
    marginLeft: 20,
  },
  resourceLabel: {
    fontWeight: "bold",
  },
});

export default GoalDetailScreen;
