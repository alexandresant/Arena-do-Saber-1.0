/**
 * character controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::character.character', ({ strapi }) => ({

    async createCharacter(ctx) {
        try {
            const { userId, id, nickName } = ctx.request.body;

            // Extrai o ID do usuário de forma segura, tratando a tipagem
            const finalUserId = (userId && typeof userId === 'object' && userId.set && userId.set[0])
                ? userId.set[0].id
                : userId;

            if (!finalUserId || !id || !nickName) {
                return ctx.badRequest("Faltam parâmetros obrigatórios.");
            }

            // Verifica se já existe um personagem para este usuário antes de criar
            const existingCharacter = await strapi.db
                .query('api::character.character')
                .findOne({
                    where: { users_permissions_user: { id: finalUserId } }
                });

            if (existingCharacter) {
                return ctx.badRequest("Já existe um personagem associado a este usuário.");
            }

            // Busca o template
            const template = await strapi.entityService.findOne(
                "api::character-template.character-template",
                id
            );

            if (!template) {
                return ctx.notFound("Template não encontrado.");
            }

            // Cria o personagem copiando os atributos do template
            const newCharacter = await strapi.entityService.create("api::character.character", {
                data: {
                    nickName,
                    level: template.level,
                    strength: template.strenghtBase,
                    intelligence: template.intelligenceBase,
                    agility: template.agilityBase,
                    constitution: template.constitutionBase,
                    character_template: template.id,
                    users_permissions_user: userId,
                    publishedAt: new Date()
                }
            });

            return newCharacter;
        } catch (error) {
            console.error(error);
            return ctx.internalServerError("Erro ao criar personagem");
        }
    },

    async checkCharacter(ctx) {
      try {
        const user = ctx.state.user; // Obtém o usuário logado

        if (!user) {
          return ctx.unauthorized("Você não está autenticado.");
        }

        // Verifica se já existe um personagem para este usuário
        const existingCharacter = await strapi.db
            .query('api::character.character')
            .findOne({
                where: { users_permissions_user: {id: user.id} }
            });

        // Retorna true ou false com base no resultado da busca
        if (existingCharacter) {
          return { hasCharacter: true, character: existingCharacter };
        } else {
          return { hasCharacter: false };
        }

      } catch (error) {
        console.error(error);
        return ctx.internalServerError("Erro ao verificar personagem.");
      }
    }
}));

