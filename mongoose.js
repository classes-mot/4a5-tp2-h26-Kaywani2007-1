import mongoose from "mongoose";
import { Jeu } from "./models/jeux.js";
import { User } from "./models/users.js";

const uri = 'mongodb://localhost:27017/tp2-webEtBase';

mongoose.connect
(uri).then(() => {
    console.log('connexion BD réussie!');
})
.catch(() => {
    console.log('connexion BD échouée...');
});

const addJeu = async (requete, reponse, next) => {
    const createdJeu= new Jeu({
        title: requete.body.title,
        description: requete.body.description,
        categorie: requete.body.categorie,
        nbJoueurs: requete.body.nbJoueurs,
        duree: requete.body.duree,
    });
    const result = await createdJeu.save();

    reponse.status(201).json(result);
};

const getJeux = async (requete,reponse, next) => {
    const jeux = await Jeu.find().exec();
    reponse.json(jeux);
};

const addUser = async (requete, reponse, next) =>{
    const { name, email, password } = requete.body;
    let existingUser;
    try {
        existingUser = await User.findOne({email:email});
    }catch (err){
        console.log(err);
        return reponse.status(500).json({message: "Erreur"});
    }
    console.log('existingUser', existingUser);
    if(existingUser){
        return reponse.status(422).json({message: "Utilisateur existe déjà, essayez avec un autre email"});
    }
    const createdUser = new User({
        name,
        email,
        password
    });
    console.log('createdUser', createdUser);
    try{
        await createdUser.save();
    }catch (err){
        console.log(err);
        return reponse.status(500).json({message: "Erreur"});
    }
    reponse.status(201).json({user: createdUser.toObject({getters:true})});
}

export {addJeu, getJeux, addUser};