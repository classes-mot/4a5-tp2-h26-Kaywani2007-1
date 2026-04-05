import express from 'express';
import {addJeu, getJeux, addUser } from './mongoose.js'
// getUsers, 
const app = express();

app.use(express.json());

app.post(`/addJeux`, addJeu);
app.get(`/readJeux`, getJeux);
// app.patch(`/modifierJeu`, modifierJeu);
// app.delete(`/deleteJeu`, deleteJeu);

app.post(`/addUser`, addUser);
// app.get(`/readUsers`, getUsers);

const port = 5000;
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
})