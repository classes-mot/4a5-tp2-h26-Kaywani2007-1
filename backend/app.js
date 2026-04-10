import express from 'express'; 
import { connectDB } from './util/bs.js';
import checkAuth from './middleware/check-auth.js';
import routeJeux from './routes/jeux-route.js';
import routeUser from './routes/users-route.js';
const app = express();

app.use(express.json());

app.use('/api/users', routeUser);

app.use('/api/jeux', routeJeux);

await connectDB();
const port = 5000;
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
})