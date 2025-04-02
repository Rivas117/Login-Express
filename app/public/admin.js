// Este archivo se ejecuta cuando estás en la pantalla de administración (admin.html)
// Se encarga de cerrar la sesión del usuario si presiona el botón de "Cerrar sesión"

// Obtenemos el primer botón de la página (hay solo uno) y le agregamos un evento al hacer clic
// Cuando se hace clic:
// 1. Borramos la cookie que contiene el token (el identificador del usuario)
// 2. Redirigimos al usuario nuevamente a la página de login (inicio)
document.getElementsByTagName("button")[0].addEventListener("click", () => {
  // Borramos la cookie llamada "jwt" asignándole una fecha de expiración antigua
  // Esto hace que el navegador la elimine automáticamente
  document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

  // Redirigimos al usuario al inicio del sitio (que será login.html)
  document.location.href = "/"
});
