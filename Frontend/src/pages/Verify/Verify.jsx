import React, { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Verify.css";
import { StoreContext } from "../../Context/StoreContextProvider";
import axios from "axios";

function Verify() {
  const [searchParams, setSearchParams] = useSearchParams();
  let success = searchParams.get("success");
  let orderId = searchParams.get("orderId");
  const { url } = useContext(StoreContext);
  const navigator = useNavigate();

  const verifyPayment = async () => {
    try {
      const { data } = await axios.post(`${url}/api/v1/users/verifyOrder`, {
        success,
        orderId,
      });


      if (data.success === true) {
        navigator("/myOrder");
      } else {
        navigator("/");
      }
    } catch (error) {
      console.log(error.status);
    }
  };
  useEffect(() => {
    verifyPayment();
  }, []);
  return (
    <>
      <div className="verify">
        <div className="spinner"></div>
      </div>
    </>
  );
}

export default Verify;
