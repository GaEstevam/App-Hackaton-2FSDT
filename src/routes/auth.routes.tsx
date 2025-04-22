import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "@screens/LoginScreen";
import SignupScreen from "@screens/SignupScreen";

const Stack = createStackNavigator();

const AuthRoutes = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
};

export default AuthRoutes;
