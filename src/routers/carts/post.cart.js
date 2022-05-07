const pool = require("../../config/database");
const router = require("express").Router();

const postCartRouter = async (req, res, next) => {
  const { user_id, product_id, qty } = req.body;
  try {
    const connection = await pool.promise().getConnection();

    const sqlCheckCart = `select * from carts where user_id = ? and product_id = ? and status = "cart" and variant = ?;`;
    const dataCheck = [req.body.user_id, req.body.product_id, req.body.variant];

    try {
      const [resultCheck] = await connection.query(sqlCheckCart, dataCheck);

      if (resultCheck[0]) {
        const sqlUpdateCart = `update carts set qty = ? where user_id = ? and product_id = ? and status = "cart" and variant = ? ;`;
        const dataUpdate = [
          resultCheck[0].qty + qty,
          user_id,
          product_id,
          req.body.variant,
        ];

        await connection.query(sqlUpdateCart, dataUpdate);
        connection.release();
        res.status(200).send("ada data gan");
      } else {
        const sqlPostProduct = `INSERT INTO carts SET ?;`;
        const data = req.body;
        const result = await connection.query(sqlPostProduct, data);

        connection.release();

        res.status(200).send("masuk gan");
      }
    } catch (error) {
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

const postCheckoutRouter = async (req, res, next) => {
  // const { invoice, user_id, status, amount } = req.body;
  const data = req.body.carts[0];
  try {
    // console.log("checkout");
    const connection = await pool.promise().getConnection();
    await connection.beginTransaction();

    try {
      const sqlCheckout = `insert into transactions set ?;`;
      const sqlCheckoutData = {
        invoice: req.body.invoice,
        user_id: req.body.user_id,
        // status: req.body.status,
        amount: req.body.amount,
      };
      // const sqlCheckoutData = req.body;

      const [result] = await connection.query(sqlCheckout, sqlCheckoutData);

      const sqlInputDetails = `insert into detailTransaction (transaction_id, product_id, productName, productPrice, productPhoto, qty, variant) values ?;`;
      const sqlData = req.body.carts.map((product) => {
        return [
          result.insertId,
          product.product_id,
          product.productName,
          product.priceStrip,
          product.productPhoto,
          product.qty,
          product.variant,
        ];
      });
      // console.log(sqlData);
      // transaction_id: result.insertId,
      // product_id: req.body.product_id,
      // prescriptionPhoto: req.body.prescriptionPhoto,
      // productName: req.body.productName,
      // productPrice: req.body.productPrice,
      // productPhoto: req.body.productPhoto,
      // qty: req.body.qty,
      // variant: req.body.variant,

      const [resultt] = await connection.query(sqlInputDetails, [sqlData]);
      console.log(resultt);
      connection.commit();
      res.status(200).send("Checkout success, new transaction created");
    } catch (error) {
      connection.rollback();
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

const postDetailsRouter = async (req, res, next) => {
  try {
    const connection = await pool.promise().getConnection();

    const sqlDetails = `insert into detailtransaction set ?;`;
    const sqlDetailsData = req.body;

    const result = await connection.query(sqlDetails, sqlDetailsData);
    connection.release();
    res.status(200).send([result]);
  } catch (error) {
    next(error);
  }
};

router.post("/", postCartRouter);
router.post("/checkout", postCheckoutRouter);
router.post("/details", postDetailsRouter);

module.exports = router;
