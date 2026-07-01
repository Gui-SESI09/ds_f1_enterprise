import { usuariosController  } from "../controllers/usuariosControllers.js";
import { validarUsuario, validarLogin } from "../middlewares/usuariosValidate.js";
import { verificarJWT } from "../middlewares/jwtVerify.js"

export default async function rotasUsuario(servidor, options) {

    const {sql} = options;
    
    servidor.get('/usuario', { preHandler: verificarJWT }, async (request, reply) => {
        return usuariosController.get_u(request, reply, sql);
    });
    
    servidor.post('/usuario', {preHandler: [verificarJWT, validarUsuario] }, async (request, reply) => {
        return usuariosController.post_u(request, reply, sql);
    });
    
    servidor.put('/usuario/:id', {preHandler: [verificarJWT, validarUsuario]}, async (request, reply) => {
        return usuariosController.put_u(request, reply, sql);
    });
    
    servidor.delete('/usuario/:id', {preHandler: [verificarJWT] }, async (request, reply) => {
        return usuariosController.delete_u(request, reply, sql);
    });

    servidor.post('/api/auth/login', {preHandler: validarLogin}, async (request, reply) => {
        return usuariosController.login_u(request, reply, sql);
    });
}