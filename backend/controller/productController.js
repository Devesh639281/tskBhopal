const productModel = require("../model/productModel");

exports.createProductController = async (req, res) => {
  try {
    const { name, price } = req.body;
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });

      case !price:
        return res.status(500).send({ error: "Price is Required" });
    }
    const product = await productModel.findOne({ name });
    if (product) {
      return res.status(200).send({
        success: false,
        message: "Product already Avaliable",
      });
    }
    const products = new productModel({ ...req.body });
    console.log(products);

    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Some Error arrives in creating Product",
      error,
    });
  }
};

//getProductController
exports.getProductController = async (req, res) => {
  try {
    const product = await productModel
      .find({})

      .sort({ createdAt: -1 });
    console.log(product);
    res.status(200).send({
      success: true,
      countTotal: product.length,
      message: "All Product List",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Some Error arrived when getting all product detail",
      error,
    });
  }
};

exports.getsingleProductController = async (req, res) => {
  try {
    const product = await productModel.findOne({ _id: req.params._id });
    res.status(200).send({
      success: true,
      message: "Single Product List",
      product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Some Error come when getting single product detail",
      error,
    });
  }
};

exports.updateProductController = async (req, res) => {
  try {
    const { name, price } = req.body;

    switch (true) {
      case !name:
        return res.status(500).send({ message: "Name is Required" });

      case !price:
        return res.status(500).send({ message: "Price is Required" });
    }
    const products = await productModel.findByIdAndUpdate(
      req.params._id,
      { ...req.body },
      { new: true }
    );
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Updated successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Some Error arrives in updating Product",
      error,
    });
  }
};

exports.deleteProductController = async (req, res) => {
  try {
    const product = await productModel.findByIdAndDelete(req.params._id);
    console.log(product);
    res.status(200).send({
      success: true,
      message: "Product Deleted Successfully",
      product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Some Error came when deleting Products",
      error,
    });
  }
};

exports.searchProductController = async (req, res) => {
  try {
    const { name, price } = req.query;
    let query = {};

    if (name) {
      query.name = { $regex: name, $options: "i" };
    }
    if (price) {
      query.price = {};
      if (price) {
        query.price = parseFloat(price);
      }
    }
    const results = await productModel.find(query);
    res.send(results);
  } catch (error) {
    console.error(error);
    res.status(400).send({
      success: false,
      message: "Error in Search Product API",
      error: error.message,
    });
  }
};
