// __tests__/Support.integration.test.tsx

/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Support from "../app/(app)/(tabs)/support";

// 🟣 Mock de Badge que funciona bien (sin ReferenceError)

// 🟣 Mock de useSupport
jest.mock("../hooks/useSupport", () => {
  return {
    __esModule: true,
    useSupport: jest.fn(() => ({
      tickets: [
        {
          _id: "1",
          issue: "Problema 1",
          status: "open",
          feedback: "Estamos revisando el problema",
          created_at: new Date("2024-06-01T06:00:00Z").toISOString(),
        },
      ],
      isLoading: false,
      isLoadingAction: false,
      selectedTicket: 0,
      feedback: "Estamos revisando el problema",
      status: "open",
      setFeedback: jest.fn(),
      setStatus: jest.fn(),
      fetchTickets: jest.fn(),
      changeStatus: jest.fn(),
      openModal: jest.fn(),
      closeModal: jest.fn(),
    })),
  };
});

describe("Integración - Support", () => {
  it("renderiza el contenido correctamente", async () => {
    const { getByText } = render(<Support />);

    // Card de ticket
    expect(getByText("Problema 1")).toBeTruthy();
    await waitFor(() => {
      expect(getByText(/Pendiente de revisión|open/i)).toBeTruthy();
    });

    // Modal abierto
    expect(getByText("Atender ticket")).toBeTruthy();
    expect(getByText("Problema:")).toBeTruthy();
    expect(getByText("Retroalimentación:")).toBeTruthy();
    expect(getByText("Estado:")).toBeTruthy();
    expect(getByText("Cancelar")).toBeTruthy();
    expect(getByText("Enviar")).toBeTruthy();
  });

  it("llama a closeModal al presionar Cancelar", async () => {
    const mockCloseModal = jest.fn();

    // Re-define mock
    const useSupport = require("../hooks/useSupport").useSupport;
    useSupport.mockReturnValue({
      tickets: [
        {
          _id: "1",
          issue: "Problema 1",
          status: "open",
          feedback: "Estamos revisando el problema",
          created_at: new Date("2024-06-01T06:00:00Z").toISOString(),
        },
      ],
      isLoading: false,
      isLoadingAction: false,
      selectedTicket: 0,
      feedback: "Estamos revisando el problema",
      status: "open",
      setFeedback: jest.fn(),
      setStatus: jest.fn(),
      fetchTickets: jest.fn(),
      changeStatus: jest.fn(),
      openModal: jest.fn(),
      closeModal: mockCloseModal,
    });

    const { getByText } = render(<Support />);

    fireEvent.press(getByText("Cancelar"));

    expect(mockCloseModal).toHaveBeenCalled();
  });

  it("llama a changeStatus al presionar Enviar", async () => {
    const mockChangeStatus = jest.fn();

    const useSupport = require("../hooks/useSupport").useSupport;
    useSupport.mockReturnValue({
      tickets: [
        {
          _id: "1",
          issue: "Problema 1",
          status: "open",
          feedback: "Estamos revisando el problema",
          created_at: new Date("2024-06-01T06:00:00Z").toISOString(),
        },
      ],
      isLoading: false,
      isLoadingAction: false,
      selectedTicket: 0,
      feedback: "Estamos revisando el problema",
      status: "open",
      setFeedback: jest.fn(),
      setStatus: jest.fn(),
      fetchTickets: jest.fn(),
      changeStatus: mockChangeStatus,
      openModal: jest.fn(),
      closeModal: jest.fn(),
    });

    const { getByText } = render(<Support />);

    fireEvent.press(getByText("Enviar"));

    expect(mockChangeStatus).toHaveBeenCalled();
  });

  it("llama a fetchTickets al presionar botón de refrescar", async () => {
    const mockFetchTickets = jest.fn();

    const useSupport = require("../hooks/useSupport").useSupport;
    useSupport.mockReturnValue({
      tickets: [
        {
          _id: "1",
          issue: "Problema 1",
          status: "open",
          feedback: "Estamos revisando el problema",
          created_at: new Date("2024-06-01T06:00:00Z").toISOString(),
        },
      ],
      isLoading: false,
      isLoadingAction: false,
      selectedTicket: 0,
      feedback: "Estamos revisando el problema",
      status: "open",
      setFeedback: jest.fn(),
      setStatus: jest.fn(),
      fetchTickets: mockFetchTickets,
      changeStatus: jest.fn(),
      openModal: jest.fn(),
      closeModal: jest.fn(),
    });

    const { getByTestId } = render(<Support />);

    fireEvent.press(getByTestId("refresh-button"));

    expect(mockFetchTickets).toHaveBeenCalled();
  });
});
