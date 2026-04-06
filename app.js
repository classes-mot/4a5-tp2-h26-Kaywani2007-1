import express from 'express';
import {addJeu, getJeux, addUser, loginUser } from './mongoose.js'
// getUsers, 
import checkAuth from './middleware/check-auth.js';
const app = express();

app.use(express.json());

app.post(`/addUser`, addUser);
app.post(`/login`, loginUser);

app.get(`/readJeux`, getJeux);
// app.get('/readUnJeu, getUnJeu);

app.use(checkAuth);

app.post(`/addJeux`, addJeu);
// app.patch(`/modifierJeu`, modifierJeu);
// app.delete(`/deleteJeu`, deleteJeu);

const port = 5000;
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
})