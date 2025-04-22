import React, { useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { HStack, Text, Icon } from "native-base";
import { TouchableOpacity } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { TokenContext } from "../hooks/TokenContext";
import { MaterialIcons } from "@expo/vector-icons";
import { THEME } from "src/theme";

type HeaderProps = {
  title: string;
  onRefresh?: () => void;
};

const Header: React.FC<HeaderProps> = ({ title, onRefresh }) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { token } = useContext(TokenContext);

  return (
    <SafeAreaView
      style={{
        backgroundColor: THEME.colors.purple[700],
        width: "100%",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      }}
    >
      <HStack
        alignItems="center"
        justifyContent="space-between"
        height={12}
        px={4}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            as={MaterialIcons}
            name="arrow-back"
            color={THEME.colors.white}
            size={7}
          />
        </TouchableOpacity>
        <Text
          color={THEME.colors.white}
          fontSize="xl"
          fontWeight="bold"
          flex={1}
          textAlign="center"
        >
          {title}
        </Text>
        {onRefresh && (
          <TouchableOpacity onPress={onRefresh}>
            <Icon
              as={MaterialIcons}
              name="refresh"
              color={THEME.colors.white}
              size={7}
            />
          </TouchableOpacity>
        )}
      </HStack>
    </SafeAreaView>
  );
};

export default Header;
