const { getRoutes } = require('expo-router/build/routes');

const routes = getRoutes('app');
console.log(JSON.stringify(routes, null, 2));
