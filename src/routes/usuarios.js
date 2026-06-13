import { usuariosController  } from "../controllers/usuariosControllers.js";

export default async function rotasUsuario(servidor, options) {

    const {sql} = options;
    
    servidor.get('/usuario', async (request, reply) => {
    return usuariosController.get_u(request, reply, sql);
    });

    servidor.post('/usuario', async (request, reply) => {
    return usuariosController.post_u(request, reply, sql);
    });

    servidor.put('/usuario/:id', async (request, reply) => {
    return usuariosController.put_u(request, reply, sql);
    });

    servidor.delete('/usuario/:id', async (request, reply) => {
    return usuariosController.delete_u(request, reply, sql);
    });
}