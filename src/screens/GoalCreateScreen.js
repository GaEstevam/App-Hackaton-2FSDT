import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { TokenContext } from "../hooks/TokenContext";
import Header from "../components/HeaderApp";
import { useTheme } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { AppError } from "@utils/appError";
import { Loading } from "@components/Loading";

const GoalCreateScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [typeGoal, setTypeGoal] = useState(false);
  const [patrimony, setPatrimony] = useState(0);
  const [initialPatrimony, setInitialPatrimony] = useState(0);
  const [timeDesired, setTimeDesired] = useState(0); // anos
  const [monthlyAport, setMonthlyAport] = useState(0);
  const [rate, setRate] = useState(0.01);
  const [dividends, setDividends] = useState(0);
  const [timeOrAport, setTimeOrAport] = useState(false); // Novo switch
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useContext(TokenContext);
  const theme = useTheme();

  const handleSubmit = async () => {
    const goalData = {
      name,
      patrimony: typeGoal ? 0 : patrimony,
      dividends: typeGoal ? dividends : 0,
      type_goal: typeGoal,
      initial_patrimony: initialPatrimony,
      time_desired: timeOrAport ? timeDesired : 0,
      monthly_aport: timeOrAport ? 0 : monthlyAport,
      rate: rate,
    };

    setLoading(true);

    try {
      const responsePreview = await fetch(
        "https://fortuna-api.onrender.com/api/goals/preview",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(goalData),
        }
      );

      if (responsePreview.ok) {
        const resultPreview = await responsePreview.json();
        setResponseMessage(JSON.stringify(resultPreview, null, 2));

        const responseAnalyze = await fetch(
          "https://fortuna-api.onrender.com/api/gemini/analyze",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(resultPreview),
          }
        );

        if (responseAnalyze.ok) {
          const resultAnalyze = await responseAnalyze.json();
          navigation.navigate("QuestionsGoal", { goalData: resultAnalyze });
        } else {
          const errorAnalyze = await responseAnalyze.json();
          throw new AppError(
            errorAnalyze.message || "Falha ao analisar os dados da meta."
          );
        }
      } else {
        const errorPreview = await responsePreview.json();
        throw new AppError(
          errorPreview.message || "Falha ao enviar os dados da meta."
        );
      }
    } catch (error) {
      setResponseMessage(
        error instanceof AppError
          ? error.message
          : "Ocorreu um erro ao enviar os dados da meta."
      );
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header title="Criar Meta" />
      <ScrollView contentContainerStyle={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Loading title="Analisando meta..." />
          </View>
        ) : (
          <>
            <Text style={styles.label}>Nome:</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="label-outline" size={20} color="#9a67ea" />
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Digite o nome da meta"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.switchContainer}>
              <Text style={styles.label}>Tipo de Meta:</Text>
              <Switch
                value={typeGoal}
                onValueChange={setTypeGoal}
                thumbColor={typeGoal ? "#cbb3f7" : "#cfcfcf"} // Cores mais claras para a bolinha
                trackColor={{
                  false: "#82778c",
                  true: theme.colors.purple[500],
                }}
                ios_backgroundColor="#82778c"
              />
            </View>

            {!typeGoal && (
              <>
                <Text style={styles.label}>Patrimônio:</Text>
                <View style={styles.inputContainer}>
                  <MaterialIcons
                    name="attach-money"
                    size={20}
                    color="#9a67ea"
                  />
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={String(patrimony)}
                    onChangeText={(text) => setPatrimony(Number(text))}
                    placeholder="Digite o valor do patrimônio"
                    placeholderTextColor="#999"
                  />
                </View>
              </>
            )}

            {typeGoal && (
              <>
                <Text style={styles.label}>Dividendos:</Text>
                <View style={styles.inputContainer}>
                  <MaterialIcons name="money" size={20} color="#9a67ea" />
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={String(dividends)}
                    onChangeText={(text) => setDividends(Number(text))}
                    placeholder="Digite o valor dos dividendos"
                    placeholderTextColor="#999"
                  />
                </View>
              </>
            )}

            <Text style={styles.label}>Patrimônio Inicial:</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="account-balance" size={20} color="#9a67ea" />
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={String(initialPatrimony)}
                onChangeText={(text) => setInitialPatrimony(Number(text))}
                placeholder="Digite o patrimônio inicial"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.switchContainer}>
              <Text style={styles.label}>Aporte ou Tempo:</Text>
              <Switch
                value={timeOrAport}
                onValueChange={setTimeOrAport}
                thumbColor={timeOrAport ? "#cbb3f7" : "#cfcfcf"} // Cores mais claras para a bolinha
                trackColor={{
                  false: "#82778c",
                  true: theme.colors.purple[500],
                }}
                ios_backgroundColor="#82778c"
              />
            </View>

            {timeOrAport ? (
              <>
                <Text style={styles.label}>Tempo Desejado (anos):</Text>
                <View style={styles.inputContainer}>
                  <MaterialIcons name="timer" size={20} color="#9a67ea" />
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={String(timeDesired)}
                    onChangeText={(text) => setTimeDesired(Number(text))}
                    placeholder="Digite o tempo desejado (anos)"
                    placeholderTextColor="#999"
                  />
                </View>
              </>
            ) : (
              <>
                <Text style={styles.label}>Aporte Mensal:</Text>
                <View style={styles.inputContainer}>
                  <MaterialIcons
                    name="calendar-today"
                    size={20}
                    color="#9a67ea"
                  />
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={String(monthlyAport)}
                    onChangeText={(text) => setMonthlyAport(Number(text))}
                    placeholder="Digite o aporte mensal"
                    placeholderTextColor="#999"
                  />
                </View>
              </>
            )}

            <Text style={styles.label}>Taxa:</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="percent" size={20} color="#9a67ea" />
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={String(rate)}
                onChangeText={(text) => setRate(Number(text))}
                placeholder="Digite a taxa"
                placeholderTextColor="#999"
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Enviar</Text>
            </TouchableOpacity>
            {responseMessage ? (
              <View style={styles.responseContainer}>
                <Text style={styles.responseLabel}>Resposta:</Text>
                <Text style={styles.responseText}>{responseMessage}</Text>
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  label: {
    marginVertical: 8,
    fontWeight: "bold",
    marginRight: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#9a67ea",
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 8,
    color: "#333",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
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
  button: {
    backgroundColor: "#9a67ea",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  responseContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  responseLabel: {
    fontWeight: "bold",
  },
  responseText: {
    marginTop: 5,
    color: "#333",
  },
});

export default GoalCreateScreen;
