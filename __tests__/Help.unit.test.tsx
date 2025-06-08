import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import Help from "../app/(app)/(tabs)/help";

// Mocks de funciones
const mockFetchUserTickets = jest.fn();
const mockCreateTicket = jest.fn();
const mockSetModalVisible = jest.fn();
const mockCloseModal = jest.fn();
const mockSetIssue = jest.fn();

jest.mock("../hooks/useTickets", () => () => ({
  tickets: [
    {
      _id: "1",
      issue: "No carga la pantalla de inicio",
      status: "open",
      feedback: "Estamos revisando tu reporte",
      created_at: new Date().toISOString(),
    },
  ],
  isLoading: false,
  isLoadingAction: false,
  isModalVisible: true,
  issue: "Mi app falla",
  setIssue: mockSetIssue,
  fetchUserTickets: mockFetchUserTickets,
  createTicket: mockCreateTicket,
  closeModal: mockCloseModal,
  setModalVisible: mockSetModalVisible,
}));

describe("Pantalla Help", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza un ticket", () => {
    const { getByText } = render(<Help />);
    expect(getByText("No carga la pantalla de inicio")).toBeTruthy();
    expect(getByText("Pendiente de revisión")).toBeTruthy();
    expect(getByText("Estamos revisando tu reporte")).toBeTruthy();
  });

  it("muestra el modal si isModalVisible es true", () => {
    const { getByText, getByDisplayValue } = render(<Help />);
    expect(getByText("Crear nuevo reporte")).toBeTruthy();
    expect(getByDisplayValue("Mi app falla")).toBeTruthy();
  });

  it("cierra el modal al presionar 'Cancelar'", () => {
    const { getByText } = render(<Help />);
    fireEvent.press(getByText("Cancelar"));
    expect(mockCloseModal).toHaveBeenCalled();
  });

  it("envía un ticket al presionar 'Enviar'", () => {
    const { getByText } = render(<Help />);
    fireEvent.press(getByText("Enviar"));
    expect(mockCreateTicket).toHaveBeenCalled();
  });

  it("actualiza el texto del issue al escribir", () => {
    const { getByPlaceholderText } = render(<Help />);
    const input = getByPlaceholderText("Problema");
    fireEvent.changeText(input, "Pantalla negra");
    expect(mockSetIssue).toHaveBeenCalledWith("Pantalla negra");
  });

  it("activa setModalVisible al presionar 'Reportar fallo'", () => {
    const { getByText } = render(<Help />);
    fireEvent.press(getByText("Reportar fallo"));
    expect(mockSetModalVisible).toHaveBeenCalledWith(true);
  });

  it("llama a fetchUserTickets al presionar botón de refrescar", () => {
    const { getByTestId } = render(<Help />);
    fireEvent.press(getByTestId("refresh-button"));
    expect(mockFetchUserTickets).toHaveBeenCalled();
  });
});
