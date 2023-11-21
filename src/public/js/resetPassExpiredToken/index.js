const mostrarSweetAlertSuccess = () => {
  swal('Email sent!', 'Check your email inbox to reset your password.', 'success').then(() => {
    window.location.href = '/';
  });
};
const mostrarSweetAlertError = () => {
  swal('¡Email not registered!', 'Complete the registration form and once registered, enter Login', 'error').then(() => {
    window.location.href = '/register';
  });
};
const submitForm = async (event) => {
  event.preventDefault();
  try {
    const email = document.getElementById('email').value;
    const response = await fetch(`/api/users/resetpassbyemail?email=${email}`, {
      method: 'GET',
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
