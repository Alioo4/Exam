const { Router } = require("express");
const { updateBalance, getHistory } = require("../controllers/balance.controller");
const isAuth = require("../middlewares/is-auth-middlewares")
const router = Router();

router.put("/", isAuth, updateBalance);
router.get("/", isAuth, getHistory);

module.exports = router;