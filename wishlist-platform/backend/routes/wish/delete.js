const express=require('express');
const router= express.Router();
const pg = require('pg');
const routeGuard =require('../../middleware/verifyToken');
const pool = new pg.Pool({connectionString: process.env.DATABASE_URL});

//DeleteWish 
router.delete("/delete/:id",routeGuard,async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;  

  try {
    const result = await pool.query(
      "DELETE FROM wishes WHERE id = $1 AND user_id=$2 RETURNING *",
      [id,userId]
    );
    if(result.rowCount === 0){
      return res.status(404).json({message: "Wish Not Found"});
    }
    res.json({messeage:"Wish deleted successfully", deleted: result.rows[0]});
  } catch (error) {
    console.log("error Deleting wish",error);
    
    res.status(500).send("Error");
  }
});
module.exports=router;