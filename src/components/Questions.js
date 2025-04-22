import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const Questions = ({ question }) => {
  return (
    <View style={styles.questionContainer}>
      <Text style={styles.questionText}>{question}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    textAlign: "center",
  },
});
