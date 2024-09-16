import { View, Text, ScrollView } from "react-native";
import { Screen } from "../../../components/Screen";
import { Dashboard } from "../../../components/Dashboard";

export default function App() {
  return (
    <Screen>
      <Dashboard></Dashboard>
    </Screen>
  );
}
