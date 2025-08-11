const express = require('express');
const router = express.Router();

const pg = require('pg');
const routeGuard =require('../../middleware/verifyToken');
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

router.put('/update/:id', routeGuard, async (req, res) => {
  const { id } = req.params;
  const { title, description, is_private } = req.body;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `UPDATE wishes 
       SET title = $1, description = $2, is_private = $3 
       WHERE id = $4 AND user_id = $5 
       RETURNING *`,
      [title, description, is_private, id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Wish not found or you don't have permission to update it" });
    }

    res.json({ message: "Wish updated", updated: result.rows[0] });
  } catch (error) {
    console.log("Error updating wish:", error.message);
    res.status(500).send("Error updating wish");
  }
});

module.exports = router;