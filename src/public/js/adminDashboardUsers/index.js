const socket = io();
const deleteUserRow = (userId) => {
  try {
    const userRow = document.getElementById(userId);
    if (userRow) {
      userRow.remove();
    }
  } catch (error) {
    console.error('Error deleting user row:', error);
  }
};
document.addEventListener('DOMContentLoaded', function () {
  try {
    const registerForm = document.getElementById('registerForm');
    registerForm.addEventListener('submit', function (event) {
      try {
        event.preventDefault();

        const role = document.getElementById('role').value;
        const firstName = document.getElementById('first_name').value;
        const lastName = document.getElementById('last_name').value;
        const email = document.getElementById('email').value;
        const age = document.getElementById('age').value;
        const password = document.getElementById('password').value;
        const payload = {
          role: role,
          first_name: firstName,
          last_name: lastName,
          email: email,
          age: age,
          password: password,
        };
        fetch('/api/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })
          .then(function (response) {
            if (response.ok) {
              swal('Registered user', `User Email: ${email}`, 'success').then(function () {
                registerForm.reset();
                window.location.reload();
              });
            } else {
              response.json().then(function (data) {
                if (data.error && data.error === 'A user with the same email already exists') {
                  swal('Error', 'A user with the same email already exists', 'error');
                } else {
                  swal('Error', 'Failed to register user', 'error');
                }
              });
            }
          })
          .catch(function (error) {
            console.error(error);
          });
      } catch (error) {
        console.error('Error processing registration form:', error);
      }
    });
  } catch (error) {
    console.error('Error loading content:', error);
  }
});
const deleteUser = (id) => {
  try {
    fetch(`/api/users/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          socket.emit('deleteUser', id);
        } else {
          console.error('Error deleting user');
        }
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
      });
  } catch (error) {
    console.error('Error when trying to delete user:', error);
  }
};
document.addEventListener('DOMContentLoaded', function () {
  try {
    const updateForm = document.getElementById('userUpdate');
    updateForm.addEventListener('submit', function (event) {
      try {
        event.preventDefault();

        const uid = document.getElementById('_idUpdate').value;
        const newRole = document.getElementById('roleUpdate').value;
        const userData = {
          role: newRole,
        };
        fetch(`/api/users/${uid}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        })
          .then((response) => {
            if (response.ok) {
              console.log('Successful update');
              swal('Updated user role', `ID: ${uid}\nRole: ${newRole}`, 'success').then(function () {
                window.location.reload();
              });
            } else {
              swal('The ID does not exist in the database.', `User ID: ${uid}`, 'error').then(function () {
                window.location.reload();
              });
              console.error('Request error:', response.status);
            }
          })
          .catch((error) => {
            console.error('Request error:', error);
          });
      } catch (error) {
        console.error('Error processing update form:', error);
      }
    });
  } catch (error) {
    console.error('Error loading content:', error);
  }
});
socket.on('deleteUser', deleteUserRow);
socket.on('totalUsersUpdate', (totalUsers) => {
  document.getElementById('totalUsersValue').innerText = totalUsers;
});
const deleteInactiveUsers = document.getElementById('deleteInactiveUsers');
deleteInactiveUsers.addEventListener('click', async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('/api/users/', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roles: ['ADMIN'],
      }),
    });
    if (response.ok) {
      swal('¡Users successfully deleted!', '', 'success').then(function () {
        window.location.reload();
      });
    } else {
      swal('No inactive users have been removed', '', 'info');
      console.error('No inactive users found');
    }
  } catch (error) {
    console.error('POST request failed:', error);
  }
});
