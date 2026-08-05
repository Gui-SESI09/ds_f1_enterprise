import { patrocinadoresController } from "../controllers/patrocinadoresControllers.js";
import {
  validarPatrocinador,
  validarPatrocinadorParcial,
} from "../middlewares/patrocinadoresValidate.js";

export default async function rotasPatrocinador(servidor, options) {
  const { sql } = options;

  servidor.get("/patrocinadores", async (request, reply) => {
    return patrocinadoresController.get_p(request, reply, sql);
  });

  servidor.get("/patrocinadores/:id", async (request, reply) => {
    return patrocinadoresController.get_p_id(request, reply, sql);
  });

  servidor.post(
    "/patrocinadores",
    { preHandler: validarPatrocinador },
    async (request, reply) => {
      return patrocinadoresController.post_p(request, reply, sql);
    }
  );

  servidor.put(
    "/patrocinadores/:id",
    { preHandler: validarPatrocinadorParcial },
    async (request, reply) => {
      return patrocinadoresController.put_p(request, reply, sql);
    }
  );

  servidor.delete("/patrocinadores/:id", async (request, reply) => {
    return patrocinadoresController.delete_p(request, reply, sql);
  });
}
