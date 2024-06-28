import React, { useState } from "react";
import "./Add.css";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

function Add() {
  const url = "http://localhost:5000";
  const [image, setImage] = useState(false);

  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("image", image);

    try {
      const response = await axios.post(
        `${url}/api/v1/users/addFood`,
        formData
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setData({ name: "", description: "", price: "", category: "" });
        setImage(false);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <div className="add">
        <form
          className="flex-col"
          autoComplete="off"
          onSubmit={onSubmitHandler}
        >
          <div className="add-image-upload flex-col">
            <p>Upload Image</p>
            <label htmlFor="image">
              <img
                src={image ? URL.createObjectURL(image) : assets.upload_area}
                alt=""
              />
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={(e) => {
                setImage(e.target?.files[0]);
              }}
              hidden
              required
            />
          </div>
          <div className="add-product-name flex-col">
            <p>Product Name</p>
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={onChangeHandler}
              placeholder="Food Name type here..."
              required
            />
          </div>
          <div className="add-product-description flex-col">
            <p>Product Description</p>
            <textarea
              type="text"
              name="description"
              value={data.description}
              onChange={onChangeHandler}
              placeholder="Write Food description"
              rows={6}
              required
            ></textarea>
          </div>
          <div className="add-category-price">
            <div className="add-category flex-col">
              <p>Product Category</p>
              <select
                name="category"
                value={data.category}
                onChange={onChangeHandler}
                required
              >
                <option value="" hidden>
                  --select category--
                </option>
                <option value="Salad">Salad</option>
                <option value="Rolls">Rolls</option>
                <option value="Deserts">Deserts</option>
                <option value="Cake">Cake</option>
                <option value="Pure Veg">Pure Veg</option>
                <option value="Pasta">Pasta</option>
                <option value="Noodles">Noodles</option>
              </select>
            </div>
            <div className="add-price flex-col">
              <p>Product Price</p>
              <input
                type="number"
                name="price"
                value={data.price}
                onChange={onChangeHandler}
                placeholder="$20"
                required
              />
            </div>
          </div>
          <button className="add-btn">ADD</button>
        </form>
      </div>
    </>
  );
}

export default Add;
