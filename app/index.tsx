import { Text } from "react-native";
import { Screen } from "../components/Screen";
import { Dashboard } from "../components/Dashboard";
import { PageHeader } from "../components/PageHeader";

export default function App() {
  return (
    <Screen>
      <PageHeader title={"Inicio"} />
      <Dashboard></Dashboard>
    </Screen>
  );
}
