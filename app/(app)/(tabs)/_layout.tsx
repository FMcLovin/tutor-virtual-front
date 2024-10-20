import { Tabs } from "expo-router";
import {
  ChatIcon,
  AboutIcon,
  ClipBoard,
} from "../../../components/icons/Icons";
import { useSession } from "../../ctx";
import { Pressable, Text } from "react-native";
import { styled } from "nativewind";

const StyledPressable = styled(Pressable);

export default function TabLayout() {
  const { signOut } = useSession();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#059669",
        headerRight: () => (
          <StyledPressable
            onPress={signOut}
            className="p-2 rounded-lg bg-danger active:opacity-70 mr-4"
          >
            <Text className="text-white text-center font-bold">
              Cerrar sesión
            </Text>
          </StyledPressable>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Chat",
          tabBarIcon: ({ color }) => <ChatIcon size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <AboutIcon size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="manager"
        options={{
          title: "Contenido",
          tabBarIcon: ({ color }) => <ClipBoard size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
