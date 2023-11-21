const socket = io();
const deleteCartRow = (pid) => {
  try {
    const documentRow = document.getElementById(pid);
    if (documentRow) {
      documentRow.remove();
    }
    const totalCartProducts = parseInt(document.getElementById('totalProductosCarrito').textContent);
    if (totalCartProducts === 0) {
      emptyCartDiv();
    }
  } catch (error) {
    console.error('Error deleting cart row:', error);
  }
};
const deleteAllRows = () => {
  try {
    const comprarBtn = document.querySelector('.comprar_btn');
    const tableBody = document.querySelector('.tbody');
    if (tableBody) {
      while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
        comprarBtn.disabled = true;
      }
    }
  } catch (error) {
    console.error('Error deleting all rows from cart:', error);
  }
};
const emptyCartDiv = () => {
  try {
    const emptyCartDiv = document.querySelector('.emptyCart');
    if (emptyCartDiv) {
      while (emptyCartDiv.firstChild) {
        emptyCartDiv.removeChild(emptyCartDiv.firstChild);
      }
    }
  } catch (error) {
    console.error('Error emptying cart contents:', error);
  }
};
const updateTotalCartProducts = (total) => {
  try {
    const totalProductosCarrito = document.getElementById('totalProductosCarrito');
    if (totalProductosCarrito) {
      totalProductosCarrito.textContent = total;
    }
  } catch (error) {
    console.error('Error updating the total quantity of products in the cart:', error);
  }
};
const updateTotalAmount = (total) => {
  try {
    const totalAmountValue = document.getElementById('totalAmountValue');
    if (totalAmountValue) {
      totalAmountValue.textContent = total;
    }
  } catch (error) {
    console.error('Error updating total amount in cart:', error);
  }
};
const cartDivId = document.getElementById('cartDivId');
const cartId = cartDivId.getAttribute('data-cart-id');
const deleteCartProduct = (pid) => {
  try {
    fetch(`/api/carts/${cartId}/product/${pid}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          socket.emit('deleteCartProduct', pid);
        } else {
          console.error('Error deleting product');
        }
      })
      .catch((error) => {
        console.error('Error deleting product:', error);
      });
  } catch (error) {
    console.error('Product removal request failed:', error);
  }
};
const deleteAllProductsCart = () => {
  try {
    fetch(`/api/carts/${cartId}/products`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          socket.emit('deleteAllProductsCart', cartId);
        } else {
          console.error('Error emptying cart');
        }
      })
      .catch((error) => {
        console.error('Error emptying cart:', error);
      });
  } catch (error) {
    console.error('Request to remove all products from cart failed:', error);
  }
};
socket.on('deleteCartProduct', deleteCartRow);
socket.on('updateTotalCartProducts', (total) => {
  updateTotalCartProducts(total);
  document.getElementById('totalAmountValue').innerText = totalAmount;
});
socket.on('deleteAllProductsCart', () => {
  deleteAllRows();
  updateTotalCartProducts(0);
  updateTotalAmount(0);
  emptyCartDiv();
});
socket.on('totalAmount', (totalAmount) => {
  document.getElementById('totalAmountValue').innerText = totalAmount;
});
