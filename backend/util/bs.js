import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
    if(isConnected) return;
    const uri = 'mongodb://localhost:27017/tp2-webEtBase';

    try {
        await mongoose.connect(uri);
        isConnected = true;
        console.log('connexion BD réussie!');
    }catch (err) {
       console.log('connexion BD échouée...', err); 
       process.exit(1);
    }
}

