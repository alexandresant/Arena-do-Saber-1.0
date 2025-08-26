/**
 * character controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::character.character', ({strapi}) =>({
    
    async createCharacter(ctx){
        try{
            const { userId, characterId, nickName } = ctx.request.body

            if(!userId || !characterId || !nickName){
                return(
                    ctx.badRequest("Faltam parâmetros obrigatórios." + userId + " " + characterId + " " + nickName)
                    
                    
                )
            }
            
            //Busca template
            const template = await strapi.entityService.findOne(
                "api::character-template.character-template",
                characterId
            )

            if(!template){
                return(
                    ctx.notFound("Template não encontrado.")
                )
            }

            //Cria personagem copiando atributos do template
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
