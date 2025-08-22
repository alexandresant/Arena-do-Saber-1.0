// src/api/me-full/routes/me-full.ts

export default {
  routes: [
    {
      method: 'GET',
      path: '/me-full',
      handler: 'me-full.me',
      config: {
        auth: {
          strategy: 'jwt',
        },
      },
    },
  ],
};