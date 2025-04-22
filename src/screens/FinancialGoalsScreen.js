import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Slider from "@react-native-community/slider";
import Icon from "react-native-vector-icons/MaterialIcons";
import { TokenContext } from "../hooks/TokenContext";
import { THEME } from "src/theme";

const FinancialGoalsScreen = ({ navigation }) => {
  const [risk, setRisk] = useState(0);
  const [salary, setSalary] = useState("");
  const [variableIncome, setVariableIncome] = useState(0);
  const [fixedIncome, setFixedIncome] = useState(0);
  const { token, user, updateUser } = useContext(TokenContext);
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const handleConfirm = async () => {
    const payload = {
      risk: risk / 100,
      salary,
      knowledge: {
        variable_income: variableIncome / 100,
        fixed_income: fixedIncome / 100,
      },
    };

    setLoading(true);

    try {
      const response = await fetch(
        "https://fortuna-api.onrender.com/api/users/profile/",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const data = await response.json();
        updateUser({ ...user, ...payload });
        navigation.navigate("Home");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro na resposta do servidor");
      }
    } catch (error) {
      console.error("Error:", error.message);
      Alert.alert("Erro", `Falha ao enviar informações: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <View style={styles.sectionContainer}>
            <Text style={styles.label}>
              <Icon name="security" size={20} color="#8A2BE2" /> Risco
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              step={1}
              value={risk}
              onValueChange={setRisk}
              minimumTrackTintColor="#9a67ea"
              maximumTrackTintColor="#ccc"
              thumbTintColor="#9a67ea"
            />
            <Text style={styles.percentage}>{risk.toFixed(0)}%</Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.label}>
              <Icon name="attach-money" size={20} color="#8A2BE2" /> Salário
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Salário"
              value={salary}
              onChangeText={setSalary}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.label}>
              <Icon name="school" size={20} color="#8A2BE2" /> Conhecimento em:
            </Text>
            <Text style={styles.subLabel}>Renda Variável</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              step={1}
              value={variableIncome}
              onValueChange={setVariableIncome}
              minimumTrackTintColor="#9a67ea"
              maximumTrackTintColor="#ccc"
              thumbTintColor="#9a67ea"
            />
            <Text style={styles.percentage}>{variableIncome.toFixed(0)}%</Text>
            <Text style={styles.subLabel}>Renda Fixa</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              step={1}
              value={fixedIncome}
              onValueChange={setFixedIncome}
              minimumTrackTintColor="#9a67ea"
              maximumTrackTintColor="#ccc"
              thumbTintColor="#9a67ea"
            />
            <Text style={styles.percentage}>{fixedIncome.toFixed(0)}%</Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={handleConfirm}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Confirmar</Text>
            )}
          </TouchableOpacity>
          {responseMessage ? (
            <Text style={styles.responseMessage}>{responseMessage}</Text>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  formContainer: {
    alignItems: "center",
  },
  sectionContainer: {
    width: "100%",
    backgroundColor: THEME.colors.gray[100],
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: "#000",
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  subLabel: {
    fontSize: 16,
    color: "#000",
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    width: "100%",
    backgroundColor: "#fff",
  },
  slider: {
    width: "100%",
    height: 40,
    marginBottom: 10,
  },
  percentage: {
    fontSize: 16,
    color: "#000",
    textAlign: "right",
  },
  button: {
    backgroundColor: "#8A2BE2",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    width: 200,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  responseMessage: {
    textAlign: "center",
    color: "red",
    marginBottom: 20,
  },
});

export default FinancialGoalsScreen;
