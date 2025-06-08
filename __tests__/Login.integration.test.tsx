// __tests__/LoginScreen.integration.test.tsx
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LoginScreen from "../app/login";

// Mocks
const mockSignIn = jest.fn();
const mockPush = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock("../auth/ctx", () => {
  const actualCtx = jest.requireActual("../auth/ctx");
  return {
    ...actualCtx,
    useSession: () => ({
      signIn: mockSignIn,
      signOut: jest.fn(),
      session: null,
      isLoading: false,
    }),
  };
});

describe("Integración - LoginScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("flujo de éxito → login con datos válidos", async () => {
    mockSignIn.mockResolvedValueOnce(undefined); // simula login correcto

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    fireEvent.changeText(
      getByPlaceholderText("zs21004492@estudiantes.uv.mx"),
      "zs21004492@estudiantes.uv.mx",
    );
    fireEvent.changeText(getByPlaceholderText("* * * * * * * * *"), "12345678");

    jest.useFakeTimers();

    fireEvent.press(getByText("Iniciar Sesión"));

    // Avanzas manualmente el timer
    jest.advanceTimersByTime(1500);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith(
        "zs21004492@estudiantes.uv.mx",
        "12345678",
      );
    });

    jest.useRealTimers();
  });

  it("flujo de error → login con email inválido", async () => {
    const {
      getByPlaceholderText,
      getByText,
      getByText: getErrorText,
    } = render(<LoginScreen />);

    fireEvent.changeText(
      getByPlaceholderText("zs21004492@estudiantes.uv.mx"),
      "invalid@email.com",
    );
    fireEvent.changeText(getByPlaceholderText("* * * * * * * * *"), "12345678");

    fireEvent.press(getByText("Iniciar Sesión"));

    await waitFor(() => {
      expect(
        getErrorText("El correo debe ser @uv.mx o @estudiantes.uv.mx"),
      ).toBeTruthy();
    });

    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it("flujo de error → login con contraseña vacía", async () => {
    const {
      getByPlaceholderText,
      getByText,
      getByText: getErrorText,
    } = render(<LoginScreen />);

    fireEvent.changeText(
      getByPlaceholderText("zs21004492@estudiantes.uv.mx"),
      "zs21004492@estudiantes.uv.mx",
    );
    fireEvent.changeText(getByPlaceholderText("* * * * * * * * *"), "");

    fireEvent.press(getByText("Iniciar Sesión"));

    await waitFor(() => {
      expect(getErrorText("Por favor, ingresa tu contraseña")).toBeTruthy();
    });

    expect(mockSignIn).not.toHaveBeenCalled();
  });
});
