// Este archivo es el "cerebro" que maneja lo que pasa cuando un usuario intenta registrarse o iniciar sesión.
// Es parte del servidor, es decir, del backend. Es donde se verifica si los datos del usuario están correctos.

// Importamos librerías necesarias:
import bcryptjs from "bcryptjs"; // Sirve para encriptar contraseñas y compararlas
import jsonwebtoken from "jsonwebtoken"; // Sirve para generar un "token" que identifica al usuario
import dotenv from "dotenv"; // Permite usar variables de entorno desde un archivo .env

// Activamos dotenv para que cargue las variables del archivo .env
dotenv.config();

// Creamos un array que simula una base de datos con usuarios registrados.
// En este ejemplo, hay un solo usuario guardado como ejemplo.
export const usuarios = [{
  user: "a", // nombre de usuario
  email: "a@a.com", // correo
  password: "$2a$05$nLY2It8riku2vwwDIINdgO/XIyPXRg1Gn9LFgnhwKqC4TwcAwEUL2" // contraseña encriptada
}];

// ===============================
// FUNCIÓN DE LOGIN
// ===============================

// Esta función se llama cuando alguien quiere iniciar sesión
async function login(req, res) {
  // Mostramos en consola lo que nos mandó el cliente (usuario)
  console.log(req.body);

  // Extraemos el usuario y contraseña desde el cuerpo del mensaje (req.body)
  const user = req.body.user;
  const password = req.body.password;

  // Verificamos si alguno de los dos campos está vacío
  if (!user || !password) {
    return res.status(400).send({ status: "Error", message: "Los campos están incompletos" });
  }

  // Buscamos en el array si existe un usuario con ese nombre
  const usuarioAResvisar = usuarios.find(usuario => usuario.user === user);

  // Si no lo encontramos, devolvemos error
  if (!usuarioAResvisar) {
    return res.status(400).send({ status: "Error", message: "Error durante login" });
  }

  // Comparamos la contraseña que ingresó el usuario con la contraseña guardada (encriptada)
  const loginCorrecto = await bcryptjs.compare(password, usuarioAResvisar.password);

  // Si no coincide, devolvemos error
  if (!loginCorrecto) {
    return res.status(400).send({ status: "Error", message: "Error durante login" });
  }

  // Si todo está bien, generamos un token (como un pase especial)
  const token = jsonwebtoken.sign(
    { user: usuarioAResvisar.user }, // Lo que guardamos dentro del token
    process.env.JWT_SECRET, // Clave secreta para firmar el token (viene del archivo .env)
    { expiresIn: process.env.JWT_EXPIRATION } // Duración del token (también del .env)
  );

  // Configuración para la cookie que vamos a enviar con el token
  const cookieOption = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
    path: "/"
  };

  // Enviamos la cookie al navegador del usuario con el token
  res.cookie("jwt", token, cookieOption);

  // Finalmente, respondemos que todo salió bien
  res.send({ status: "ok", message: "Usuario loggeado", redirect: "/admin" });
}

// ===============================
// FUNCIÓN DE REGISTER
// ===============================

// Esta función se llama cuando alguien quiere crear una cuenta nueva
async function register(req, res) {
  const user = req.body.user;
  const password = req.body.password;
  const email = req.body.email;

  // Verificamos que ningún campo esté vacío
  if (!user || !password || !email) {
    return res.status(400).send({ status: "Error", message: "Los campos están incompletos" });
  }

  // Buscamos si ya existe un usuario con ese nombre
  const usuarioAResvisar = usuarios.find(usuario => usuario.user === user);

  // Si ya existe, no se puede registrar otra vez con el mismo nombre
  if (usuarioAResvisar) {
    return res.status(400).send({ status: "Error", message: "Este usuario ya existe" });
  }

  // Generamos un "sal" (salt) que ayuda a encriptar la contraseña
  const salt = await bcryptjs.genSalt(5);

  // Encriptamos la contraseña con ese salt
  const hashPassword = await bcryptjs.hash(password, salt);

  // Creamos un nuevo objeto de usuario con los datos encriptados
  const nuevoUsuario = {
    user,
    email,
    password: hashPassword
  };

  // Lo agregamos al array de usuarios
  usuarios.push(nuevoUsuario);

  // Mostramos en consola todos los usuarios (para pruebas)
  console.log(usuarios);

  // Respondemos que el registro fue exitoso
  return res.status(201).send({ status: "ok", message: `Usuario ${nuevoUsuario.user} agregado`, redirect: "/" });
}

// Exportamos las funciones para que puedan usarse en otros archivos del servidor
export const methods = {
  login,
  register
};