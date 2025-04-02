// Este archivo funciona del lado del navegador (frontend)
// Se encarga de escuchar el evento del formulario de login y enviar los datos al servidor

// Buscamos el elemento HTML que tiene la clase "error" (el mensaje de error que aparece si fallamos al loguearnos)
const mensajeError = document.getElementsByClassName("error")[0];

// Obtenemos el formulario por su ID y le agregamos un evento que se ejecutará cuando lo envíen
// Es decir, cuando el usuario presione el botón "Iniciar sesión"
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault(); // Esto evita que el formulario recargue la página automáticamente

  // Extraemos los valores escritos por el usuario en los campos de nombre y contraseña
  const user = e.target.children.user.value;
  const password = e.target.children.password.value;

  // Enviamos esos datos al servidor con fetch (una solicitud POST)
  const res = await fetch("http://localhost:4000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json" // Indicamos que vamos a enviar JSON
    },
    body: JSON.stringify({ user, password }) // Convertimos los datos del usuario a texto JSON
  });

  // Si la respuesta NO fue exitosa (por ejemplo: contraseña incorrecta), mostramos el mensaje de error
  if (!res.ok) return mensajeError.classList.toggle("escondido", false);

  // Si fue exitosa, convertimos la respuesta en formato JSON
  const resJson = await res.json();

  // Si la respuesta contiene una redirección, mandamos al usuario a esa ruta (por ejemplo: /admin)
  if (resJson.redirect) {
    window.location.href = resJson.redirect;
  }
});