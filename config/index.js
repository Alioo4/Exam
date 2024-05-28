const config = {
    port: process.env.PORT || 4000,
    jwtSecretKey: process.env.JWT_SECRET_KEY,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN,
    jwtSecretKeyAdmin: process.env.JWT_SECRET_KEY_ADMIN
}

module.exports = config;