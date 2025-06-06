import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import Support from "../app/(app)/(tabs)/support";

// ✅ MOCK de useRouter para que no truene el router.push
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// ✅ Mocks de useSupport
const mockFetchTickets = jest.fn();
const mockChangeStatus = jest.fn();
const mockOpenModal = jest.fn();
const mockCloseModal = jest.fn();
const mockSetFeedback = jest.fn();
const mockSetStatus = jest.fn();

jest.mock("../hooks/useSupport", () => ({
  useSupport: () => ({
    tickets: [
      {
        _id: "1",
        issue: "No se puede enviar el formulario",
        status: "open",
        feedback: "Estamos revisando el problema.",
        created_at: new Date().toISOString(),
      },
    ],
    isLoading: false,
    isLoadingAction: false,
    selectedTicket: 0, // el modal estará visible
    feedback: "Estamos revisando el problema.",
    status: "open",
    setFeedback: mockSetFeedback,
    setStatus: mockSetStatus,
    fetchTickets: mockFetchTickets,
    changeStatus: mockChangeStatus,
    openModal: mockOpenModal,
    closeModal: mockCloseModal,
  }),
}));

describe("Pantalla Support", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza un ticket en la lista", () => {
    const { getByText } = render(<Support />);
    expect(getByText("No se puede enviar el formulario...")).toBeTruthy();
    expect(getByText("open")).toBeTruthy(); // BadgeComponent muestra el status
  });

  it("muestra el modal si selectedTicket !== null", () => {
    const { getByText, getByDisplayValue } = render(<Support />);
    expect(getByText("Atender ticket")).toBeTruthy();
    expect(getByText("Problema:")).toBeTruthy();
    expect(getByText("No se puede enviar el formulario")).toBeTruthy();
    expect(getByDisplayValue("Estamos revisando el problema.")).toBeTruthy();
  });

  it("cierra el modal al presionar 'Cancelar'", () => {
    const { getByText } = render(<Support />);
    fireEvent.press(getByText("Cancelar"));
    expect(mockCloseModal).toHaveBeenCalled();
  });

  it("envía los cambios al presionar 'Enviar'", () => {
    const { getByText } = render(<Support />);
    fireEvent.press(getByText("Enviar"));
    expect(mockChangeStatus).toHaveBeenCalled();
  });

  it("actualiza el feedback al escribir", () => {
    const { getByPlaceholderText } = render(<Support />);
    const input = getByPlaceholderText("Sigue los siguientes pasos para...");
    fireEvent.changeText(input, "Nuevo feedback");
    expect(mockSetFeedback).toHaveBeenCalledWith("Nuevo feedback");
  });

  it("cambia el status en el picker", () => {
    const { getByTestId } = render(<Support />);
    const picker = getByTestId("picker-status");
    fireEvent(picker, "valueChange", "closed");
    expect(mockSetStatus).toHaveBeenCalledWith("closed");
  });

  it("llama a fetchTickets al presionar botón de refrescar", () => {
    const { getByTestId } = render(<Support />);
    fireEvent.press(getByTestId("refresh-button"));
    expect(mockFetchTickets).toHaveBeenCalled();
  });
});
