import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { TokenContext } from "@hooks/TokenContext";
import { parse, format } from "date-fns";
import { THEME } from "src/theme";

const SignupScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthday, setBirthday] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const { setTokenAndUser } = useContext(TokenContext);

  const handleRegister = async () => {
    if (
      !name ||
      !email ||
      !confirmEmail ||
      !password ||
      !confirmPassword ||
      !birthday
    ) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }
    if (email !== confirmEmail) {
      setResponseMessage("Emails não coincidem.");
      Alert.alert("Erro", "Os emails não coincidem.");
      return;
    }
    if (password !== confirmPassword) {
      setResponseMessage("Senhas não coincidem.");
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    const parseBirthday = parse(birthday, "dd/MM/yyyy", new Date());
    const formattedBirthday = format(
      parseBirthday,
      "yyyy-MM-dd HH:mm:ss.SSSSSS"
    );

    setLoading(true);
    try {
      const registerResponse = await fetch(
        "https://fortuna-api.onrender.com/api/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email: email.toLowerCase(),
            password,
            birthday: formattedBirthday,
          }),
        }
      );

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        setResponseMessage(registerData.message || "Erro ao criar a conta.");
        setLoading(false);
        return;
      }

      // Aguarda 2 segundos para garantir que a conta seja criada no banco de dados
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const loginResponse = await fetch(
        "https://fortuna-api.onrender.com/api/sessions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.toLowerCase(),
            password,
          }),
        }
      );

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        setResponseMessage(
          loginData.message || "Falha ao autenticar após cadastro."
        );
        Alert.alert("Erro", "Falha ao autenticar após cadastro.");
        setLoading(false);
        return;
      }

      const token = loginData.token;
      setTokenAndUser(token, loginData.user);

      // Navegação para a tela FinancialGoals após o sucesso
      navigation.navigate("FinancialGoals");
    } catch (error) {
      console.error("Erro:", error);
      setResponseMessage("Ocorreu um erro.");
      Alert.alert("Erro", "Ocorreu um erro.");
    } finally {
      setLoading(false);
    }
  };

  const formatBirthday = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    let formatted = "";

    if (cleaned.length <= 2) {
      formatted = cleaned;
    } else if (cleaned.length <= 4) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    } else {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(
        2,
        4
      )}/${cleaned.slice(4, 8)}`;
    }

    setBirthday(formatted);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.headerText}>
          Crie sua conta,{" "}
          <Text style={styles.headerTextBold}>
            e aproveite nosso app. Estamos te esperando
          </Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Seu nome"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Seu email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirme seu email"
          value={confirmEmail}
          onChangeText={setConfirmEmail}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Sua senha"
            secureTextEntry={secureTextEntry}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setSecureTextEntry(!secureTextEntry)}
          >
            <MaterialIcons
              name={secureTextEntry ? "visibility-off" : "visibility"}
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirme sua senha"
            secureTextEntry={secureTextEntry}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            onPress={() => setSecureTextEntry(!secureTextEntry)}
          >
            <MaterialIcons
              name={secureTextEntry ? "visibility-off" : "visibility"}
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Data de nascimento (DD/MM/YYYY)"
          value={birthday}
          onChangeText={formatBirthday}
          maxLength={10}
          keyboardType="numeric"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Criar sua conta</Text>
          )}
        </TouchableOpacity>
        {responseMessage ? (
          <Text style={styles.responseMessage}>{responseMessage}</Text>
        ) : null}
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginText}>
            Você já tem uma conta?{" "}
            <Text style={styles.loginTextBold}>Logar!</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: THEME.colors.background[500],
  },
  formContainer: {
    padding: 20,
  },
  headerText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  headerTextBold: {
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  passwordInput: {
    flex: 1,
  },
  button: {
    backgroundColor: THEME.colors.purple[500],
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 20,
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
  loginText: {
    textAlign: "center",
    color: THEME.colors.gray[700],
  },
  loginTextBold: {
    color: THEME.colors.purple[500],
    fontWeight: "bold",
  },
});

export default SignupScreen;
