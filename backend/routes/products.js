const express = require('express');
const productController = require('../controllers/productController');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', productController.getAllProducts.bind(productController));
router.get('/:id', productController.getProduct.bind(productController));

router.post('/',  
  upload.array('images', 10),
  productController.createProduct.bind(productController)
);

router.put('/:id', 
  upload.array('images', 10),
  productController.updateProduct.bind(productController)
);

router.delete('/:id',  
  productController.deleteProduct.bind(productController)
);

module.exports = router;
