import React, { useState, useEffect } from "react";
import { Text } from "react-native";
import { Screen } from "../../../components/Screen";
import { useSession } from "../../ctx";

export default function App() {
  const { session } = useSession();
  const [tickets, setTickets] = useState<
    {
      _id: string;
      user_id: string;
      issue: string;
      status: string;
      created_at: string;
      updated_at: string;
    }[]
  >([]);

  useEffect(() => {
    fetchUserTickets();
  }, []);

  const fetchUserTickets = () => {
    console.log("fetchUserTickets", "fetchUserTickets");
  };

  return (
    <Screen>
      <Text>{session?.user.role_id}</Text>
    </Screen>
  );
}
