document.addEventListener('DOMContentLoaded', function () {
  const registerForm = document.getElementById('recoveryForm');
  registerForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    try {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const payload = {
        email: email,
        password: password,
      };
      const response = await fetch('/api/users/resetpass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        swal('Password Recovered', 'Login with your Email and your new Password', 'success').then(function () {
          window.location.href = '/';
        });
      } else {
        try {
          const data = await response.json();
          if (data.error) {
            if (data.error === 'User not found') {
              swal('User does not exist', 'Password could not be recovered', 'error');
            } else if (data.error === 'The new password is the same as the current password. Cannot enter the same password.') {
              swal('Same password', 'The new password entered is the same as the current password. Please try again with another password.', 'error');
            } else {
              swal('Error', 'Could not recover password', 'error');
            }
          } else {
            swal('Error', 'Could not recover password', 'error');
          }
        } catch (error) {
          console.error('Error parsing error response:', error);
        }
      }
    } catch (error) {
      console.error('Error during password reset:', error);
      swal('Error', 'Could not recover password', 'error');
    }
  });
});
