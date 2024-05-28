const { v4:uuid } = require("uuid")

class User{
    constructor(fullname, phone, password, balance, photo){
        this.id = uuid(),
        this.fullname = fullname,
        this.phone = phone,
        this.password = password,
        this.balance = balance,
        this.photo = photo
    }
}

module.exports = User;