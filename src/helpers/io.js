const fs = require("fs/promises")
class Io{
    #dir;
    constructor(dir) {
        this.#dir = dir;
    }

    async write(data){
        await fs.writeFile(this.#dir, JSON.stringify(data, null, 2), "utf8")
    }

    async read(){
        let data = await fs.readFile(this.#dir, "utf8");

        let result = data ? JSON.parse(data) : [];
        
        return result;
    }
}

module.exports = Io;