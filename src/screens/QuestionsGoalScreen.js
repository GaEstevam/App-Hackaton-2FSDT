import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Questions } from "../components/Questions";
import Header from "../components/HeaderApp";
import { useTheme } from "native-base";
import Icon from "react-native-vector-icons/MaterialIcons";

const QuestionsGoalScreen = ({ route, navigation }) => {
  const { goalData } = route.params;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showFullSummary, setShowFullSummary] = useState(false);
  const theme = useTheme();

  const handleAnswer = (answer) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = answer;
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < goalData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      goalData.answers = updatedAnswers;
      navigation.navigate("GoalDefine", { ...goalData });
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const getLimitedSummary = (summary) => {
    const maxLength = 250; // Limite de caracteres para o resumo
    if (summary.length > maxLength && !showFullSummary) {
      return `${summary.substring(0, maxLength)}...`;
    }
    return summary;
  };

  return (
    <View style={styles.container}>
      <Header title="Questões" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Resumo da Meta</Text>
          <Text style={styles.summaryText}>
            {getLimitedSummary(goalData.summary)}
          </Text>
          {goalData.summary.length > 250 && (
            <TouchableOpacity
              onPress={() => setShowFullSummary(!showFullSummary)}
            >
              <Text style={styles.showMoreText}>
                {showFullSummary ? "Mostrar menos" : "Mostrar mais"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.formContainer}>
          <View style={styles.questionHeaderContainer}>
            {currentQuestionIndex > 0 && (
              <TouchableOpacity onPress={handleBack} style={styles.backIcon}>
                <Icon
                  name="arrow-back"
                  size={24}
                  color={theme.colors.gray[700]}
                />
              </TouchableOpacity>
            )}
            <Text style={styles.questionHeader}>
              Questão {currentQuestionIndex + 1} de {goalData.questions.length}
            </Text>
          </View>
          <Questions question={goalData.questions[currentQuestionIndex]} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.yesButton]}
              onPress={() => handleAnswer(true)}
            >
              <Text style={styles.buttonText}>Sim</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.noButton]}
              onPress={() => handleAnswer(false)}
            >
              <Text style={styles.buttonText}>Não</Text>
            </TouchableOpacity>
          </View>
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
  },
  summaryContainer: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 16,
    lineHeight: 24,
  },
  showMoreText: {
    color: "#6200EE",
    marginTop: 10,
    fontWeight: "bold",
  },
  formContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  questionHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
    justifyContent: "center",
  },
  backIcon: {
    position: "absolute",
    left: -80,
  },
  questionHeader: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    width: "40%",
    alignItems: "center",
  },
  yesButton: {
    backgroundColor: "#4CAF50",
  },
  noButton: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default QuestionsGoalScreen;
