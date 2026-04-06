import mongoose from "mongoose";

const jeuSchema = new mongoose.Schema({
    title: { type: String, required: true},
    description: { type: String},
    categorie: { type: String },
    nbJoueurs: { type: Number},
    duree: { type: Number},
    user: { type: mongoose.Types.ObjectId, required: true, ref: 'User'}
})

export const Jeu = mongoose.model('Jeu', jeuSchema);