const path = require("path");

const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const {v4: uuid} = require("uuid");

const User = require("../models/user.model");
const config = require("../../config/index");
const Io = require("../helpers/io");
const { createToken } = require("../helpers/jwt");


const usersDB = new Io(`${process.cwd()}/database/users.json`);

const registerController = async (req, res) => {
    try {
        const { fullname, phone, password, balance} = req.body;

        const { photo } = req.files; 

        const check = Joi.object({
            fullname: Joi.string().min(6).required(),
            phone: Joi.string().required(),
            password: Joi.string().min(5).required(),
            balance: Joi.string().required(),
            photo: Joi.required()
        });

        const {error} = check.validate({fullname, phone, password, balance, photo});

        if(error)
            return res.status(400).json({message: error.message});

        const users = await usersDB.read()

        const findUser = users.find((user) => user.phone === phone)

        if(findUser)
            return res.status(403).json({message: "Username already exist!!!"})

        const hashedPass = await bcrypt.hash(password, 12);

        const photoName = `${uuid()}${path.extname(photo.name)}`

        photo.mv(`${process.cwd()}/uploads/${photoName}`);

        const newUser = new User(fullname, phone, hashedPass, balance, photoName)

        const token = createToken({id: newUser.id, isAdmin: true});

        users.push(newUser)
        await usersDB.write(users)
        res.status(201).json({message: "Success!!!", data: token});   
    } catch (error) {
        res.status(500).json({message: "Internal Server Error!!!"})
    }
} 

const loginController = async (req, res) => {
    try {
        const {phone, password} = req.body
        
        const users = await usersDB.read()

        const findUser = users.find((user) => user.phone === phone);

        if(!findUser)
            return res.status(403).json({message: "Incorrect username or password!!!"})

        const check = Joi.object({
            phone: Joi.string().required(),
            password: Joi.string().min(5).required(),
        })

        const {error} = check.validate({phone, password})

        if(error)
            return res.status(400).json({message: error.message});

        const verify = await bcrypt.compare(password, findUser.password)

        if(!verify)
            return res.status(403).json({message: "Incorrect username or password!!!"})

        const token = jwt.sign({id: findUser.id}, config.jwtSecretKey, {expiresIn: config.jwtExpiresIn});

        res.json({message: "Success!!!", data: token})
    } catch (error) {
        res.status(500).json({message: "Internal Server Error!!!"})
    }
} 

module.exports = {
    registerController,
    loginController
}