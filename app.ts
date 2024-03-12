import Application from './src/server/Application';
const app = new Application();
app.runServer();
app.runSocket();
app.connectMongoDB();
export default app;
