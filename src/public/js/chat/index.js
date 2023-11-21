const socket = io();

let user = null;

const promptEmail = () => {
  return swal({
    text: 'Write your Email',
    content: {
      element: 'input',
      attributes: {
        placeholder: 'name@mail.com',
        type: 'email',
      },
    },
    button: {
      text: 'Star Chat',
      closeModal: true,
    },
  });
};
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
const startChat = () => {
  try {
    promptEmail().then((name) => {
      if (!name || !validateEmail(name)) {
        swal('Invalid email', 'Please enter a valid email', 'error').then(() => {
          startChat();
        });
      } else {
        user = name;
        const nameElement = document.getElementById('user-name');
        nameElement.innerHTML = `<b>Logged in user:</b> ${user}`;
      }
    });
  } catch (error) {
    console.error('Error during startChat:', error);
  }
};
startChat();
let message = document.getElementById('message');
let btnEnviar = document.getElementById('send');
let chat_contenedor = document.getElementById('chat');

const sendMessage = () => {
  try {
    if (!user) {
      swal('Error', 'You must enter your email first', 'error');
      return;
    }
    if (!message.value.trim()) {
      swal('Error', 'The message cannot be empty', 'error');
      return;
    }
    const payload = {
      user: user,
      message: message.value,
    };
    socket.emit('message', payload);
    fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        message.value = '';
      })
      .catch((error) => {
        console.error('Error during sendMessage fetch:', error);
      });
  } catch (error) {
    console.error('Error during sendMessage:', error);
  }
};
btnEnviar.addEventListener('click', sendMessage);
message.addEventListener('keydown', (evt) => {
  if (evt.key === 'Enter') {
    evt.preventDefault();
    sendMessage();
  }
});
const loadChat = () => {
  try {
    socket.on('init', (data) => {
      loadData(data);
    });
  } catch (error) {
    console.error('Error during loadChat:', error);
  }
};
const readSockets = () => {
  try {
    loadChat();
    socket.on('newMessage', (data) => {
      loadData(data);
    });
  } catch (error) {
    console.error('Error during readSockets:', error);
  }
};
const loadData = (data) => {
  try {
    let innerHtml = '';
    data.forEach((msj) => {
      innerHtml += `<b>${msj.user}:</b> <span>${msj.message}</span><br>`;
    });
    chat_contenedor.innerHTML = innerHtml;
  } catch (error) {
    console.error('Error during loadData:', error);
  }
};
readSockets();
