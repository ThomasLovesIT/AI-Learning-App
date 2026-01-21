
const errorHandler = (err, req,res,next) => {
    let statusCode = err.statusCode || 500
    let message = err.message || 'Server Error'

    if(err.name === 'CastError'){
        message = 'Resource Not Found'.
        statusCode = 404
    }


    //if already exist
    if(err.name === '11000'){
        const field = Object.keys(err.keyValue)[0]
        message = `${field} already exists`
        statusCode = 400
    }

    if(err.name === 'ValidationError'){
        message = Object.values(err.errors).map(val => val.message).join(', ');
        statusCode = 400
    }

    if(err.name === 'LIMIT_FILE_SIZE'){
        message = 'File size exceeds the limits of 10MB'
        statusCode = 400
    }
    if(err.name === 'JsonWebTokenError'){
        message = 'invalid token'
        statusCode = 401
    }


}

export default errorHandler;