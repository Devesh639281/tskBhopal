import React, { useState, useEffect } from "react";
import Layout from "./Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";

const HomePage = () => {
  const [product, setProduct] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const [searchResult, setSearchResult] = useState([]);
  const getAllProduct = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/get-product");
      console.log(data);
      setProduct(data?.product);
      setSearchResult(data?.product);
    } catch (error) {
      console.log(error);
      toast.error("Somerthing Went Wrong");
    }
  };

  const deleteProduct = async (_id) => {
    try {
      const { data } = await axios.delete(
        `/api/v1/product/delete-product/${_id}`
      );
      if (data && data.success) {
        window.location.reload();
        alert("Product Item Deleted Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Somerthing Went Wrong");
    }
  };

  const handleSearch = async () => {
    try {
      const { data } = await axios.get(`/api/v1/product/search`, {
        params: { name, price },
      });
      setSearchResult(data?.product);
    } catch (error) {
      console.log(error);
      toast.error("Somerthing Went Wrong");
    }
  };
  useEffect(() => {
    getAllProduct();
  }, []);

  return (
    <Layout>
      <div className="container">
        <h1 className="text-center">Product List</h1>
        <div className="search-bar text-center">
          <input
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder="Enter Name Of Product"
            style={{ width: "20vw", marginRight: "10px" }}
          />
          <input
            type="number"
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            placeholder="Enter Price Of Product"
            style={{ width: "10vw", marginRight: "10px" }}
          />
          <button onClick={handleSearch} className="btn btn-primary">
            Search
          </button>
        </div>

        <table className="table" style={{ border: "1px solid #ccc" }}>
          <thead>
            <tr>
              <th scope="col">S.No.</th>
              <th scope="col">Product Name</th>
              <th scope="col">Product Price</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {product.length > 0 ? (
              product.map((item, index) => (
                <tr key={item._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{item.name}</td>
                  <td>{item.price}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => deleteProduct(item._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  <h2>Product Not Found</h2>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default HomePage;
