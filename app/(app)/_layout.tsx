import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { NativeWindStyleSheet } from "nativewind";

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
            headerShown: false,
          }}
        />
      </View>
    </SafeAreaProvider>
  );
}
