const express = require("express");
const authCtrl = require("../controllers/auth.controller");
const middleware = require("../middleware/api-middleware");
const router = express.Router(); 

router.route("/login").post( middleware.isAuthorized,authCtrl.login);
router.route("/registerMember").post( middleware.isAuthorized,authCtrl.registerMember);
router.route("/memberAcceptance").get(authCtrl.memberAcceptance);
router.route("/getAllInvites").post( middleware.isAuthorized,authCtrl.getAllInvites);


module.exports = router;
