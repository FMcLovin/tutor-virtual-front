import { useState, useEffect } from "react";
import { get, post } from "../services";
import { SUPPORT_ROUTE } from "@env";
import { useSession } from "../auth/ctx";
import useAlert from "./useAlert";

export type Ticket = {
  _id: string;
  user_id: string;
  issue: string;
  status: string;
  feedback: string;
  created_at: string;
  updated_at: string;
};

export default function useTickets() {
  const { session } = useSession();
  const showAlert = useAlert();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [isLoadingAction, setLoadingAction] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [issue, setIssue] = useState("");

  useEffect(() => {
    fetchUserTickets();
  }, []);

  /**
   *
   */
  const fetchUserTickets = async () => {
    setLoading(true);
    try {
      const response = await get(
        `${SUPPORT_ROUTE}/user/${session?.user._id}`,
        session?.token,
      );
      setTickets(response || []);
    } catch (error) {
      console.error("fetchUserTickets", error);
      showAlert("Ha ocurrido un error obteniendo tus reportes");
    } finally {
      setLoading(false);
    }
  };

  /**
   *
   */
  const createTicket = async () => {
    setLoadingAction(true);
    try {
      const newTicket = await post(
        SUPPORT_ROUTE,
        { user_id: session?.user._id, issue },
        session?.token,
      );
      setTickets([...tickets, newTicket]);
      closeModal();
    } catch (error) {
      console.error("createTicket", error);
      showAlert("Ha ocurrido un error, vuelve a intentarlo");
    } finally {
      setLoadingAction(false);
    }
  };

  /**
   *
   */
  const closeModal = () => {
    setModalVisible(false);
    setIssue("");
  };

  return {
    tickets,
    isLoading,
    isLoadingAction,
    isModalVisible,
    issue,
    setIssue,
    fetchUserTickets,
    createTicket,
    closeModal,
    setModalVisible,
  };
}
