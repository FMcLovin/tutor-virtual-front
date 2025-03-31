import { useState, useEffect } from "react";
import { get, put } from "../services";
import { SUPPORT_ROUTE } from "@env";
import { useSession } from "../auth/ctx";
import useAlert from "./useAlert";
import { useRouter } from "expo-router";
import { Ticket } from "../models/Ticket";

export const useSupport = () => {
  const { session } = useSession();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [status, setStatus] = useState<string>("open");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingAction, setIsLoadingAction] = useState<boolean>(false);
  const showAlert = useAlert();
  const router = useRouter();

  useEffect(() => {
    if (session?.user.role_id === "admin_role") {
      fetchTickets();
    } else {
      // Redirigir si no es admin
      router.push(`/`);
    }
  }, []);

  /**
   *
   */
  const fetchTickets = () => {
    setIsLoading(true);
    get(SUPPORT_ROUTE, session?.token)
      .then((response) => {
        setTickets(response || []);
        setIsLoading(false);
      })
      .catch((error) => {
        showAlert("Ha ocurrido un error obteniendo los reportes");
        setIsLoading(false);
      });
  };

  /**
   *
   */
  const changeStatus = () => {
    if (selectedTicket === null) return;

    const ticketID = tickets[selectedTicket]._id;
    const ticketData = { status, feedback };

    setIsLoadingAction(true);
    put(`${SUPPORT_ROUTE}/${ticketID}`, ticketData, session?.token)
      .then(() => {
        setTickets((prevTickets) => {
          const updatedTickets = [...prevTickets];
          updatedTickets[selectedTicket].status = status;
          updatedTickets[selectedTicket].feedback = feedback;
          return updatedTickets;
        });
        setIsLoadingAction(false);
        showAlert("Reporte actualizado");
        closeModal();
      })
      .catch((error) => {
        showAlert("Ha ocurrido un error, vuelve a intentarlo");
        setIsLoadingAction(false);
        closeModal();
      });
  };

  /**
   *
   * @param index ticket index in list
   */
  const openModal = (index: number) => {
    console.log(index);
    setSelectedTicket(index);
    setStatus(tickets[index].status);
    setFeedback(tickets[index].feedback);
  };

  /**
   *
   */
  const closeModal = () => {
    setFeedback("");
    setSelectedTicket(null);
  };

  return {
    tickets,
    isLoading,
    isLoadingAction,
    selectedTicket,
    feedback,
    status,
    setFeedback,
    setStatus,
    fetchTickets,
    changeStatus,
    openModal,
    closeModal,
  };
};
