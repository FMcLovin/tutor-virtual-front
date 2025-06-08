describe("user using help module spec", () => {
  beforeEach(() => {
    // Visitamos la página de login antes de cada test
    cy.visit("http://localhost:8081/login");

    // Escribimos el email
    cy.get('[data-testid="email-input"]').type("s21004492@estudiantes.uv.mx");

    // Escribimos la contraseña
    cy.get('[data-testid="password-input"]').type("admin123");

    // Hacemos click en el botón de login
    cy.get('[data-testid="login-button"]').click();

    // Aseguramos que la página inicial cargó
    cy.url().should("eq", "http://localhost:8081/");

    cy.visit("http://localhost:8081/help");
  });

  it("Abril modal de reportes", () => {
    // Click en el botón de Reportar fallo
    cy.get('[data-testid="new-issue-button"]').click();

    // Validamos que el mensaje "Crear nuevo reporte" esté en la pantalla
    cy.contains("Crear nuevo reporte").should("be.visible");
  });

  it("Abril modal de reportes y cancelar acción", () => {
    // Click en el botón de Reportar fallo
    cy.get('[data-testid="new-issue-button"]').click();

    // Validamos que el mensaje "Crear nuevo reporte" esté en la pantalla
    cy.contains("Crear nuevo reporte").should("be.visible");

    cy.get('[data-testid="issue-cancel-button"]').click();
  });

  it("Reportar un fallo", () => {
    // Click en el botón de Reportar fallo
    cy.get('[data-testid="new-issue-button"]').click();

    // Escribimos "hola"
    cy.get('[data-testid="issue-input"]').type("Error cypress");

    // Click en el botón de enviar
    cy.get('[data-testid="issue-button"]').click();

    // Validamos que el mensaje "Tu tutorUV está escribiendo..." esté en la pantalla
    cy.contains("Error cypress").should("be.visible");
  });
});
