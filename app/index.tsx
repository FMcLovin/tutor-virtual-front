import { Screen } from "../components/Screen";
import { Dashboard } from "../components/Dashboard";
import { NativeWindStyleSheet } from "nativewind";

NativeWindStyleSheet.setOutput({
  default: "native",
});

export default function App() {
  return (
    <Screen>
      <Dashboard></Dashboard>
    </Screen>
  );
}
