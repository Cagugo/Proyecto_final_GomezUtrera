const cartDivId = document.getElementById('cartDivId');
const cartId = cartDivId.getAttribute('data-cart-id');
const irAPagarButton = document.querySelector('.ir_a_pagar_btn');

irAPagarButton.addEventListener('click', async () => {
  try {
    const response = await fetch(`/api/payments/${cartId}/stripePayment-intents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 200) {
      window.location.href = `/carts/payments/${cartId}`;
    } else {
      console.error('Error when making POST request');
    }
  } catch (error) {
    console.error('Error during payment processing:', error);
  }
});
