const express= require('express');
const router= express.Router();

const pg = require('pg');
const pool = new pg.Pool({connectionString: process.env.DATABASE_URL});


//show specific user wishes for shareable Link
router.get("/public/:publicLink", async (req, res) => {
  const { publicLink } = req.params;
  console.log("generate public Link");
  
  try{
   const result = await pool.query(
      `SELECT * FROM wishes WHERE user_id = (
         SELECT id FROM users WHERE public_link = $1
       ) AND is_private = false`,
      [publicLink]
    );
    res.json(result.rows);
  } catch (error) {
    console.log("error fetching public wishes by username: ", error);
    res.status(500).send("Error fetching");
  }
});

module.exports=router;