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
            <Text style={styles.metaValue}>{goalData.patrimony}</Text>
          </View>

          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Meu Patrimônio:</Text>
            <Text style={styles.metaValue}>{goalData.my_patrimony}</Text>
          </View>

          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Aporte Mensal:</Text>
            <Text style={styles.metaValue}>
              {goalData.monthly_aport.toFixed(2)}
            </Text>
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

        <View style={styles.highlightContainer}>
          <Text style={styles.highlightText}>
            Aporte Necessário: R$ {goalData.monthly_aport.toFixed(2)}
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

        {planning?.objective && (
          <>
            <List.Accordion
              style={styles.AccordionColor}
              title="Objetivo"
              left={(props) => <List.Icon {...props} icon="target" />}
            >
              <Text style={styles.text}>{planning.objective}</Text>
            </List.Accordion>
            <Divider style={styles.divider} />
          </>
        )}

        {summary && (
          <>
            <List.Accordion
              style={styles.AccordionColor}
              title="Resumo"
              left={(props) => (
                <List.Icon {...props} icon="file-document-outline" />
              )}
            >
              <Text style={styles.text}>{summary}</Text>
            </List.Accordion>
            <Divider style={styles.divider} />
          </>
        )}

        {planning?.steps && planning.steps.length > 0 && (
          <>
            <List.Accordion
              style={styles.AccordionColor}
              title="Passos"
              left={(props) => (
                <List.Icon {...props} icon="format-list-numbered" />
              )}
            >
              {planning.steps.map((step, index) => (
                <View key={index} style={styles.stepContainer}>
                  <Text style={styles.stepTitle}>
                    Passo {step.step}: {step.description}
                  </Text>
                  <Text style={styles.stepDetail}>Prazo: {step.timeline}</Text>
                  <Text style={styles.stepDetail}>Ações:</Text>
                  {step.actions && renderListItems(step.actions)}
                </View>
              ))}
            </List.Accordion>
            <Divider style={styles.divider} />
          </>
        )}

        {planning?.resources && planning.resources.length > 0 && (
          <>
            <List.Accordion
              style={styles.AccordionColor}
              title="Recursos"
              left={(props) => <List.Icon {...props} icon="book" />}
            >
              {planning.resources.map((resource, index) => (
                <View key={index} style={styles.resourceItem}>
                  <Text style={styles.resourceText}>
                    <Text style={styles.resourceLabel}>Descrição:</Text>{" "}
                    {resource.description}
                  </Text>
                  <Text style={styles.resourceText}>
                    <Text style={styles.resourceLabel}>Recurso:</Text>{" "}
                    {resource.resource}
                  </Text>
                </View>
              ))}
            </List.Accordion>
            <Divider style={styles.divider} />
          </>
        )}

        {planning?.savings_tips && planning.savings_tips.length > 0 && (
          <>
            <List.Accordion
              style={styles.AccordionColor}
              title="Dicas de Poupança"
              left={(props) => <List.Icon {...props} icon="lightbulb" />}
            >
              {planning.savings_tips && renderListItems(planning.savings_tips)}
            </List.Accordion>
            <Divider style={styles.divider} />
          </>
        )}

        {planning?.contingency_plan && planning.contingency_plan.length > 0 && (
          <>
            <List.Accordion
              style={styles.AccordionColor}
              title="Plano de Contingência"
              left={(props) => <List.Icon {...props} icon="alert" />}
            >
              {planning.contingency_plan &&
                renderListItems(planning.contingency_plan)}
            </List.Accordion>
            <Divider style={styles.divider} />
          </>
        )}

        {planning?.additional_income_sources &&
          planning.additional_income_sources.length > 0 && (
            <>
              <List.Accordion
                style={styles.AccordionColor}
                title="Fontes de Renda Adicional"
                left={(props) => <List.Icon {...props} icon="cash-multiple" />}
              >
                {planning.additional_income_sources &&
                  renderListItems(planning.additional_income_sources)}
              </List.Accordion>
              <Divider style={styles.divider} />
            </>
          )}

        {planning?.monitoring_adjustments &&
          planning.monitoring_adjustments.length > 0 && (
            <>
              <List.Accordion
                style={styles.AccordionColor}
                title="Ajustes de Monitoramento"
                left={(props) => <List.Icon {...props} icon="adjust" />}
              >
                {planning.monitoring_adjustments &&
                  renderListItems(planning.monitoring_adjustments)}
              </List.Accordion>
            </>
          )}

        {planning?.current_situation && (
          <>
            <List.Accordion
              style={styles.AccordionColor}
              title="Situação Atual"
              left={(props) => <List.Icon {...props} icon="information" />}
            >
              <Text style={styles.text}>
                Despesas:{" "}
                {planning.current_situation.expenses
                  ? planning.current_situation.expenses
                  : "N/A"}
              </Text>
              <Text style={styles.text}>
                Renda: {planning.current_situation.income}
              </Text>
              <Text style={styles.text}>
                Poupança:{" "}
                {planning.current_situation.savings
                  ? planning.current_situation.savings
                  : "N/A"}
              </Text>
            </List.Accordion>
            <Divider style={styles.divider} />
          </>
        )}

        <View style={styles.topButtonContainer}>
          <TouchableOpacity
            style={styles.goalsButton}
            onPress={() => navigation.navigate("Metas")}
          >
            <Text style={styles.buttonText}>Ir para Minhas Metas</Text>
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.deleteButton} onPress={deleteGoal}>
              <MaterialIcons name="delete" size={24} color="#fff" />
            </TouchableOpacity>
            {goalData.status ? (
              <TouchableOpacity
                style={styles.reopenButton}
                onPress={reopenGoal}
              >
                <MaterialIcons name="replay" size={24} color="#fff" />
                <Text style={styles.buttonText}>Reabrir Meta</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.finalizeButton}
                onPress={finalizeGoal}
              >
                <MaterialIcons name="check" size={24} color="#fff" />
                <Text style={styles.buttonText}>Finalizar Meta</Text>
              </TouchableOpacity>
            )}
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
