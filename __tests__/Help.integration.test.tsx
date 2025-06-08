import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Help from "../app/(app)/(tabs)/help";
import useTickets from "../hooks/useTickets";

jest.mock("../hooks/useTickets");

// Mock de useTickets
const mockSetModalVisible = jest.fn();
const mockCloseModal = jest.fn();
const mockSetIssue = jest.fn();
const mockFetchUserTickets = jest.fn();
const mockCreateTicket = jest.fn();

const mockTickets = [
  {
    _id: "1",
    issue: "Problema al iniciar sesión",
    status: "open",
    feedback: "Estamos revisando el problema",
    created_at: new Date("2024-06-01T00:00:00Z").toISOString(),
  },
  {
    _id: "2",
    issue: "No carga el chat",
    status: "closed",
    feedback: "Resuelto, actualiza la app",
    created_at: new Date("2024-05-30T00:00:00Z").toISOString(),
  },
];

describe("Integración - Help", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useTickets as jest.Mock).mockReturnValue({
      tickets: mockTickets,
      isLoading: false,
      isLoadingAction: false,
      isModalVisible: true, // Para probar el modal abierto
      issue: "Mi problema",
      setIssue: mockSetIssue,
      fetchUserTickets: mockFetchUserTickets,
      createTicket: mockCreateTicket,
      closeModal: mockCloseModal,
      setModalVisible: mockSetModalVisible,
    });
  });

  it("renderiza correctamente la pantalla", async () => {
    const { getByText } = render(<Help />);

    // Lista de tickets
    expect(getByText("Problema al iniciar sesión")).toBeTruthy();
    expect(getByText("Pendiente de revisión")).toBeTruthy();

    expect(getByText("No carga el chat")).toBeTruthy();
    expect(getByText("Cerrado")).toBeTruthy();

    // Modal abierto
    expect(getByText("Crear nuevo reporte")).toBeTruthy();
    expect(getByText("Cancelar")).toBeTruthy();
    expect(getByText("Enviar")).toBeTruthy();
  });

  it("llama a setModalVisible(true) al presionar el botón Reportar fallo", () => {
    (useTickets as jest.Mock).mockReturnValue({
      ...useTickets(),
      isModalVisible: false,
    });

    const { getByText } = render(<Help />);

    const reportButton = getByText("Reportar fallo");
    fireEvent.press(reportButton);

    expect(mockSetModalVisible).toHaveBeenCalledWith(true);
  });

  it("llama a closeModal al presionar Cancelar en el modal", () => {
    const { getByText } = render(<Help />);

    const cancelButton = getByText("Cancelar");
    fireEvent.press(cancelButton);

    expect(mockCloseModal).toHaveBeenCalled();
  });

  it("llama a createTicket al presionar Enviar en el modal", () => {
    const { getByText } = render(<Help />);

    const sendButton = getByText("Enviar");
    fireEvent.press(sendButton);

    expect(mockCreateTicket).toHaveBeenCalled();
  });

  it("llama a fetchUserTickets al presionar el botón de refrescar", () => {
    const { getByTestId } = render(<Help />);

    const refreshButton = getByTestId("refresh-button");
    fireEvent.press(refreshButton);

    expect(mockFetchUserTickets).toHaveBeenCalled();
  });
});
