import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import Manager from "../app/(app)/(tabs)/manager";

// Mocks de funciones
const mockCreateContent = jest.fn();
const mockEditContent = jest.fn();
const mockOpenContent = jest.fn();
const mockOpenDeleteModal = jest.fn();
const mockDeleteContent = jest.fn();
const mockImportData = jest.fn();
const mockExportData = jest.fn();
const mockSetDeleteModal = jest.fn();

// Mock de useManager
jest.mock("../hooks/useManager", () => () => ({
  content: [
    {
      _id: "1",
      question: "¿Cuál es el objetivo del programa?",
      answer: "Brindar apoyo académico a los estudiantes...",
    },
  ],
  pendingDelete: { contendID: "1", index: 0 },
  isLoading: false,
  deleteModal: false,
  setDeleteModal: mockSetDeleteModal,
  createContent: mockCreateContent,
  editContent: mockEditContent,
  openDeleteModal: mockOpenDeleteModal,
  deleteContent: mockDeleteContent,
  openContent: mockOpenContent,
  importData: mockImportData,
  exportData: mockExportData,
}));

describe("Pantalla Manager", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza el contenido correctamente", () => {
    const { getByText } = render(<Manager />);
    expect(getByText("¿Cuál es el objetivo del programa?")).toBeTruthy();
    expect(getByText(/Brindar apoyo académico/i)).toBeTruthy();
  });

  it("llama a createContent al presionar el botón Crear contenido", () => {
    const { getByText } = render(<Manager />);
    fireEvent.press(getByText("Crear contenido"));
    expect(mockCreateContent).toHaveBeenCalled();
  });

  it("llama a importData al presionar Importar dataset", () => {
    const { getByText } = render(<Manager />);
    fireEvent.press(getByText("Importar dataset"));
    expect(mockImportData).toHaveBeenCalled();
  });

  it("llama a exportData al presionar Exportar dataset", () => {
    const { getByText } = render(<Manager />);
    fireEvent.press(getByText("Exportar dataset"));
    expect(mockExportData).toHaveBeenCalled();
  });

  it("llama a editContent cuando se presiona el ícono de editar", () => {
    const { getByTestId } = render(<Manager />);
    fireEvent.press(getByTestId("edit-button-1"));
    expect(mockEditContent).toHaveBeenCalledWith("1");
  });

  it("llama a openContent cuando se presiona el ícono de ver", () => {
    const { getByTestId } = render(<Manager />);
    fireEvent.press(getByTestId("view-button-1"));
    expect(mockOpenContent).toHaveBeenCalledWith("1");
  });

  it("llama a openDeleteModal al presionar el ícono de eliminar", () => {
    const { getByTestId } = render(<Manager />);
    fireEvent.press(getByTestId("delete-button-1"));
    expect(mockOpenDeleteModal).toHaveBeenCalled();
  });
});
