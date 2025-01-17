import {
  faCaretDown,
  faCaretUp,
  faCartArrowDown,
  faMagnifyingGlassPlus,
} from "@fortawesome/free-solid-svg-icons";
import numeral from "numeral";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";

import classNames from "classnames/bind";
import style from "./ProductDetail.module.scss";
import ToastInformation from "~/Components/Notification";
import { useParams } from "react-router-dom";
import Image from "../../Components/Image/Image";
import * as productService from "~/services/product.service";
import * as cartService from "~/services/cart.service";
import ProductDetailCollection from "./productDetailCollection";
import LoadingComponent from "~/Components/Loading";

const cx = classNames.bind(style);
function ProductDetail({ idProduct, cartItem, idCart }) {
  const [user] = useState(JSON.parse(localStorage.getItem("user") || null));
  const [bool, setBool] = useState(false);
  const [product, setProduct] = useState({});
  const [size, setSize] = useState({});
  const [sweetness, setSweetness] = useState({});
  const [ice, setIce] = useState({});
  const [tea, setTea] = useState({});
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const idRef = useRef(id || idProduct);
  const [quantity, setQuantity] = useState(cartItem?.soLuong || 1);
  const [topping, setTopping] = useState(
    cartItem
      ? cartItem.thongTinTopping.map((topping) => ({
          topping: topping.topping._id,
          soLuong: topping.soLuong,
        }))
      : []
  );

  useEffect(() => {
    const id = idRef.current;
    const fetchData = async () => {
      const response = await productService.getProduct(id);
      if (response.data.success) {
        setProduct(response.data.result);
        setSize(
          cartItem
            ? response.data.result.thongTinKichThuoc.find(
                (size) =>
                  size.kichThuoc._id ===
                  cartItem.thongTinKichThuoc.kichThuoc._id
              )
            : response.data.result.thongTinKichThuoc[0]
        );
        setSweetness(
          cartItem
            ? response.data.result.ngot.find(
                (ngot) => ngot._id === cartItem.ngot._id
              )
            : response.data.result.ngot[1] || {}
        );
        setIce(
          cartItem
            ? response.data.result.da.find((da) => da._id === cartItem.da._id)
            : response.data.result.da[1] || {}
        );
        setTea(
          cartItem
            ? response.data.result.tra.find(
                (tra) => tra._id === cartItem.tra._id
              )
            : response.data.result.tra[1] || {}
        );
      }
    };
    fetchData();
  }, [id, idProduct]);

  const handleOperationCart = async () => {
    if (!user) {
      setBool(true);
      setContent("Vui lòng đăng nhập để thêm vào giỏ hàng");
      setTitle("Error");
      setTimeout(() => {
        setBool(false);
      }, 3000);
      return;
    }

    const bodyRequest = {
      sanPham: product?._id,
      soLuong: quantity,
      thongTinKichThuoc: {
        kichThuoc: size.kichThuoc._id,
        giaThem: size.giaThem || 0,
      },
      thongTinTopping: topping,
      ngot: sweetness?._id || null,
      da: ice?._id || null,
      tra: tea?._id || null,
    };
    setIsLoading(true);

    if (cartItem) {
      const response = await cartService.updateCart(idCart, {
        idItem: cartItem._id,
        ...bodyRequest,
      });
      setBool(true);
      setContent(response.data.message);
      if (!response.data.success) {
        setTitle("Error");
        setIsLoading(false);
        return;
      }
      setTitle("Success");
      setTimeout(() => {
        setBool(false);
        setIsLoading(false);
        window.location.reload();
      }, 3000);
      return;
    }

    const response = await cartService.addCart(bodyRequest);

    setBool(true);
    setContent(response.data.message);
    if (!response.data.success) {
      setTitle("Error");
      setIsLoading(false);
      return;
    }
    setTitle("Success");
    setTimeout(() => {
      setBool(false);
      setIsLoading(false);
      window.location.reload();
    }, 3000);
  };

  return (
    <div
      className={cx("productDetails", {
        grid__column__10: id,
        grid__column__12: !id,
      })}
    >
      <div className={cx("productDetails__child", "grid__row")}>
        <div
          className={cx("productDetails__child__left", "grid__column__10--4")}
        >
          <div className={cx("productDetails__child__left__img")}>
            {product.hinhAnh ? (
              <Image
                alt="ảnh chi tiết sản phẩm"
                src={product.hinhAnh}
                className={cx("productDetails__child__left__img__child")}
              />
            ) : (
              <p>Hình ảnh không khả dụng</p>
            )}
            <div className={cx("productDetails__child__left__img__icon")}>
              <FontAwesomeIcon
                icon={faMagnifyingGlassPlus}
                className={cx("productDetails__child__left__img__icon__child")}
              />
            </div>
          </div>
        </div>
        <div
          className={cx("productDetails__child__right", "grid__column__10--6")}
        >
          <div className={cx("productDetails__child__right__base")}>
            <div className={cx("productDetails__child__right__base__name")}>
              {product.tenSanPham || ""}
            </div>
            <div className={cx("productDetails__child__right__base__address")}>
              <p>
                <strong>Chi nhánh áp dụng:</strong>{" "}
                {product.chiNhanhApDung?.map(
                  (branch, index) =>
                    `${branch.tenChiNhanh}${
                      index < product.chiNhanhApDung.length - 1 ? ", " : "."
                    }`
                )}
              </p>
            </div>
          </div>
          <div className={cx("productDetails__child__right__advanced")}>
            <div
              className={cx("productDetails__child__right__advanced__price")}
            >
              <div
                className={cx(
                  "productDetails__child__right__advanced__price--default"
                )}
              >
                {product.gia && (
                  <span>{numeral(product.gia).format("0,0")} đ</span>
                )}
              </div>
            </div>
            <div
              className={cx(
                "productDetails__child__right__advanced__description"
              )}
            >
              {product.moTa || "Không có mô tả"}
            </div>
            {product.thongTinKichThuoc?.length > 0 && (
              <div
                className={cx(
                  "productDetails__child__right__advanced__options"
                )}
              >
                <h3>Chọn kích cỡ</h3>
                <div
                  className={cx(
                    "productDetails__child__right__advanced__options__selection"
                  )}
                >
                  {product.thongTinKichThuoc?.map((option, index) => (
                    <button
                      key={index}
                      className={cx(
                        "productDetails__child__right__advanced__options__size",
                        size.kichThuoc._id === option.kichThuoc._id
                          ? "productDetails__child__right__advanced__options__active"
                          : ""
                      )}
                      onClick={() => setSize(option)}
                    >
                      <label>{option.kichThuoc.tenKichThuoc}</label>
                      <label>
                        {option.giaThem ? `+${option.giaThem} đ` : "0 đ"}
                      </label>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {product.ngot?.length > 0 && (
              <div
                className={cx(
                  "productDetails__child__right__advanced__options"
                )}
              >
                <h3>Ngọt</h3>

                <div
                  className={cx(
                    "productDetails__child__right__advanced__options__selection"
                  )}
                >
                  {product.ngot?.map((option, index) => (
                    <button
                      key={index}
                      className={cx(
                        sweetness._id === option._id
                          ? "productDetails__child__right__advanced__options__active"
                          : ""
                      )}
                      onClick={() => setSweetness(option)}
                    >
                      {option.tenNgot}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {product.da?.length > 0 && (
              <div
                className={cx(
                  "productDetails__child__right__advanced__options"
                )}
              >
                <h3>Đá</h3>
                <div
                  className={cx(
                    "productDetails__child__right__advanced__options__selection"
                  )}
                >
                  {product.da?.map((option, index) => (
                    <button
                      key={index}
                      className={cx(
                        ice._id === option._id
                          ? "productDetails__child__right__advanced__options__active"
                          : ""
                      )}
                      onClick={() => setIce(option)}
                    >
                      {option.tenDa}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {product.tra?.length > 0 && (
              <div
                className={cx(
                  "productDetails__child__right__advanced__options"
                )}
              >
                <h3>Trà</h3>
                <div
                  className={cx(
                    "productDetails__child__right__advanced__options__selection"
                  )}
                >
                  {product.tra?.map((option, index) => (
                    <button
                      key={index}
                      className={cx(
                        tea._id === option._id
                          ? "productDetails__child__right__advanced__options__active"
                          : ""
                      )}
                      onClick={() => setTea(option)}
                    >
                      {option.tenTra}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {product.thongTinTopping?.length > 0 && (
              <div
                className={cx(
                  "productDetails__child__right__advanced__options"
                )}
              >
                <h3>Topping</h3>
                <div
                  className={cx(
                    "productDetails__child__right__advanced__options__collection"
                  )}
                >
                  {product.thongTinTopping?.map((option, index) => (
                    <ProductDetailCollection
                      key={index}
                      option={option}
                      setTopping={setTopping}
                      topping={topping}
                      cartItem={cartItem}
                    />
                  ))}
                </div>
              </div>
            )}
            <div
              className={cx("productDetails__child__right__advanced__quality")}
            >
              <input
                type="number"
                value={quantity}
                readOnly
                className={cx(
                  "productDetails__child__right__advanced__quality__input"
                )}
              />
              <div
                className={cx(
                  "productDetails__child__right__advanced__quality__upDown"
                )}
              >
                <FontAwesomeIcon
                  icon={faCaretUp}
                  onClick={() =>
                    setQuantity((prevQuantity) => prevQuantity + 1)
                  }
                  className={cx(
                    "productDetails__child__right__advanced__quality__upDown__iconUp"
                  )}
                />
                <FontAwesomeIcon
                  icon={faCaretDown}
                  onClick={() =>
                    setQuantity((prevQuantity) =>
                      prevQuantity > 1 ? prevQuantity - 1 : 1
                    )
                  }
                  className={cx(
                    "productDetails__child__right__advanced__quality__upDown__iconDown"
                  )}
                />
              </div>
            </div>

            <div
              className={cx("productDetails__child__right__advanced__cart")}
              onClick={handleOperationCart}
            >
              <FontAwesomeIcon
                icon={faCartArrowDown}
                className={cx(
                  "productDetails__child__right__advanced__cart--icon"
                )}
                style={{ color: "white" }}
              />
              <strong>
                {cartItem ? "Cập nhật giỏ hàng" : "Thêm vào giỏ hàng"}
              </strong>
            </div>
          </div>
        </div>
      </div>
      {bool && (
        <ToastInformation
          content={content}
          title={title}
          bool={bool}
          setBool={setBool}
        />
      )}
      {isLoading && <LoadingComponent />}
    </div>
  );
}
ProductDetail.propTypes = {
  idProduct: PropTypes.string,
  idCart: PropTypes.string,
  cartItem: PropTypes.object,
};

export default ProductDetail;
