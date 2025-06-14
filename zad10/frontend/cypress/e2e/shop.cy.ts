describe('Koszyk', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
    cy.get('[data-testid="product-add"]').as('addButtons');
  });

  it('1. Display empty cart', () => {
    cy.contains('Przejdź do koszyka').should('exist').click(); // 1
    cy.get('[data-testid="cart-item"]').should('not.exist'); // 2
    cy.get('[data-testid="cart-empty"]').should('exist'); // 3
    cy.url().should('include', '/'); // 4
    cy.get('[data-testid="cart-empty"]').should('have.text', 'Koszyk jest pusty.'); // 5
  });

  it('2. Add 1 product to cart and display it', () => {
    cy.get('@addButtons').first().click();
    cy.contains('Przejdź do koszyka').should('exist').click(); // 6
    cy.get('[data-testid="cart-item"]').should('exist'); // 7
    cy.get('[data-testid="cart-item"]').should('have.length', 1); // 8
    cy.get('[data-testid="cart-total"]').should('contain.text', 'zł'); // 9
    cy.get('[data-testid="cart-item"] span')
      .should('contain.text', 'zł') // 10
      .and('not.be.empty'); // 11
    cy.contains('Przejdź do płatności').should('exist'); // 12
  });

  it('3. Delete product from cart', () => {
    cy.get('@addButtons').first().click();
    cy.contains('Przejdź do koszyka').click();
    cy.get('[data-testid="cart-remove"]').should('exist').click(); // 13
    cy.get('[data-testid="cart-item"]').should('not.exist'); // 14
    cy.get('[data-testid="cart-empty"]').should('contain', 'Koszyk jest pusty'); // 15
    cy.get('[data-testid="cart-remove"]').should('not.exist'); // 16
  });

  it('4. Add several products to the cart and check the quantity', () => {
    cy.get('@addButtons').eq(0).click();
    cy.get('@addButtons').eq(1).click();
    cy.contains('Przejdź do koszyka').click();
    cy.get('[data-testid="cart-item"]').should('have.length', 2); // 17
    cy.get('[data-testid="cart-total"]').should('contain.text', 'zł'); // 18
    cy.get('[data-testid="cart-item"] span')
      .should('contain.text', 'zł') // 19
      .and('not.be.empty'); // 20
    cy.contains('Przejdź do płatności').should('exist'); // 21
  });

  it('5. Display the correct total in the basket', () => {
    cy.get('@addButtons').eq(0).click();
    cy.get('@addButtons').eq(1).click();
    cy.contains('Przejdź do koszyka').click();
    cy.get('[data-testid="cart-total"]').should('contain.text', 'Suma'); // 22
    cy.get('[data-testid="cart-total"]').should('contain.text', 'zł'); // 23
    cy.contains('Przejdź do płatności').should('exist'); // 24

    const getPrice = (text: string): number => {
      const regex = /(\d+(?:[.,]\d+)?)/;
      const match = regex.exec(text);
      return match ? parseFloat(match[1].replace(',', '.')) : 0;
    };

    cy.get('[data-testid="cart-item"] span').then(($items) => {
      const prices = $items.toArray().map((el) => getPrice(el.textContent ?? ''));
      const expectedTotal = prices.reduce((a, b) => a + b, 0);

      cy.get('[data-testid="cart-total"]')
        .invoke('text')
        .then((totalText) => {
          const displayedTotal = getPrice(totalText);
          expect(displayedTotal).to.be.equal(expectedTotal); // 25
        });
    });
  });

  it('6. Add the same product multiple times', () => {
    cy.get('@addButtons').first().click().click();
    cy.contains('Przejdź do koszyka').click();
    cy.get('[data-testid="cart-item"]').should('have.length', 2); // 26
    cy.get('[data-testid="cart-item"] span')
      .should('contain.text', 'zł') // 27
      .and('not.be.empty'); // 28
    cy.contains('Przejdź do płatności').should('exist'); // 29
  });

  it('7. Go back to product list from cart', () => {
    cy.contains('Przejdź do koszyka').click();
    cy.contains('Powrót do produktów').should('exist').click(); // 30
    cy.get('[data-testid="product-add"]').should('exist'); // 31
    cy.get('[data-testid="product-add"]').should('have.length.at.least', 1); // 32
    cy.contains('Produkty').should('exist'); // 33
  });

  it('8. Proceed to payment', () => {
    cy.get('@addButtons').first().click();
    cy.contains('Przejdź do koszyka').click();
    cy.contains('Przejdź do płatności').should('exist').click(); // 34
    cy.contains('Płatność').should('exist'); // 35
    cy.get('[data-testid="card-input"]').should('exist'); // 36
    cy.contains('Zapłać').should('exist'); // 37
  });

  it('9. Payment button is not visible when cart is empty', () => {
    cy.contains('Przejdź do koszyka').click();
    cy.contains('Przejdź do płatności').should('not.exist'); // 38
  });

  it('10. Cart resets after payment', () => {
    cy.get('@addButtons').first().click();
    cy.contains('Przejdź do koszyka').click();
    cy.contains('Przejdź do płatności').click();

    cy.get('[data-testid="card-input"]').should('exist').and('be.visible'); // 39
    cy.contains('Zapłać').should('exist').and('be.visible'); // 40

    cy.get('[data-testid="card-input"]').type('1234567812345678');

    cy.contains('Zapłać').click();
    cy.on('window:alert', (txt) => {
      expect(txt).to.equal('Płatność zakończona sukcesem! 🎉'); // 41
    });

    cy.get('[data-testid="product-add"]').should('exist'); // 42

    cy.contains('Przejdź do koszyka').click();
    cy.get('[data-testid="cart-item"]').should('not.exist'); // 43
    cy.get('[data-testid="cart-empty"]').should('contain.text', 'Koszyk jest pusty.'); // 44
  });

  it('11. Try to proceed to payment when cart is empty', () => {
    cy.contains('Przejdź do koszyka').click();
    cy.contains('Przejdź do płatności').should('not.exist'); // 45
  });

  it('12. Attempting payment with incorrect card number(too short)', () => {
    cy.get('@addButtons').first().click();
    cy.contains('Przejdź do koszyka').click();
    cy.contains('Przejdź do płatności').click();
  
    cy.get('[data-testid="card-input"]').type('1');
    
    cy.contains('Zapłać').click();
    
    cy.on('window:alert', (alertText) => {
      expect(alertText).to.equal('Numer karty musi składać się z 16 cyfr.'); // 46
    });
  });

  it('13. Attempting payment with incorrect card number(too long)', () => {
    cy.get('@addButtons').first().click();
    cy.contains('Przejdź do koszyka').click();
    cy.contains('Przejdź do płatności').click();
  
    cy.get('[data-testid="card-input"]').type('12341234123412341234');
    
    cy.contains('Zapłać').click();
    
    cy.on('window:alert', (alertText) => {
      expect(alertText).to.equal('Numer karty musi składać się z 16 cyfr.'); // 47
    });
  });

  it('14. Attempting payment with incorrect card number(correct length but no numbers)', () => {
    cy.get('@addButtons').first().click();
    cy.contains('Przejdź do koszyka').click();
    cy.contains('Przejdź do płatności').click();
  
    cy.get('[data-testid="card-input"]').type('abcdabcdabcdabcd');
    
    cy.contains('Zapłać').click();
    
    cy.on('window:alert', (alertText) => {
      expect(alertText).to.equal('Proszę podać numer karty.'); // 48
    });
  });

  it('15. Attempting payment with incorrect card number(no input)', () => {
    cy.get('@addButtons').first().click();
    cy.contains('Przejdź do koszyka').click();
    cy.contains('Przejdź do płatności').click();
    
    cy.contains('Zapłać').click();
    
    cy.on('window:alert', (alertText) => {
      expect(alertText).to.equal('Proszę podać numer karty.'); // 49
    });
  });

  it('16. Card input formats number with spaces every 4 digits', () => {
    cy.get('@addButtons').first().click();
    cy.contains('Przejdź do koszyka').click();
    cy.contains('Przejdź do płatności').click();
  
    cy.get('[data-testid="card-input"]').type('1234567812345678');
    cy.get('[data-testid="card-input"]').should('have.value', '1234 5678 1234 5678'); // 50
  });

  it('17. Show error alert when payment fails', () => {
    cy.get('@addButtons').first().click();
    cy.contains('Przejdź do koszyka').click();
    cy.contains('Przejdź do płatności').click();
  
    cy.get('[data-testid="card-input"]').type('1234567812345678');
  
    cy.intercept('POST', '**/payment', {
      statusCode: 500,
      body: {},
    }).as('failedPayment');
  
    cy.contains('Zapłać').click();
  
    cy.on('window:alert', (alertText) => {
      expect(alertText).to.equal('Błąd płatności.'); // 51
    });
  
    cy.wait('@failedPayment');
  });

  it('18. Removing one product does not remove others', () => {
    cy.get('@addButtons').eq(0).click();
    cy.get('@addButtons').eq(1).click();
    cy.contains('Przejdź do koszyka').click();
  
    cy.get('[data-testid="cart-item"]').should('have.length', 2); // 52
    cy.get('[data-testid="cart-remove"]').first().click();
    cy.get('[data-testid="cart-item"]').should('have.length', 1); // 53
  });

  it('19. Total price updates after removing product', () => {
    cy.get('@addButtons').eq(0).click();
    cy.get('@addButtons').eq(1).click();
    cy.contains('Przejdź do koszyka').click();
  
    const getPrice = (text: string): number => {
      const regex = /(\d+(?:[.,]\d+)?)/;
      const match = regex.exec(text);
      return match ? parseFloat(match[1].replace(',', '.')) : 0;
    };
  
    cy.get('[data-testid="cart-total"]').invoke('text').then((initialTotal) => {
      cy.get('[data-testid="cart-remove"]').first().click();
      cy.get('[data-testid="cart-total"]').invoke('text').then((updatedTotal) => {
        expect(getPrice(updatedTotal)).to.be.lessThan(getPrice(initialTotal)); // 54
      });
    });
  });

  it('20. Card input does not accept letters', () => {
    cy.get('@addButtons').first().click();
    cy.contains('Przejdź do koszyka').click();
    cy.contains('Przejdź do płatności').click();
  
    cy.get('[data-testid="card-input"]').type('abcd1234efgh5678');
    cy.get('[data-testid="card-input"]').invoke('val').should('match', /^[\d\s]+$/); // 55
  });
});
