import "react-native-gesture-handler";
import React from "react";
import { NativeBaseProvider } from "native-base";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "styled-components";
import { THEME } from "./src/theme";
import { TokenProvider } from "@hooks/TokenContext";
import Routes from "./src/routes";
import { ActivityIndicator, StatusBar } from "react-native";
import { Loading } from "@components/Loading";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";

const App = () => {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });
  return (
    <TokenProvider>
      <NativeBaseProvider>
        <ThemeProvider theme={THEME}>
          <SafeAreaProvider>
            {fontsLoaded ? <Routes /> : <Loading />}
            <StatusBar
              barStyle="light-content"
              backgroundColor="transparent"
              translucent
            />
          </SafeAreaProvider>
        </ThemeProvider>
      </NativeBaseProvider>
    </TokenProvider>
  );
};

export default App;
