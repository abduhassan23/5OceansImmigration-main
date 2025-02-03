describe('SignIn Page', () => {
  beforeEach(() => {
    // Navigate to the sign-in page before each test
    cy.visit('/sign-in');
  });

  it('Sign in with email and password', () => {
    // Fill in the email and password fields
    cy.get('input[type="email"]').type('amadouamos@hotmail.com');
    cy.get('input[type="password"]').type('1234567');
    
    // Click the sign-in button
    cy.get('button').contains('Sign In').click();

    // Check if redirected to homepage
    cy.url().should('include', '/homepage');
     
    });
  });

