const stripePublicKey = 'pk_test_51O69qCIUsFN5LUdhh17aixOzY2F9cdE6ObjOtapbb2mevmnGoHRI0OUuGWw33IajRfbLd1KktEPd0q56004fsYsn003FFRF4N9';
const stripe = Stripe(stripePublicKey);
const elements = stripe.elements();
const card = elements.create('card');
card.mount('#card-element');

const form = document.getElementById('payment-form');
const cardError = document.getElementById('card-errors');
const submitFinalizarBtn = document.getElementById('submit-finalizar-btn');
const cartDivId = document.getElementById('cartDivId');
const cartId = cartDivId.getAttribute('data-cart-id');
const emailDivId = document.getElementById('emailDivId');
const userEmail = cartDivId.getAttribute('data-email-id');

submitFinalizarBtn.addEventListener('click', async function () {
  try {
    const result = await stripe.createToken(card);
    if (result.error) {
      cardError.textContent = result.error.message;
    } else {
      const token = result.token.id;
      await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token }),
      });
      try {
        const purchaseResponse = await fetch(`/api/carts/${cartId}/purchasecart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (purchaseResponse.ok) {
          swal({
            title: '¡Purchase made!',
            text: 'Check your email box with purchase details.',
            icon: 'success',
            buttons: {
              confirm: 'Repurchase',
            },
          }).then(function () {
            window.location.href = '/products';
          });
        } else {
          swal('Error', 'There was a problem when making the purchase. Try it again later.', 'error');
        }
      } catch (error) {
        console.error('Error during purchase:', error);
      }
    }
  } catch (error) {
    console.error('Error during payment:', error);
  }
});
