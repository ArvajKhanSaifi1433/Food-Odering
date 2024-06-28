import React, { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";

function List() {
  const url = "https://arvaj-tmato.onrender.com";

  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const { data } = await axios.get(`${url}/api/v1/users/getFoodList`);
      setList(data.data);
    } catch (error) {
      
      toast.error("Error");
    }
  };

  const deleteListItem = async (id) => {
    try {
      const { data } = await axios.delete(
        `${url}/api/v1/users/removeFood/${id}`
      );
      toast.success(data.message);
      await fetchList();
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <div className="list add flex-col">
        <p>All Food List</p>
        <div className="list-table">
          <div className="list-table-format title">
            <b>Image</b>
            <b>Name</b>
            <b>Category</b>
            <b>Price</b>
            <b>Action</b>
          </div>
          {list.map((item) => {
            return (
              <div key={crypto.randomUUID()} className="list-table-format">
                <img src={item.image} alt="" />
                <p>{item.name}</p>
                <p>{item.category}</p>
                <p>&#8377;{item.price * 22}</p>
                <p
                  className="cursor"
                  onClick={() => {
                    deleteListItem(item._id);
                  }}
                >
                  X
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default List;
