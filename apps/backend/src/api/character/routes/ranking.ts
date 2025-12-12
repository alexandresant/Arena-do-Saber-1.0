export default {
  routes: [
    {
      method: 'GET',
      path: '/characters/ranking',
      handler: 'character.ranking',
      config: {
        auth: false
      }
    }
  ]
};
