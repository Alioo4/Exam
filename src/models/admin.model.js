const { v4: uuid } = require("uuid");
class Admin {
    constructor(username, token) {
        this.id = uuid();
        this.username = username;
        this.token = token;     
 }
}

module.exports = Admin;