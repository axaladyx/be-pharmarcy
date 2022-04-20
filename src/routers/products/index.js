const router = require("express").Router();

const {
  getAllProductRouter,
  getProductsByCategoryRouter,
  getProductsByNameRouter,
  getProductsByIdRouter,
} = require("./getProductsController");

const {
  postUploadproductPhotoRouter,
  // postInputProductsRouter,
} = require("./postProductsController");

const { putProductsRouter } = require("./putProductsController");

router.use(getAllProductRouter);
router.use(getProductsByNameRouter);
router.use(getProductsByCategoryRouter);
router.use(getProductsByIdRouter);

router.use(postUploadproductPhotoRouter);

router.use(putProductsRouter);

module.exports = router;
