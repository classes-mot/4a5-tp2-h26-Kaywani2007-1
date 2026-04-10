import jwt from 'jsonwebtoken';
import { User } from "../models/users.js";

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

export { addUser, loginUser };