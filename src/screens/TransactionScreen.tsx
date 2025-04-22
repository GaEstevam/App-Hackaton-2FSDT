import React, { useEffect, useState, useContext } from "react";
import {
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Switch,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { TokenContext } from "../hooks/TokenContext";
import Header from "../components/HeaderApp";
import { Text, Divider, useTheme } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { Loading } from "../components/Loading";
import { THEME } from "src/theme";

export interface Goal {
  id: string;
  name: string;
  patrimony: string;
  my_patrimony: string;
  monthly_aport: string;
  dividends: string;
  rate: string;
  status: boolean;
}

type TransactionScreenProps = {
  route: {
    params: {
      goalId: string;
    };
  };
  navigation: any;
};

const TransactionScreen: React.FC<TransactionScreenProps> = ({
  route,
  navigation,
}) => {
  const { goalId } = route.params;
  const { token } = useContext(TokenContext);
  const [goalData, setGoalData] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [aport, setAport] = useState("");
  const [aportType, setAportType] = useState(true);
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

  const handleTransaction = async () => {
    try {
      setLoading(true);

      const body = {
        aport: parseFloat(aport),
        aport_type: aportType,
        goal_id: goalData?.id,
      };

      const response = await fetch(
        `https://fortuna-api.onrender.com/api/goals/transaction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Error response data:", errorData);
        throw new Error("Failed to create transaction");
      }

      const data = await response.json();

      navigation.navigate("GoalDetail", {
        goalId: goalData?.id,
        updatedGoalData: data.goal,
      });
    } catch (error) {
      Alert.alert("Erro", "Falha ao realizar a transação.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchGoalData();
    }, [goalId, token])
  );

  if (loading) {
    return <Loading title="Carregando detalhes da meta..." />;
  }

  if (!goalData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erro ao carregar os dados da meta.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Transações da Meta" onRefresh={fetchGoalData} />
      <ScrollView>
        <View style={styles.metaContainer}>
          <Text style={styles.metaTitle}>{goalData.name}</Text>

          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Patrimônio:</Text>
            <Text style={styles.metaValue}>{goalData.patrimony}</Text>
          </View>

          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Meu Patrimônio:</Text>
            <Text style={styles.metaValue}>{goalData.my_patrimony}</Text>
          </View>

          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Aporte Mensal:</Text>
            <Text style={styles.metaValue}>{goalData.monthly_aport}</Text>
          </View>

          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Dividendos:</Text>
            <Text style={styles.metaValue}>{goalData.dividends}</Text>
          </View>

          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Rendimento:</Text>
            <Text style={styles.metaValue}>{goalData.rate}</Text>
          </View>

          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Status:</Text>
            <Text style={styles.metaValue}>
              {goalData.status ? "Concluída" : "Em Andamento"}
            </Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Valor do Aporte"
            value={aport}
            onChangeText={setAport}
            keyboardType="numeric"
          />
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>
              {aportType ? "Adicionar Dinheiro" : "Retirar Dinheiro"}
            </Text>
            <Switch
              value={aportType}
              onValueChange={setAportType}
              thumbColor={aportType ? "#cbb3f7" : "#cfcfcf"} // Cores mais claras para a bolinha
              trackColor={{ false: "#82778c", true: theme.colors.purple[500] }}
              ios_backgroundColor="#82778c"
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleTransaction}
          >
            <MaterialIcons name="send" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background[500],
    marginTop: 4,
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
  divider: {
    marginVertical: 10,
  },
  formContainer: {
    margin: 8,
    padding: 15,
    backgroundColor: "#f0edf2",
    borderRadius: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  switchLabel: {
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: THEME.colors.purple[500],
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 20,
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
});

export default TransactionScreen;
