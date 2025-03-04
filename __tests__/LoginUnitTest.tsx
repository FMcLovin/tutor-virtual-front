import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LoginScreen from "../app/login";
import { useSession } from "../auth/ctx";

jest.mock("../auth/ctx", () => ({
  useSession: jest.fn(),
}));

describe("LoginScreen", () => {
  const mockSignIn = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useSession as jest.Mock).mockReturnValue({
      signIn: mockSignIn,
      session: null,
    });
  });

  it("renders correctly", () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    expect(getByText("Inicia Sesión")).toBeTruthy();
    expect(getByPlaceholderText("Correo institucional")).toBeTruthy();
    expect(getByPlaceholderText("Contraseña")).toBeTruthy();
  });

  it("shows an error if email is empty", async () => {
    const { getByText } = render(<LoginScreen />);

    fireEvent.press(getByText("Iniciar sesión"));

    await waitFor(() => {
      expect(getByText("Por favor, ingresa tu correo")).toBeTruthy();
    });
  });

  it("shows an error if email is invalid", async () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    fireEvent.changeText(
      getByPlaceholderText("Correo institucional"),
      "test@gmail.com",
    );
    fireEvent.press(getByText("Iniciar sesión"));

    await waitFor(() => {
      expect(
        getByText("El correo debe ser @uv.mx o @estudiantes.uv.mx"),
      ).toBeTruthy();
    });
  });

  it("shows an error if password is empty", async () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    fireEvent.changeText(
      getByPlaceholderText("Correo institucional"),
      "user@uv.mx",
    );
    fireEvent.press(getByText("Iniciar sesión"));

    await waitFor(() => {
      expect(getByText("Por favor, ingresa tu contraseña")).toBeTruthy();
    });
  });

  it("calls signIn when credentials are valid", async () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    fireEvent.changeText(
      getByPlaceholderText("Correo institucional"),
      "user@uv.mx",
    );
    fireEvent.changeText(getByPlaceholderText("Contraseña"), "password123");
    fireEvent.press(getByText("Iniciar sesión"));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith("user@uv.mx", "password123");
    });
  });
});
