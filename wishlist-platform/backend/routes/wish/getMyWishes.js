const express= require('express');
const router= express.Router();

const pg = require('pg');
const routeGuard =require('../../middleware/verifyToken');
const pool = new pg.Pool({connectionString: process.env.DATABASE_URL});


//show MyWishes inside user profile
router.get("/myWishes",routeGuard,async (req, res) => {
  const userId = req.user.id;
 console.log("myWishes");
 
  
  try {
    const result = await pool.query(
      "SELECT * FROM wishes WHERE user_id = $1",
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.log("error fetching your wishes ", error);

    res.status(500).send("Error fetching your wishes");
  }
});

module.exports=router;