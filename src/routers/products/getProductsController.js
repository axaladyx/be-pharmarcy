const router = require("express").Router();
const pool = require("../../config/database");

//Get Categories
const getCategoriesRouter = router.get(
  "/categories",
  async (req, res, next) => {
    try {
      const connection = await pool.promise().getConnection();

      const sqlGetCategories = "SELECT name, id FROM categories";
      const result = await connection.query(sqlGetCategories);
      connection.release();

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
);
//Get All Products
const getAllProductRouter = router.get("/", async (req, res, next) => {
  try {
    const connection = await pool.promise().getConnection();
    const sqlGetProducts = "SELECT * FROM products;";
    const result = await connection.query(sqlGetProducts);

    connection.release();

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
});

//Get Products By Category
const getProductsByCategoryRouter = router.get(
  "/category/:category",
  async (req, res, next) => {
    try {
      const connection = await pool.promise().getConnection();

      const sqlGetProductsByCategory = `SELECT products.id, products.name, categories.name AS category, products.price, products.productPhoto, products.dose
    FROM ((products_categories
    INNER JOIN products ON products_categories.product_id = products.id)
    INNER JOIN categories ON products_categories.category_id  = categories.id)
    WHERE categories.name = ?;`;

      const dataCategory = req.params.category;

      const result = await connection.query(
        sqlGetProductsByCategory,
        dataCategory
      );
      connection.release();

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
);

//Get Products by Name
const getProductsByNameRouter = router.get(
  "/search",
  async (req, res, next) => {
    try {
      const connection = await pool.promise().getConnection();
      const data = req.query.search;
      const sqlGetProducts = `SELECT * FROM products WHERE name LIKE ?;`;
      const sqlGetProductsByName = "%" + data + "%";
      const result = await connection.query(
        sqlGetProducts,
        sqlGetProductsByName
      );
      connection.release();
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = {
  getAllProductRouter,
  getProductsByCategoryRouter,
  getProductsByNameRouter,
  getCategoriesRouter,
};
