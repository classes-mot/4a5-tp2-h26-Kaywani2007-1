import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { Jeu } from "./models/jeux.js";
import { User } from "./models/users.js";
import { response } from "express";

const uri = 'mongodb://localhost:27017/tp2-webEtBase';

mongoose.connect
(uri).then(() => {
    console.log('connexion BD réussie!');
})
.catch(() => {
    console.log('connexion BD échouée...');
});

const addJeu = async (requete, reponse, next) => {
    console.log(requete.userData);
    const userId = requete.userData.userId;
    const createdJeu= new Jeu({
        title: requete.body.title,
        description: requete.body.description,
        categorie: requete.body.categorie,
        nbJoueurs: requete.body.nbJoueurs,
        duree: requete.body.duree,
        user: userId
    });
    let user;
    try{
        user = await User.findById(userId);
    }catch (err){
        console.log(err);
        return reponse.status(500).json({message: "Une erreur BD est survenue"})
    }
    if(!user){
        return reponse.status(404).json({message: "utilisateur introuvable"});
    }
    const result = await createdJeu.save();
    user.jeux.push(createdJeu);
    await user.save();

    reponse.status(201).json(result);
};

const getJeux = async (requete,reponse, next) => {
    const jeux = await Jeu.find().exec();
    reponse.json(jeux);
};

const deleteJeu = async (requete,reponse, next) => {
    const jeuId = requete.params.id;

    try{
        const jeu = await Jeu.findById(jeuId).populate('user');
        if(!jeu){
            return reponse.status(404).json({message: "Jeu introuvable"});
        }
        await jeu.deleteOne();

        jeu.user.jeux.pull(jeu._id);
        await jeu.user.save();

        reponse.status(200).json({message: "Jeu supprimé"});
    }catch (err){
        console.log(err);
        return reponse.status(500).json({message: "Erreur lors de la suprresion du jeu"});
    }
}

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

const loginUser = async (requete, reponse, next) => {
    const{ email, password } = requete.body;
    let existingUser;
    try{
        existingUser = await User.findOne({ email });
    }catch (err){
        console.error(err);
        return reponse.status(500).json({message: "Échec de conexion" });
    }
    if(!existingUser || existingUser.password !== password){
        return reponse.status(401).json({message: "Identifiants invalides"});
    }
    let token;
    try{
        token = jwt.sign({userId: existingUser.id, email: existingUser.email},
        'cleSecrete',
        { expiresIn: '1h'}
        );
    }catch (err){
        return reponse.status(500).json({message: "Erreur lors de la génération du jeton"});
    }
    reponse.status(200).json({
        userId: existingUser.id,
        email: existingUser.email,
        token: token,
    });
};

export {addJeu, getJeux,deleteJeu, addUser, loginUser };