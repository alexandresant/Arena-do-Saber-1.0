/**
 * character controller
 */

import { factories } from '@strapi/strapi';
import { calculatedDerived } from '../services/character';
let objeto = {}

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

      const derived = calculatedDerived(template.level, template.strenghtBase, template.intelligenceBase, template.agilityBase, template.constitutionBase, template.defenseBase)
      console.log('Valores derivados:', derived);

      // Cria o personagem copiando os atributos do template
      const newCharacter = await strapi.entityService.create("api::character.character", {
        data: {
          name: template.name,
          nickName,
          level: template.level,
          strength: template.strenghtBase,
          intelligence: template.intelligenceBase,
          agility: template.agilityBase,
          constitution: template.constitutionBase,
          character_template: template.id,
          users_permissions_user: userId,
          publishedAt: new Date(),
          experience: 0,
          points: 0,
          hp: derived.hp,
          mana: derived.mana,
          attack: derived.attack,
          magicAttack: derived.magicAttack,
          evasion: derived.evasion,
          critChance: derived.critChance,
          defense: derived.defenseTotal
        }
      })
      objeto = newCharacter
      return newCharacter;
    } catch (error) {
      console.error(error);
      return ctx.internalServerError("Erro ao criar personagem + " + objeto)
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
          where: { users_permissions_user: { id: user.id } }
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
  },

  async findCharacter(ctx) {
    try {
      const user = ctx.state.user; // Obtém o usuário logado

      if (!user) {
        return ctx.unauthorized("Você não está autenticado.");
      }

      // Verifica se já existe um personagem para este usuário
      const character = await strapi.db
        .query('api::character.character')
        .findOne({
          where: { users_permissions_user: { id: user.id } }
        });

      // Retorna true ou false com base no resultado da busca
      if (character) {
        return { character };
      } else {
        return { hasCharacter: false };
      }

    } catch (error) {
      console.error(error);
      return ctx.internalServerError("Erro ao verificar personagem.");
    }
  },

  async ranking(ctx) {
    try {
      const ranking = await strapi.entityService.findMany(
        "api::character.character",
        {
          populate: "*",
          //sort: { points: "DESC" },
          //pagination: { pageSize: 1000 },
        }
      );

      return ranking;

    } catch (error) {
      console.error("Erro ao carregar ranking:", error);
      return ctx.internalServerError("Erro ao carregar ranking.");
    }
  },

 async update(ctx) {
        const { id } = ctx.params;
        const { data } = ctx.request.body;

        try {
            // O Strapi 5 usa o ID numérico ou documentId conforme a rota
            const response = await strapi.entityService.update("api::character.character", id, {
                data: data
            });
            return response;
        } catch (error) {
            console.error("Erro no update:", error);
            return ctx.internalServerError("Não foi possível atualizar o personagem.");
        }
    },
}));

