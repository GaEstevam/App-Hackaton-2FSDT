import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { TokenContext } from "../hooks/TokenContext";
import Header from "../components/HeaderApp";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useTheme } from "native-base";
import { THEME } from "src/theme";

const GoalDefineScreen = ({ route, navigation }) => {
  const initialGoalData = route.params;
  const [goalData, setGoalData] = useState(initialGoalData);
  const [loading, setLoading] = useState(true);
  const [showFullSummary, setShowFullSummary] = useState(false);
  const { token } = useContext(TokenContext);
  const theme = useTheme();

  useEffect(() => {
    const fetchGoalData = async () => {
      try {
        const response = await fetch(
          "https://fortuna-api.onrender.com/api/gemini/define",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(initialGoalData),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch goal data");
        }

        const data = await response.json();
        setGoalData(data);
      } catch (error) {
        Alert.alert("Erro", "Falha ao definir a meta.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoalData();
  }, [initialGoalData]);

  const handleCreateGoal = async () => {
    try {
      const dataToSend = { ...goalData };
      if (goalData.monthly_aport) {
        delete dataToSend.monthly_aport;
      }

      const response = await fetch(
        "https://fortuna-api.onrender.com/api/goals",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dataToSend),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error data:", errorData);
        throw new Error(errorData.message || "Failed to create goal");
      }

      const createdGoal = await response.json();

      const goalId = createdGoal.goal_id.id; // Extraindo o ID da meta criada
      navigation.navigate("GoalCreatePlan", { goalId });
    } catch (error) {
      Alert.alert("Erro", error.message || "Falha ao criar a meta.");
      console.error("Fetch error:", error);
    }
  };

  const handleRewriteGoal = () => {
    navigation.navigate("GoalCreate", goalData);
  };

  const getLimitedSummary = (summary) => {
    const maxLength = 250; // Limite de caracteres para o resumo
    if (summary.length > maxLength && !showFullSummary) {
      return `${summary.substring(0, maxLength)}...`;
    }
    return summary;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={THEME.colors.purple[500]} />
        <Text style={styles.loadingText}>Definindo meta...</Text>
      </View>
    );
  }

  return (
<View style={styles.container}>
  <Header title="Definir Meta" />
  <ScrollView contentContainerStyle={styles.scrollContainer}>
    <Text style={styles.title}>Resumo da Meta</Text>

    {/* Exibindo os detalhes da meta */}
    <View style={styles.detailContainer}>
      <View style={styles.labelContainer}>
        <Icon name="label" size={20} />
        <Text style={styles.label}>Nome:</Text>
      </View>
      <Text style={styles.value}>{goalData.name}</Text>
    </View>

    <View style={styles.detailContainer}>
      <View style={styles.labelContainer}>
        <Icon name="category" size={20} />
        <Text style={styles.label}>Tipo de Meta:</Text>
      </View>
      <Text style={styles.value}>
        {goalData.type_goal ? "Dividendo" : "Patrimônio"}
      </Text>
    </View>

    {/* Patrimônio Desejado */}
    <View style={styles.detailContainer}>
      <View style={styles.labelContainer}>
        <Icon name="attach-money" size={20} />
        <Text style={styles.label}>Patrimônio Desejado:</Text>
      </View>
      <Text style={styles.value}>
        {
          (() => {
            // Log para depuração
            console.log('Valor de goalData.patrimony:', goalData.patrimony);

            // Tentando forçar goalData.patrimony para número
            const patrimony = parseFloat(goalData.patrimony);

            // Verificando se o valor é um número válido
            if (isNaN(patrimony)) {
              return "N/A";  // Exibe "N/A" caso não seja número válido
            }

            // Retorna o valor formatado com duas casas decimais
            return patrimony.toFixed(2);
          })()
        }
      </Text>
    </View>

    {/* Dividendos */}
    <View style={styles.detailContainer}>
      <View style={styles.labelContainer}>
        <Icon name="trending-up" size={20} />
        <Text style={styles.label}>Dividendos:</Text>
      </View>
      <Text style={styles.value}>
        {
          isNaN(goalData.dividends) ? "N/A" : goalData.dividends.toFixed(2)
        }
      </Text>
    </View>

    {/* Meu Patrimônio */}
    <View style={styles.detailContainer}>
      <View style={styles.labelContainer}>
        <Icon name="account-balance" size={20} />
        <Text style={styles.label}>Meu Patrimônio:</Text>
      </View>
      <Text style={styles.value}>
        {
          (() => {
            // Log para depuração
            console.log('Valor de goalData.my_patrimony:', goalData.my_patrimony);

            // Tentando forçar goalData.my_patrimony para número
            const myPatrimony = parseFloat(goalData.my_patrimony);

            // Verificando se o valor é um número válido
            if (isNaN(myPatrimony)) {
              return "N/A";  // Exibe "N/A" caso não seja número válido
            }

            // Retorna o valor formatado com duas casas decimais
            return myPatrimony.toFixed(2);
          })()
        }
      </Text>
    </View>

    {/* Taxa */}
    <View style={styles.detailContainer}>
      <View style={styles.labelContainer}>
        <Icon name="show-chart" size={20} />
        <Text style={styles.label}>Taxa:</Text>
      </View>
      <Text style={styles.value}>
        {
          isNaN(goalData.rate) ? "N/A" : (goalData.rate * 100).toFixed(2)
        }%
      </Text>
    </View>

    {/* Tempo Desejado */}
    <View style={styles.detailContainer}>
      <View style={styles.labelContainer}>
        <Icon name="access-time" size={20} />
        <Text style={styles.label}>Tempo Desejado (anos):</Text>
      </View>
      <Text style={styles.value}>
        {
          (() => {
            // Log para depuração
            console.log('Valor de goalData.time_desired:', goalData.time_desired);

            // Tentando forçar goalData.time_desired para número
            const timeDesired = parseFloat(goalData.time_desired);

            // Verificando se o valor é um número válido
            if (isNaN(timeDesired)) {
              return "N/A";  // Exibe "N/A" caso não seja número válido
            }

            // Retorna o valor formatado com duas casas decimais
            return timeDesired.toFixed(2);
          })()
        }
      </Text>
    </View>

  </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.createButton]}
          onPress={handleCreateGoal}
        >
          <Text style={styles.buttonText}>Criar Meta</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.rewriteButton]}
          onPress={handleRewriteGoal}
        >
          <Text style={styles.buttonText}>Reescrever</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  detailContainer: {
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
    marginLeft: 5,
  },
  value: {
    fontSize: 16,
  },
  summaryContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  summary: {
    fontSize: 16,
    lineHeight: 24,
  },
  showMoreText: {
    color: "#6200EE",
    marginTop: 10,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    width: "40%",
    alignItems: "center",
  },
  createButton: {
    backgroundColor: "#4CAF50",
  },
  rewriteButton: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: THEME.colors.purple[500],
  },
});

export default GoalDefineScreen;
