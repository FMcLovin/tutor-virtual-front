import { StatusBar } from "expo-status-bar";
import { View, Pressable } from "react-native";
import { router, Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { NativeWindStyleSheet } from "nativewind";
import { ChevronLeft } from "../../../components/icons/Icons";

NativeWindStyleSheet.setOutput({
  default: "native",
});

export default function Layout() {
  return (
    <SafeAreaProvider>
      <View className="flex-1">
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerShown: true,
            headerLeft: () => <GoBackButton />,
          }}
        >
          <Stack.Screen
            name="create"
            options={{
              title: "Crear Contenido",
            }}
          />
          <Stack.Screen
            name="[id]"
            options={{
              title: "Gestionar Contenido",
            }}
          />
        </Stack>
      </View>
    </SafeAreaProvider>
  );
}

function GoBackButton() {
  return (
    <Pressable className="ml-4" onPress={() => router.push("/manager")}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <ChevronLeft color="#475569" />
      </View>
    </Pressable>
  );
}
