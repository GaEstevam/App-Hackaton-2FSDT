import React from "react";
import { Spinner, Center, Text } from "native-base";
import { THEME } from "src/theme";

type LoadingProps = {
  title?: string;
  spinnerSize?: string | number;
};

export function Loading({ title, spinnerSize = "lg" }: LoadingProps) {

  return (
    <Center flex={1} width="100%" height="100%">
      <Spinner color={THEME.colors.purple[500]} size={spinnerSize} />
      {title && (
        <Text fontSize="xl" color={THEME.colors.purple[500]} mt={4}>
          {title}
        </Text>
      )}
    </Center>
  );
}
