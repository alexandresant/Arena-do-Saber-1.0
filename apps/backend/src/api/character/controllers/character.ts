/**
 * character controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::character.character', ({strapi}) =>({
    
    async createCharacter(ctx){
        try{
            const { userId, templateId, name } = ctx.request.body

            if(!userId || !templateId || !name){
                return(
                    ctx.badRequest("Faltam parâmetros obrigatórios.")
                )
            }
            
            //Busca template
            const template = await strapi.entityService.findOne(
                "api::character-template.character-template",
                templateId
            )

            if(!template){
                return(
                    ctx.notFound("Template não encontrado.")
                )
            }

            //Cria personagem copiando atributos do template
            const newCharacter = await strapi.entityService.create("api::character.character", {
                data: {
                    name,
                    level: template.level,
                    strength: template.strengthBase,
                    intelligence: template.intelligenceBase,
                    agility: template.agilityBase,
                    constitution: template.constitutionBase,
                    template: templateId,
                    user: userId,
                    publishedAt: new Date()
                }
            })
            return newCharacter
        }
        catch(error){
            console.error(error)
            return (
                ctx.internalServerError("Erro ao criar personagem")
            )
        }
    }
}));
