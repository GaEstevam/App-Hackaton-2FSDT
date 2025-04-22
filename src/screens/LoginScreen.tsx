import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { TokenContext } from "@hooks/TokenContext";
import { AppError } from "@utils/appError";
import { THEME } from "src/theme";

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { token, setTokenAndUser } = useContext(TokenContext);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const authResponse = await fetch(
        "https://fortuna-api.onrender.com/api/sessions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const responseText = await authResponse.text();

      if (!authResponse.ok) {
        setResponseMessage(`Erro ${authResponse.status}: ${responseText}`);
        Alert.alert("Erro", `Falha ao autenticar. ${responseText}`);
        setLoading(false);
        return;
      }

      const authData = JSON.parse(responseText);
      const token = authData.token;
      const userData = authData.user;
      setTokenAndUser(token, userData);
      setResponseMessage("Login realizado com sucesso.");
    } catch (error: unknown) {
      const appError =
        error instanceof AppError
          ? error
          : new AppError("Ocorreu um erro desconhecido.");
      console.error("Login Error:", appError.message);
      setResponseMessage(`Erro: ${appError.message}`);
      Alert.alert("Erro", `Ocorreu um erro: ${appError.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      navigation.navigate("Home");
    }
  }, [token, navigation]);

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/logo.png")} style={styles.logo} />
      <Text style={styles.tagline}>Vamos fazer fortuna</Text>
      <Text style={styles.appName}>Fortuna</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator size="large" color="#9a67ea" />}
      {responseMessage && (
        <Text style={styles.responseMessage}>{responseMessage}</Text>
      )}
      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.createAccountText}>
          Você não tem uma conta? Crie agora!
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background[500],
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  tagline: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  appName: {
    fontSize: 32,
    color: THEME.colors.gray[700],
    fontWeight: "bold",
    marginBottom: 40,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: THEME.colors.purple[500],
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  createAccountText: {
    color: "#9a67ea",
    marginTop: 20,
  },
  responseMessage: {
    color: "#ff0000",
    marginTop: 20,
    textAlign: "center",
  },
});

export default LoginScreen;
