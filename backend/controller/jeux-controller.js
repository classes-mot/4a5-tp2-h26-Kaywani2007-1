import { Jeu } from "../models/jeux.js";
import { User } from "../models/users.js";

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

const getUnJeu = async (requete, reponse, next) => {
    const jeuId = requete.params.id;
    let jeu;
    try{
        jeu = await Jeu.findById(jeuId);
    }catch (err){
        console.log(err);
        return reponse.status(500).json({message: "une erreur BD est survenue"});
    }
    if(!jeu){
        return reponse.status(404).json({message: "Jeu introuvable"});
    }
    reponse.json({jeu: jeu.toObject({getters:true})});
};

const modifierJeu = async (requete, reponse, next) => {
    const jeuId = requete.params.id;
    const jeuUpdates = requete.body;
    try{
        const updatedJeu = await Jeu.findByIdAndUpdate(jeuId, jeuUpdates,{new:true});
        if(!updatedJeu){
            return reponse.status(404).json({message: "Jeu introuvable"});
        }
        reponse.status(200).json({jeu: updatedJeu.toObject({getters:true})});
    }catch (err) {
        reponse.status(500).json({message: "Erreur lors de la mise à jour du jeu"});
    }
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

export { addJeu, getJeux, getUnJeu, modifierJeu, deleteJeu };