/**
 * character router
 */

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/create-character',
      handler: 'character.createCharacter',
      config: {
        auth: {
          scope: [],
        },
      },
    },
  ],
};
