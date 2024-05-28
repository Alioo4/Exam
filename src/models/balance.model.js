const { v4: uuid } = require("uuid");
class Balance{
    constructor(categoryId, sum, userId, type) {
        this.id = uuid();
        this.categoryId = categoryId;
        this.sum= sum;
        this.userId = userId;
        this.type = type;
 }
}
module.exports = Balance;