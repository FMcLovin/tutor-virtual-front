import { Tabs } from "expo-router";
import {
  ChatIcon,
  AboutIcon,
  ClipBoard,
} from "../../../components/icons/Icons";
import { useSession } from "../../../auth/ctx";
import { Pressable, Text } from "react-native";
import { styled } from "nativewind";

const StyledPressable = styled(Pressable);

export default function TabLayout() {
  const { session, signOut } = useSession();
  const userRole = session?.user.role_id;

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
        name="manager"
        options={{
          title: "Contenido",
          tabBarIcon: ({ color }) => <ClipBoard size={28} color={color} />,
          href: userRole === "admin_role" ? "manager" : null,
        }}
      />

      <Tabs.Screen
        name="help"
        options={{
          title: "Soporte y ayuda",
          tabBarIcon: ({ color }) => <AboutIcon size={28} color={color} />,
          href: userRole === "student_role" ? "help" : null,
        }}
      />

      <Tabs.Screen
        name="support"
        options={{
          title: "Soporte y ayuda",
          tabBarIcon: ({ color }) => <AboutIcon size={28} color={color} />,
          href: userRole === "admin_role" ? "support" : null,
        }}
      />
    </Tabs>
  );
}
