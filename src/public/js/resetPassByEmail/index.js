const mostrarSweetAlertSuccess = () => {
  swal('Email sent!', 'Check your email inbox to reset your password.', 'success').then(function () {
    window.location.href = '/';
  });
};
const mostrarSweetAlertError = () => {
  swal('¡Email no registrado!', 'Complete el formulario de registro y una vez registrado ingrese por Login', 'error').then(function () {
    window.location.href = '/register';
  });
};
const submitForm = async (event) => {
  event.preventDefault();
  try {
    const email = document.getElementById('email').value;
    const response = await fetch(`/api/users/resetpassbyemail?email=${email}`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    if (data.success) {
      mostrarSweetAlertSuccess();
    } else {
      mostrarSweetAlertError();
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
