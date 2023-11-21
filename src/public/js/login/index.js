document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
      const response = await fetch('/api/session/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log('DATA', data);
      if (response.status === 200) {
        const userRole = data.payload.payload.data.role;
        console.log('status===200', userRole);
        if (userRole === 'admin') {
          window.location.href = '/admin';
        } else if (userRole === 'user' || userRole === 'premium') {
          window.location.href = '/products';
        }
      } else {
        swal('Error', data.error, 'error');
      }
    } catch (error) {
      console.error('Error during login:', error);
      swal('Error', 'Invalid credentials', 'error');
    }
  });
});
