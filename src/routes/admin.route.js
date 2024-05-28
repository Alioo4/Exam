const { Router } = require("express");
const {createAdmin, getUsers ,changeUsers} = require("../controllers/admin.controller");
const isAdmin = require("../middlewares/is-admin-middleware")
const router = Router();

router.post("/", createAdmin);
router.get("/", isAdmin, getUsers);
router.put("/:id", isAdmin, changeUsers);

module.exports = router;