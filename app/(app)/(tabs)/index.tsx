import { View, Text, ScrollView, Button } from "react-native";
import { Screen } from "../../../components/Screen";
import { Dashboard } from "../../../components/Dashboard";
import { useSession } from "../../ctx";

export default function App() {
  const { signOut, session } = useSession();
  console.log("index.tsx", session);
  return (
    <Screen>
      <Dashboard></Dashboard>
      <Text>Welcome, {session?.token}</Text>
      <Button
        title="Sign Out"
        onPress={() => {
          // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
          signOut();
        }}
      />
    </Screen>
  );
}
