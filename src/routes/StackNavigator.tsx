import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import HomeScreen from "@screens/HomeScreen";
import ListMeta from "@screens/ListMeta";
import UserEditScreen from "@screens/UserEditScreen";
import GoalDetailScreen from "@screens/GoalDetailScreen";
import GoalCreateScreen from "@screens/GoalCreateScreen";
import GoalDefineScreen from "@screens/GoalDefineScreen";
import QuestionsGoalScreen from "@screens/QuestionsGoalScreen";
import TransactionScreen from "@screens/TransactionScreen";
import GoalCreatePlanScreen from "@screens/GoalCreatePlanScreen";
import FinancialGoalsScreen from "@screens/FinancialGoalsScreen";
import AppRoutes from "./app.routes";

const Stack = createStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={AppRoutes} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ListMeta" component={ListMeta} />
      <Stack.Screen name="Profile" component={UserEditScreen} />
      <Stack.Screen name="GoalDetail" component={GoalDetailScreen} />
      <Stack.Screen name="GoalCreate" component={GoalCreateScreen} />
      <Stack.Screen name="GoalDefine" component={GoalDefineScreen} />
      <Stack.Screen name="QuestionsGoal" component={QuestionsGoalScreen} />
      <Stack.Screen name="TransactionScreen" component={TransactionScreen} />
      <Stack.Screen name="GoalCreatePlan" component={GoalCreatePlanScreen} />
      <Stack.Screen name="FinancialGoals" component={FinancialGoalsScreen} />
      <Stack.Screen name="UserEdit" component={UserEditScreen} />
    </Stack.Navigator>
  );
};

export default AppStack;
