const Io = require("../helpers/io");
const Balance = require("../models/balance.model");

const usersDb = new Io(`${process.cwd()}/database/users.json`);
const historyDB = new Io(`${process.cwd()}/database/history.json`);
const categoryDb = new Io(`${process.cwd()}/database/category.json`);

const updateBalance = async (req, res) => {
  try {
    const history = await historyDB.read();
    const category = await categoryDb.read();
    const users = await usersDb.read();

    const { categoryId, sum } = req.body;
    const { id } = req.user;

    const findCategory = category.find((el) => el.id === categoryId);

    if(!findCategory)
      return res.status(401).json({ massage: "This category not found!!!" });

    const findUser = users.find((el) => el.id == id);

    if(!findUser)
      return res.status(401).json({ massage: "This user not fount!!!" });

    if(findCategory.type === "true") {
       findUser.balance = (+findUser.balance) + (+sum);

       const newBalance = new Balance(categoryId, sum, id, "+");

       history.push(newBalance);
       await historyDB.write(history);
    } else if (findCategory.type === "false") {
      findUser.balance = (+findUser.balance) - (+sum);

      const newBalance = new Balance(categoryId, sum, id, "-");

      history.push(newBalance);
      await transactionDb.write(history);
    }

    await usersDb.write(users);
    res.json({ massage: "Success", data: users });
  } catch (error) {
    res.status(500).json({message: "Internal Server Error!!!"})
 }
};

const getHistory = async (req, res) => {
    try {
        const history = await historyDB.read();
        const { id } = req.user;
        const filtered = history.filter((el) => el.userId === id);

        res.status(201).json({message: "Success!!", data: filtered})
    } catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}

module.exports = {
     updateBalance,
     getHistory
 };