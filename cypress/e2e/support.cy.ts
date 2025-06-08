describe("admin using support module spec", () => {
  beforeEach(() => {
    // Visitamos la página de login antes de cada test
    cy.visit("http://localhost:8081/login");

    // Escribimos el email
    cy.get('[data-testid="email-input"]').type("example@uv.mx");

    // Escribimos la contraseña
    cy.get('[data-testid="password-input"]').type("admin123");

    // Hacemos click en el botón de login
    cy.get('[data-testid="login-button"]').click();

    // Aseguramos que la página inicial cargó
    cy.url().should("eq", "http://localhost:8081/");

    cy.visit("http://localhost:8081/support");
  });

  it("Ver detalles de un reporte", () => {
    cy.get('[data-testid="ticket-press-0"]').click();

    cy.contains("No sé usar la app...").should("be.visible");
  });

  it("Editar un reporte", () => {
    cy.get('[data-testid="ticket-press-0"]').click();

    cy.get('[data-testid="feedback-input"]').type("¿Hola?");

    cy.get('[data-testid="send-button"]').click();

    cy.contains("No sé usar la app...").should("be.visible");
  });
});
