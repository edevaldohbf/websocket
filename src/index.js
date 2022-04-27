const app = require('./apps/app');
const appWs = require('./apps/app-ws');

const server = app.listen(process.env.PORT, () => {
    console.log(`App Express is running!`);
})

appWs(server);