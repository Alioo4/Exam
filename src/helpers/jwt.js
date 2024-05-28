const { sign, verify } = require("jsonwebtoken")

const config = require("../../config/index")

const createToken = (payload) => sign(payload, config.jwtSecretKey, {expiresIn: config.jwtExpiresIn} );

const createTokenAdmin = (payload) => sign(payload, config.jwtSecretKeyAdmin, {expiresIn: config.jwtExpiresIn})

const checkToken = ( token, callback ) => verify(token, config.jwtSecretKey, callback);

const checkTokenAdmin = ( token, callback ) => verify(token, config.jwtSecretKeyAdmin, callback);

module.exports = {
    createToken,
    checkToken,
    createTokenAdmin,
    checkTokenAdmin
}