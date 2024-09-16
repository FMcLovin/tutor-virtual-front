import { Tabs } from "expo-router";
import { ChatIcon, AboutIcon } from "../../../components/icons/Icons";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "#059669" }}>
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
    </Tabs>
  );
}
