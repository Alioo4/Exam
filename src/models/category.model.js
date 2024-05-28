const { v4:uuid } = require("uuid")

class Category{
    constructor(name, photo, type, userId){
        this.id = uuid(),
        this.name = name,
        this.type = type,
        this.photo = photo,
        this.userId = userId
    }
}

module.exports = Category;