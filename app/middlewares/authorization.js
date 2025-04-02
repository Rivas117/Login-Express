// Este archivo define funciones que sirven para proteger rutas.
// Las rutas protegidas solo pueden ser accedidas por usuarios que hayan iniciado sesión (autenticados con JWT).

import jsonwebtoken from "jsonwebtoken"; // Importamos jsonwebtoken para verificar el token
import dotenv from "dotenv"; // Cargamos las variables de entorno desde el archivo .env
import {usuarios} from "./../controllers/authentication.controller.js"; // Importamos los usuarios para verificar si existen

dotenv.config(); // Activamos dotenv para leer las variables

// ======================================
// Función soloAdmin
// ======================================
// Esta función verifica si el usuario está logueado. Si lo está, deja que acceda a rutas privadas (como /admin)
// Si no lo está, lo redirige a la página principal (login)
function soloAdmin(req,res,next){
  const logueado = revisarCookie(req); // Llama a revisarCookie para ver si el token está presente y es válido
  if(logueado) return next(); // Si está logueado, pasa al siguiente paso (middleware o ruta)
  return res.redirect("/") // Si no, lo mandamos al login
}

// ======================================
// Función soloPublico
// ======================================
// Esta función es lo opuesto: si el usuario ya está logueado, lo redirige al área de admin
// Sirve para que alguien que ya está dentro no vea de nuevo el login o registro
function soloPublico(req,res,next){
  const logueado = revisarCookie(req); // Verifica si hay un token válido
  if(!logueado) return next(); // Si NO está logueado, que siga normalmente a la página pública
  return res.redirect("/admin") // Si ya está logueado, lo redirige al admin
}

// ======================================
// Función revisarCookie
// ======================================
// Esta es la función clave: revisa si el navegador del usuario tiene una cookie llamada "jwt"
// Si la tiene, la decodifica y busca si el usuario existe en la lista de usuarios
function revisarCookie(req){
  try{
    // Buscamos la cookie llamada jwt entre todas las cookies del navegador
    const cookieJWT = req.headers.cookie.split("; ").find(cookie => cookie.startsWith("jwt=")).slice(4);

    // Verificamos y decodificamos el token usando la clave secreta
    const decodificada = jsonwebtoken.verify(cookieJWT,process.env.JWT_SECRET);
    console.log(decodificada) // Mostramos el contenido del token

    // Buscamos en la lista de usuarios si el usuario del token existe
    const usuarioAResvisar = usuarios.find(usuario => usuario.user === decodificada.user);
    console.log(usuarioAResvisar)

    // Si no existe, devolvemos false (no está logueado realmente)
    if(!usuarioAResvisar){
      return false
    }

    // Si existe, devolvemos true (todo está bien)
    return true;
  }
  catch{
    // Si algo falla (por ejemplo, no hay token o está mal formado), devolvemos false
    return false;
  }
}

// Exportamos las funciones para que puedan usarse en el servidor (por ejemplo en las rutas)
export const methods = {
  soloAdmin,
  soloPublico,
}