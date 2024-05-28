const config = require("../../config/index");

const PORT = +config.port;

const runner = (app) => {
    app.listen(PORT, () => {
        console.log(PORT);
    })
}

module.exports = runner;