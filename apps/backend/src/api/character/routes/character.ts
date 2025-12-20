module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/characters/create-character',
      handler: 'api::character.character.createCharacter',
    },
    {
      method: "GET",
      path: "/characters/check-character",
      handler: "api::character.character.checkCharacter",     
    },
    {
      method: 'GET',
      path: '/characters',
      handler: 'api::character.character.findCharacter',
    },
    // ADICIONE ESTA ROTA PARA O UPDATE FUNCIONAR
    {
      method: 'PUT',
      path: '/characters/:id',
      handler: 'api::character.character.update',
    },
    // ADICIONE ESTA ROTA PARA O RANKING FUNCIONAR
    {
      method: 'GET',
      path: '/characters/ranking',
      handler: 'api::character.character.ranking',
    },
  ]
}