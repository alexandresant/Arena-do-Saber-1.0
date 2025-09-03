

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/characters/create-character',
      handler: 'api::character.character.createCharacter',
      config: {
        auth: {
          scope: [],
        },
      },
    },
    {
      method: "GET",
      path: "/characters/check-character",
      handler: "api::character.character.checkCharacter",     
    },
    {
      method: 'GET',
      path: '/characters',
      handler: 'api::character.character.findCharacter', // rota core
    },
  ]
}