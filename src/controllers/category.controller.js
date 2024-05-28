const path = require("path")

const {v4:uuid } = require("uuid")

const Io = require("../helpers/io")
const Category = require("../models/category.model")

const categoryDB = new Io(`${process.cwd()}/database/category.json`);
const historyDB = new Io(`${process.cwd()}/database/history.json`);
const usersDB = new Io(`${process.cwd()}/database/users.json`)

const readCategory = async (req, res) => {
    try {
        const category = await categoryDB.read();
        const {id} = req.user;
        const filtered = category.filter((note) => note.userId === id);

        res.status(201).json({message: "Success!!", data: filtered})
    } catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
} 

const createCategory = async (req, res) => {
    try {
        const user = await categoryDB.read();
        const { name, type} = req.body;
        const { photo } = req.files;
        const{ id } = req.user
        const findCategory = user.find((el) => el.name === name);
        if (findCategory) 
            return res.status(401).json({ massage: "This name already exist" });

        const photoName = `${uuid()}${path.extname(photo.name)}`;
        photo.mv(`${process.cwd()}/uploads/${photoName}`);
        const newCategory = new Category( name, photoName, type, id )
        user.push(newCategory);

        await categoryDB.write(user);
        res.json({ massage: "Success", data: newCategory });
    } catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
} 

const updateCategory = async (req, res) => {
    try {
        const {id} = req.params;

        const category = await categoryDB.read();
        const history = await historyDB.read();
        const users = await usersDB.read();

        const oldFindhistory = history.find((el) => el.categoryId === id);

        const findUser = users.find((el) => el.id === oldFindhistory.userId)

        const oldSum = +(oldFindhistory.sum)

        const {name, type} = req.body;
        const {photo} = req.files;

        const findId = category.find((category) => category.id === id);

        if(!findId)
            return res.status(403).json({message: "This id not found!!!"})
        
        const photoName = `${uuid()}${path.extname(photo.name)}`

        photo.mv(`${process.cwd()}/uploads/${photoName}`);

        findId.name = name;
        findId.type = type;
        findId.photoName = photoName;

        await categoryDB.write(category)

        const nowFindhistory = history.find((el) => el.categoryId === id);

        const nowSum = +(nowFindhistory.sum)

        findUser.balance = (+findUser.balance) + (nowSum - oldSum)

        await usersDB.write(users)
        res.status(201).json({message: "Success!!!", data: findId})
    } catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
} 

const deleteCategory = async (req, res) => {
    try {
        const category = await categoryDB.read();
        const history = await historyDB.read();
        const users = await usersDB.read();

        const { id } = req.params;

        const findCategory = user.find((el) => el.id === id);

        if (!findCategory)
            return res.status(401).json({ massage: "This id not found!!!" });

        if (req.user.id !== findCategory.userId) 
            return res.status(401).json({ massage: "You don't delete!!!" });

        const findhistory = history.find((el) => el.categoryId === id);

        const findUser = users.find((el) => el.id === findhistory.userId)

        findUser.balance = (+findUser.balance) - (+findhistory.sum)

        await usersDB.write(users)

        const deleteCateg = category.filter((el) => el.id != id);

        await categoryDB.write(deleteCateg);
        res.json({ massage: "Success!!!", data: category });
    } catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
} 

module.exports = {
    readCategory,
    createCategory,
    updateCategory,
    deleteCategory
}