const router = require("express").Router();
const pool = require("../../config/database");

const getUserTransactionsRouter = router.get("/:id", async (req, res, next) => {
  console.log(req.query);
  try {
    const connection = await pool.promise().getConnection();

    const sqlUserTransactions = `select * from transactions where user_id = ? and status = ?;`;
    const sqlUser = [req.params.id, req.query.status];

    const result = await connection.query(sqlUserTransactions, sqlUser);
    connection.release();

    res.status(200).send({ result });
  } catch (error) {
    next(error);
  }
});

module.exports = { getUserTransactionsRouter };
