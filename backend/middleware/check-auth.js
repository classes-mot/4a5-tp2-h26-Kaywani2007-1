import jwt from 'jsonwebtoken';

const checkAuth = (requete, reponse, next) => {
    try{
        const token = requete.headers.authorization.split(' ')[1];
        if(!token){
            throw new Error('Authentification failed');
        }
        const decodedToken = jwt.verify(token, 'cleSecrete');
        requete.userData = { userId: decodedToken.userId };
        next();
    }catch (err) {
        reponse.status(401).json({ message: 'Authentification failed'});
    }

};
export default checkAuth;