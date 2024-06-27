const {register,login, setAvatar,allUsers} =require("../controllers/userController");

const express=require('express');

const router=express.Router();

router.post("/register",register);
router.post("/login",login);
router.post("/setAvatar/:id",setAvatar);
router.get("/allUsers/:id",allUsers);

module.exports=router;