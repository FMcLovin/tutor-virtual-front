describe("user using chat spec", () => {
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

    // Ahora navegas al chat (si no lo hace automático)
    cy.visit("http://localhost:8081/");
  });

  it("envía un mensaje", () => {
    // Escribimos "hola"
    cy.get('[data-testid="message-data"]').type("hola");

    // Click en el botón de enviar
    cy.get('[data-testid="send-message-button"]').click();

    // Validamos que el mensaje "Tu tutorUV está escribiendo..." esté en el chat
    cy.contains("Tu tutorUV está escribiendo...").should("be.visible");
  });
});
