import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

// Importar después de mockear
import Chat from "../app/(app)/(tabs)/index";

// 🧠 Creamos un mock del hook
const mockSendMessage = jest.fn();
const mockSetInputText = jest.fn();

jest.mock("../hooks/useChat", () => () => ({
  messages: [
    {
      _id: "1",
      content: "Hola, ¿en qué puedo ayudarte?",
      timestamp: Date.now(),
    },
  ],
  chatID: "abc123",
  isSendingMessage: false,
  sendMessage: mockSendMessage,
  scrollViewRef: { current: null },
  handleScroll: jest.fn(),
  setInputText: mockSetInputText,
  inputText: "Hola",
}));

describe("Pantalla de Chat", () => {
  beforeEach(() => {
    mockSendMessage.mockClear();
    mockSetInputText.mockClear();
  });

  it("renderiza el mensaje del tutor", () => {
    const { getByText } = render(<Chat />);
    expect(getByText("Hola, ¿en qué puedo ayudarte?")).toBeTruthy();
  });

  it("muestra el texto en el input correctamente", () => {
    const { getByDisplayValue } = render(<Chat />);
    expect(getByDisplayValue("Hola")).toBeTruthy();
  });

  it("envía el mensaje al presionar el botón", () => {
    const { getByTestId } = render(<Chat />);
    fireEvent.press(getByTestId("button-send"));
    expect(mockSendMessage).toHaveBeenCalled();
  });

  it("actualiza el texto del input", () => {
    const { getByPlaceholderText } = render(<Chat />);
    const input = getByPlaceholderText("Escribe tu mensaje...");
    fireEvent.changeText(input, "Nuevo mensaje");
    expect(mockSetInputText).toHaveBeenCalledWith("Nuevo mensaje");
  });
});
