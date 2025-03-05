import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Chat from "../app/(app)/(tabs)/index";
import { useSession } from "../auth/ctx";
import { get, post, put } from "../services";
import { GET_CHAT_BY_USER_ID, CREATE_CHAT, GET_CHAT } from "@env";
import useAlert from "../hooks/useAlert";

// Mock de dependencias
jest.mock("../auth/ctx", () => ({
  useSession: jest.fn(),
}));

jest.mock("../services", () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
}));

jest.mock("../../../hooks/useAlert", () => ({
  // Mock de la función useAlert
  __esModule: true,
  default: jest.fn().mockReturnValue(jest.fn()),
}));

describe("Chat App", () => {
  const mockSession = {
    session: {
      user: { _id: "user123" },
      token: "some-token",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useSession as jest.Mock).mockReturnValue(mockSession);

    // Solo definir el mock predeterminado si no se ha definido en la prueba
    if (!(get as jest.Mock).mock.calls.length) {
      (get as jest.Mock).mockResolvedValue([]);
    }
  });

  it("renders chat screen correctly", async () => {
    const { getByTestId } = render(<Chat />);

    expect(getByTestId("message-data")).toBeTruthy();
    expect(getByTestId("button-send")).toBeTruthy();
  });

  it("calls fetchChatDetails when fetching chat messages", async () => {
    // Simulamos una respuesta de chat.
    (get as jest.Mock).mockResolvedValueOnce([{ chat_id: "chat-id" }]);
    // Simulamos la respuesta de mensajes en el chat.
    (get as jest.Mock).mockResolvedValueOnce([
      { _id: "1", content: "Hello", sender: "user", timestamp: "2025-01-01" },
    ]);

    const { getByText } = render(<Chat />);

    await waitFor(() => {
      expect(get).toHaveBeenCalledWith(
        `${GET_CHAT_BY_USER_ID}user123`,
        "some-token",
      );
      expect(get).toHaveBeenCalledWith(`${GET_CHAT}chat-id`, "some-token");
    });

    expect(getByText("Hello")).toBeTruthy();
  });

  it("handles error when sending message", async () => {
    const { getByText, getByPlaceholderText } = render(<Chat />);
    const mockShowAlert = useAlert();

    // Simulamos un error en la respuesta de PUT.
    (put as jest.Mock).mockRejectedValueOnce(
      new Error("Error al enviar el mensaje"),
    );

    fireEvent.changeText(
      getByPlaceholderText("Escribe tu mensaje..."),
      "Test message",
    );
    fireEvent.press(getByText("Enviar"));

    await waitFor(() => {
      expect(mockShowAlert).toHaveBeenCalledWith(
        "Ha ocurrido un error enviando el mensaje",
      );
    });
  });
});
