require("dotenv/config");

const fileUpload = require("express-fileupload");
const cors = require("cors")
const cookie = require("cookie-parser")

const authRoute = require("../routes/auth.route");
const categoryRoute = require("../routes/category.route")
const adminRoute = require("../routes/admin.route")
const balanceRoute = require("../routes/balance.route")
const isAuth = require("../middlewares/is-auth-middlewares");

const modules = async (app, express) => {
    app.use(express.json())
    app.use(fileUpload())
    app.use(cookie())
    app.use(cors({
        origin: "*",
    }))

    app.use("/api/auth", authRoute);
    app.use("/api/category", isAuth, categoryRoute);
    app.use("/api/admin", adminRoute);
    app.use("/api/balance", balanceRoute);
}

module.exports = modules;