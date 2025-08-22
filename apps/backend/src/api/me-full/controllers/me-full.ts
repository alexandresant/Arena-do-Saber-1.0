// src/api/me-full/controllers/me-full.ts

import { Context } from 'koa';

export default {
  async me(ctx: Context) {
    if (!ctx.state.user) {
      return ctx.unauthorized('Você não está autorizado.');
    }
    
    const { id } = ctx.state.user;
    
    // Use o serviço oficial do Strapi para buscar o usuário e popular a role
    const user = await strapi.service('plugin::users-permissions.user').fetchAuthenticatedUser(id, {
        populate: ['role'],
    });

    if (!user) {
      return ctx.notFound('Usuário não encontrado.');
    }

    // Retorne a resposta com o corpo do usuário
    ctx.body = user;
  },
};