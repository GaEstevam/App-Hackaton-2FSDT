import React, { useContext, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { TokenContext } from "../hooks/TokenContext";
import Header from "../components/HeaderHome";

const HomeScreen = ({ navigation }) => {
  const { logout, user } = useContext(TokenContext);

  useEffect(() => {
    if (!user || !user.knowledge || user.knowledge.length === 0) {
      navigation.navigate("FinancialGoals");
    }
  }, [user, navigation]);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Você deseja sair da sua conta?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sim",
          onPress: () => {
            logout();
          },
        },
      ],
      { cancelable: false }
    );
  };

  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Header title="Fortuna" />
      <View style={styles.textContainer}>
        <Text style={styles.text}>Venha, vamos fazer uma fortuna juntos</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image source={require('../../assets/Planet.png')} style={styles.image} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  welcomeText: {
    fontSize: 18,
    color: "#fff",
  },
  welcomeBackText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  iconContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 50,
  },
  iconBox: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    margin: 15,
    borderWidth: 2,
    borderColor: "#9a67ea",
    borderRadius: 10,
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#9a67ea",
    textAlign: "center",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
});

export default HomeScreen;
