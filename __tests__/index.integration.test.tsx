// __tests__/Chat.integration.test.tsx
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Chat from "../app/(app)/(tabs)/index";

const mockSendMessage = jest.fn();
const mockSetInputText = jest.fn();

jest.mock("../hooks/useChat", () => ({
  __esModule: true,
  default: () => ({
    messages: [
      {
        _id: "1",
        content: "Hola, soy tu tutor.",
        timestamp: Date.now(),
      },
    ],
    chatID: "1234",
    isSendingMessage: false,
    sendMessage: mockSendMessage,
    scrollViewRef: { current: null },
    handleScroll: jest.fn(),
    setInputText: mockSetInputText,
    inputText: "",
  }),
}));

describe("Integración - Chat", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza mensajes existentes", () => {
    const { getByText } = render(<Chat />);

    expect(getByText("Hola, soy tu tutor.")).toBeTruthy();
  });

  it("envía un mensaje cuando el usuario presiona Enviar", async () => {
    const { getByPlaceholderText, getByTestId } = render(<Chat />);

    // Simula escribir en el input
    const input = getByPlaceholderText("Escribe tu mensaje...");
    fireEvent.changeText(input, "Mi mensaje de prueba");

    // Verificamos que setInputText fue llamado con el texto
    expect(mockSetInputText).toHaveBeenCalledWith("Mi mensaje de prueba");

    // Simula presionar el botón Enviar
    fireEvent.press(getByTestId("button-send"));

    // Verificamos que sendMessage fue llamado
    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalled();
    });
  });
});
