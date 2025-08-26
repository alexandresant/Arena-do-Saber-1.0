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
      
    }
  ]
}