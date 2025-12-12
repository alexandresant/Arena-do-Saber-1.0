// src/extensions/users-permissions/strapi-server.ts
console.log("Estou rodando")
import { Context } from 'koa';

export default (plugin: any) => {
  plugin.controllers.user = {
    async me(ctx: Context) {
      if (!ctx.state.user) {
        return ctx.unauthorized('Você não está autorizado.');
      }
      
      const strapiInstance = ctx.strapi as any;
      const { id } = ctx.state.user;

      // Busque o usuário e force a populacao da role
      const user = await strapiInstance.db.query('plugin::users-permissions.user').findOne({
        where: { id },
        populate: ['role'], // Popula a role diretamente
      });

      if (!user) {
        return ctx.notFound('Usuário não encontrado.');
      }

      // Envie a resposta com a role
      ctx.body = user;
    },
  };

  return plugin;
};