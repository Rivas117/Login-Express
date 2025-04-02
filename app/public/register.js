// Este archivo del navegador maneja el formulario de registro
// Cuando alguien se registra, este código envía los datos al servidor y maneja la respuesta

// Obtenemos el mensaje de error (que está escondido por defecto en el HTML)
const mensajeError = document.getElementsByClassName("error")[0];

// Escuchamos el envío del formulario de registro con un evento
// Cuando se presiona el botón, ejecutamos la función

document.getElementById("register-form").addEventListener("submit", async(e) => {
  e.preventDefault(); // Evitamos que se recargue la página automáticamente

  // Mostramos en consola el valor del campo user para depuración
  console.log(e.target.children.user.value);

  // Hacemos una petición al servidor con fetch para registrar al nuevo usuario
  const res = await fetch("http://localhost:4000/api/register", {
    method: "POST",
    headers: {
      "Content-Type" : "application/json" // Indicamos que el contenido que enviamos es JSON
    },
    body: JSON.stringify({
      user: e.target.children.user.value, // nombre de usuario escrito
      email: e.target.children.email.value, // correo escrito
      password: e.target.children.password.value // contraseña escrita
    })
  });

  // Si hubo un error al registrar (por ejemplo, usuario ya existe), mostramos el mensaje de error
  if (!res.ok) return mensajeError.classList.toggle("escondido", false);

  // Si fue exitoso, convertimos la respuesta a JSON
  const resJson = await res.json();

  // Si la respuesta dice que redirijamos, mandamos al usuario a esa URL
  if (resJson.redirect) {
    window.location.href = resJson.redirect;
  }
});