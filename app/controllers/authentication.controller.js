const usuarios = [{
    user : "a",
    email : "a@a.com",
    password: "a"
}]

async function login(req,res){

}

async function register(req,res){
    console.log(req.body);
    const user = req.body.user;
    const email = req.body.email;
    const password = req.body.password;
    if (!user || !email || !password) {
        res.status(400).send({status: "Error",message: "Campos Vacios"})
    }
    const usuarioARevisar = usuarios.find(usuario => usuario.user === user);
    if (usuarioARevisar) {
        res.status(400).send({status: "Error",message: "Usuario Existente"})
    }
}

export const methods = {
    login,
    register
}