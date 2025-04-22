import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import Slider from "@react-native-community/slider";
import { useFocusEffect } from "@react-navigation/native";
import { TokenContext } from "@hooks/TokenContext";
import { parseISO, format, parse } from "date-fns";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import Header from "@components/HeaderApp";
import Icon from "react-native-vector-icons/MaterialIcons";
import { THEME } from "src/theme";
import { Loading } from "@components/Loading";

const getInitials = (name) => {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("");
  return initials.substring(0, 2).toUpperCase();
};

const UserEditScreen = ({ navigation }) => {
  const { token, user: contextUser, updateUser } = useContext(TokenContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [birthday, setBirthday] = useState("");
  const [risk, setRisk] = useState(0);
  const [salary, setSalary] = useState("");
  const [variableIncome, setVariableIncome] = useState(0);
  const [fixedIncome, setFixedIncome] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  useFocusEffect(
    useCallback(() => {
      if (contextUser) {
        setName(contextUser.name || "");
        setEmail(contextUser.email || "");
        if (contextUser.birthday) {
          const parsedBirthday = parseISO(contextUser.birthday);
          setBirthday(format(parsedBirthday, "dd/MM/yyyy"));
        }
        setRisk(contextUser.risk ? contextUser.risk * 100 : 0);
        setSalary(contextUser.salary ? contextUser.salary.toString() : "");
        const knowledge = contextUser.knowledge || {};
        setVariableIncome(
          knowledge.variable_income
            ? parseFloat(knowledge.variable_income) * 100
            : 0
        );
        setFixedIncome(
          knowledge.fixed_income ? parseFloat(knowledge.fixed_income) * 100 : 0
        );
        setProfilePicture(contextUser.picture);
        if (contextUser.picture) {
          fetchProfileImage(contextUser.picture);
        }
        setLoading(false);
      } else {
        console.log("No user data available");
      }
    }, [contextUser])
  );

  const fetchProfileImage = async (picture) => {
    setImageLoading(true);
    try {
      const response = await fetch(
        `https://fortuna-api.onrender.com/api/files/${picture}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        setProfileImageUrl(response.url);
      } else {
        throw new Error("Failed to fetch profile image");
      }
    } catch (error) {
      console.error("Error fetching profile image:", error);
    } finally {
      setImageLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!name || !email || !birthday || !salary) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    if ((password && !oldPassword) || (!password && oldPassword)) {
      Alert.alert(
        "Erro",
        "Por favor, para trocar a senha precisa dizer a senha atual."
      );
      return;
    }

    try {
      const parseBirthday = parse(birthday, "dd/MM/yyyy", new Date());
      const formattedBirthday = format(
        parseBirthday,
        "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
      );

      setLoading(true);

      const payload = {
        id: contextUser.id,
        name,
        email,
        password,
        old_password: oldPassword,
        birthday: formattedBirthday,
        risk: risk / 100,
        salary,
        knowledge: {
          variable_income: variableIncome / 100,
          fixed_income: fixedIncome / 100,
        },
        picture: profilePicture,
      };

      const updateResponse = await fetch(
        `https://fortuna-api.onrender.com/api/users`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const responseText = await updateResponse.text();

      if (!updateResponse.ok) {
        setResponseMessage(responseText || "Failed to update.");
        setLoading(false);
        return;
      }

      const updateData = JSON.parse(responseText);

      // Atualizar usuário no contexto
      updateUser(updateData);

      setResponseMessage("Dados atualizados com sucesso.");

      navigation.navigate("Home");
    } catch (error) {
      console.error("Error updating user:", error);
      setResponseMessage("Ocorreu um erro.");
      Alert.alert("Erro", "Ocorreu um erro.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (uri) => {
    setImageLoading(true);
    const fileInfo = await FileSystem.getInfoAsync(uri);
    const fileExtension = uri.split(".").pop();
    const formData = new FormData();

    formData.append("picture", {
      uri,
      name: `profile-picture.${fileExtension}`,
      type: `image/${fileExtension}`,
    });

    try {
      const response = await fetch(
        "https://fortuna-api.onrender.com/api/users/picture",
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        }
      );

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(responseText || "Failed to upload image");
      }

      const data = JSON.parse(responseText);

      setProfilePicture(data.picture); // Assuming the response contains the updated picture name
      fetchProfileImage(data.picture); // Fetch the updated profile image
    } catch (error) {
      Alert.alert("Erro", "Falha ao enviar a imagem.");
      console.error(error);
    } finally {
      setImageLoading(false);
    }
  };

  const handleSelectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      const fileInfo = await FileSystem.getInfoAsync(uri);

      if (fileInfo.size / 1024 / 1024 > 10) {
        // Configura o limite máximo para 10 MB
        Alert.alert("Erro", "A imagem deve ter no máximo 10MB.");
        return;
      }

      await handleImageUpload(uri);
    }
  };

  const formatBirthday = (text) => {
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8A2BE2" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Minha conta" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <View style={styles.profileImageContainer}>
            {imageLoading ? (
              <ActivityIndicator size="large" color="#8A2BE2" />
            ) : profileImageUrl ? (
              <Image
                source={{
                  uri: profileImageUrl,
                }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.initialsContainer}>
                <Text style={styles.initialsText}>{getInitials(name)}</Text>
              </View>
            )}
            {!imageLoading && (
              <TouchableOpacity
                style={styles.imagePickerButton}
                onPress={handleSelectImage}
              >
                <Icon name="photo-camera" size={24} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
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
            placeholder="Senha antiga"
            value={oldPassword}
            onChangeText={setOldPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Data de nascimento (DD/MM/YYYY)"
            value={birthday}
            onChangeText={formatBirthday}
            maxLength={10}
            keyboardType="numeric"
          />
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
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.button}
        onPress={handleUpdate}
        disabled={loading}
      >
        {loading ? (
          <Loading title="Carregando..." />
        ) : (
          <Text style={styles.buttonText}>Atualizar</Text>
        )}
      </TouchableOpacity>
      {responseMessage ? (
        <Text style={styles.responseMessage}>{responseMessage}</Text>
      ) : null}
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
  formContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    width: "100%",
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
  sectionContainer: {
    width: "100%",
    backgroundColor: THEME.colors.gray[100],
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  slider: {
    width: "100%",
    height: 40,
    marginBottom: 10,
  },
  percentage: {
    fontSize: 16,
    color: "#000",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#8A2BE2",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    marginHorizontal: "auto",
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#8A2BE2",
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 20,
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
  },
  initialsContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  initialsText: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "bold",
  },
  imagePickerButton: {
    backgroundColor: "#8A2BE2",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 50,
    position: "absolute",
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default UserEditScreen;
