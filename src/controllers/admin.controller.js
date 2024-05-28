const bcrypt = require("bcrypt");

const Io = require("../helpers/io")
const Admin = require("../models/admin.model");
const { createTokenAdmin } = require("../helpers/jwt")

const adminDb = new Io(`${process.cwd()}/database/admin.json`);
const usersDb = new Io(`${process.cwd()}/database/users.json`);

const getUsers = async (req, res) => {
    try {
        const users = await usersDb.read();

        res.json({ massage: "Success", data: users });
    } catch (error) {
        res.status(500).json({message: "Internal Server Error!!!"})
    }
};

const createAdmin = async (req, res) => {
  try {
    const { username } = req.body;

    const admin = await adminDb.read();

    const findAdmin = admin.find((admin) => admin.username === username);

    if (findAdmin)
      return res.status(403).json({ massage: "Admin already exists" });

    const token = createTokenAdmin({ id: username });

    const newAdmin = new Admin(username, token);

    admin.push(newAdmin);
    await adminDb.write(admin);
    res.status(201).json({ massage: "Success!!!", data: newAdmin });
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Internal Server Error!!!"})
  }
};

const changeUsers = async (req, res) => {
  try {
    const { fullname, phone, password } = req.body;

    const { id } = req.params;

    const user = await usersDb.read();

    const findUser =user.find( (user) => user.id == id);
   
    if (!findUser)
      return res.status(403).json({ massage: "Admin already registered" });

    const hashedPass = await bcrypt.hash(password, 12)

    findUser.password = hashedPass;
    findUser.fullname = fullname;
    findUser.phone = phone;

    await usersDb.write(user)
    res.json({massage:"Success",data: findUser})
  } catch (error) {
    res.status(500).json({message: "Internal Server Error!!!"})
  }
};

module.exports = { 
    createAdmin, 
    getUsers, 
    changeUsers 
};