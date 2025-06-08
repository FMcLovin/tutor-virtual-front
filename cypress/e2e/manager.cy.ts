describe("admin using manager module spec", () => {
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

    cy.visit("http://localhost:8081/manager");
  });

  it("Navegar a pantalla de creación de contenido", () => {
    cy.get('[data-testid="new-content-button"]').click();

    cy.url().should("eq", "http://localhost:8081/manager/create");

    cy.get('[data-testid="question-input"]').type("¿Hola?");

    cy.get('[data-testid="answer-input"]').type("Respuesta de cypress");

    cy.get('[data-testid="validate-button"]').click();

    cy.url().should("eq", "http://localhost:8081/manager");
  });

  it("Ver los datos de una pregunta de la base de conocimientos", () => {
    cy.get('[data-testid="view-button-68460045b8b493a1376b06ce"]').click();

    cy.url().should(
      "eq",
      "http://localhost:8081/manager/68460045b8b493a1376b06ce",
    );
  });

  it("Editar contenido", () => {
    cy.get('[data-testid="view-button-68460045b8b493a1376b06ce"]').click();

    cy.url().should(
      "eq",
      "http://localhost:8081/manager/68460045b8b493a1376b06ce",
    );

    cy.get('[data-testid="edit-button"]').click();

    cy.get('[data-testid="question-input"]').type("¿Hola? editado");

    cy.get('[data-testid="check-button"]').click();
  });

  it("Exportar dataset", () => {
    cy.get('[data-testid="export-button"]').click();
  });
});
