describe("login attempt spec", () => {
  beforeEach(() => {
    // Visitamos la página de login antes de cada test
    cy.visit("http://localhost:8081/login");
  });

  it("Muestra error si el correo es inválido", () => {
    // Ingresamos un correo inválido
    cy.get('[data-testid="email-input"]').type("correo_invalido@gmail.com");

    // Ingresamos una contraseña válida
    cy.get('[data-testid="password-input"]').type("12345678");

    // Click en login
    cy.get('[data-testid="login-button"]').click();

    // Aquí depende de cómo muestras el error, por ejemplo:
    cy.contains("El correo debe ser @uv.mx o @estudiantes.uv.mx").should(
      "be.visible",
    );
  });

  it("Muestra error si la contraseña está vacía", () => {
    // Ingresamos un correo válido
    cy.get('[data-testid="email-input"]').type("zs21004492@estudiantes.uv.mx");

    // Dejamos la contraseña vacía

    // Click en login
    cy.get('[data-testid="login-button"]').click();

    // Validamos el mensaje de error de contraseña vacía
    cy.contains("Por favor, ingresa tu contraseña").should("be.visible");
  });

  it("Muestra error si el login es rechazado por el servidor", () => {
    // Ingresamos un correo válido
    cy.get('[data-testid="email-input"]').type("zs21004492@estudiantes.uv.mx");

    // Ingresamos una contraseña incorrecta
    cy.get('[data-testid="password-input"]').type("contraseña_incorrecta");

    // Click en login
    cy.get('[data-testid="login-button"]').click();

    cy.url().should("eq", "http://localhost:8081/login");
  });

  it("Login exitoso navega a la página de inicio", () => {
    // Escribimos el email
    cy.get('[data-testid="email-input"]').type("s21004492@estudiantes.uv.mx");

    // Escribimos la contraseña
    cy.get('[data-testid="password-input"]').type("admin123");

    // Hacemos click en el botón de login
    cy.get('[data-testid="login-button"]').click();

    // Ahora validamos que la URL haya cambiado a la página index ("/")
    cy.url().should("eq", "http://localhost:8081/");
  });
});
