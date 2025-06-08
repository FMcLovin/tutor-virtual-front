// __tests__/LoginUnitTest.tsx
import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";

import Login from "../app/login";

// Definimos mockSignIn afuera para poder limpiarlo en beforeEach
const mockSignIn = jest.fn(async () => Promise.resolve());

// MOCK completo de useSession, antes de importar la pantalla
jest.mock("../auth/ctx", () => ({
  useSession: () => ({
    session: null,
    signIn: mockSignIn,
  }),
}));

describe("Pantalla de Login", () => {
  beforeAll(() => {
    // Activamos fake timers globalmente en este bloque
    jest.useFakeTimers();
  });

  beforeEach(() => {
    mockSignIn.mockClear();
  });

  afterAll(() => {
    // Restauramos temporizadores reales al terminar todas las pruebas
    jest.useRealTimers();
  });

  it("muestra error si los campos están vacíos", async () => {
    const { getByText, findByText } = render(<Login />);
    fireEvent.press(getByText("Iniciar Sesión"));
    expect(await findByText("Por favor, ingresa tu correo")).toBeTruthy();
  });

  it("muestra error si el correo no es institucional", async () => {
    const { getByPlaceholderText, getByText, findByText } = render(<Login />);
    fireEvent.changeText(
      getByPlaceholderText("zs21004492@estudiantes.uv.mx"),
      "correo@gmail.com",
    );
    fireEvent.changeText(getByPlaceholderText("* * * * * * * * *"), "12345678");
    fireEvent.press(getByText("Iniciar Sesión"));
    expect(
      await findByText("El correo debe ser @uv.mx o @estudiantes.uv.mx"),
    ).toBeTruthy();
  });

  it("llama a signIn con datos válidos", async () => {
    const { getByPlaceholderText, getByText } = render(<Login />);

    // Llenamos email y password válidos
    fireEvent.changeText(
      getByPlaceholderText("zs21004492@estudiantes.uv.mx"),
      "zs21004492@estudiantes.uv.mx",
    );
    fireEvent.changeText(getByPlaceholderText("* * * * * * * * *"), "12345678");

    // Presionamos el botón
    fireEvent.press(getByText("Iniciar Sesión"));

    // Avanzamos el temporizador para cubrir los 1500 ms del setTimeout
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    // Ahora esperamos que mockSignIn haya sido llamado
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith(
        "zs21004492@estudiantes.uv.mx",
        "12345678",
      );
    });
  });
});
