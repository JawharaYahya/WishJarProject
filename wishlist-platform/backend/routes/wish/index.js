const express= require('express');
const router= express.Router();

router.post('/createWish',require('./create'));
router.get('/myWishes',require('./getMyWishes'));
router.get("/public/:publicLink",require('./getPublicWishes'));
router.put('/update/:id',require('./update'));
router.delete('/delete/:id',require('./delete'));

module.exports=router;