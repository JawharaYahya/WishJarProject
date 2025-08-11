const express= require('express');
const router= express.Router();

const pg = require('pg');
const routeGuard = require('../../middleware/verifyToken');
const pool = new pg.Pool({connectionString: process.env.DATABASE_URL});

//createWish
router.post('/createWish',routeGuard, async (req,res)=>{
const {title, description , is_private = false}=req.body;
const finalDescription = description ?? "No description yet";
const userId= req.user.id;
if(!title) return res.status(400).json({message:'title is required'});


try {
    const result = await pool.query(
     `INSERT INTO wishes (title, description, user_id, is_private)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
    [title, finalDescription, userId, is_private]
    );
     res.status(201).json(result.rows[0]);
     } catch (err) {
    res.status(500).json({ message: 'Error creating wish', error: err.message });
  }
});
module.exports=router;