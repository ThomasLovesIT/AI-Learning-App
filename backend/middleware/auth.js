import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const protect = async (req, res, next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1]

            const decoded = jwt.verify(token, process.env.JWT_SECRET)
          req.user = await User.findById(decoded.id).select('-password')
            if(!req.user){
                return res.status(401).json({
                    success: false,
                    error: 'User not found',
                    statusCide: 401
                })
            }
              next()
        }catch(err){
            console.log('Auth middleware error', err.message)

            if(err.message === 'TokenExpiredError'){
                return res.status(401).json({
                 success: false,
                 error: 'Token expired',
                 statusCode: 401
                })            
            };
              return res.status(401).json({
                    success: false,
                    error: 'Not authorized',
                    statusCode: 401
                });
        }
    }

    if(!token){
        return res.status(401).json({
                    success: false,
                    error: 'No Token',
                    statusCide: 401
                });
    }
}
export default protect