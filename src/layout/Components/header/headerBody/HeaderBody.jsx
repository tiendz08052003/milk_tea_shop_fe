import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBagShopping,
  faCartShopping,
  faHeart,
  faMagnifyingGlass,
  faRepeat,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import styles from "./HeaderBody.module.scss";
import classNames from "classnames/bind";
import ToastInformation from "~/Components/Notification";
import { IconLogo } from "~/Components/Icons";
import { regexSearchMapper } from "../../../../regex/search.regex";
import * as authService from "~/services/auth.service";
import * as cartService from "~/services/cart.service";
import LoadingComponent from "~/Components/Loading";
import * as invoiceService from "~/services/order.service";

const cx = classNames.bind(styles);

function HeaderBody({ setSearch }) {
  const [user] = useState(JSON.parse(localStorage.getItem("user") || null));
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [bool, setBool] = useState(false);
  const [qualityCart, setQualityCart] = useState(0);
  const [qualityOrder, setQualityOrder] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSearchRoom = (event) => {
    const name = event.target.value;
    const listElementName = name.split(" ");
    const filter = {
      $or: listElementName.map((elementName) => ({
        tenSanPham: {
          $regex: ".*" + regexSearchMapper(elementName) + ".*",
          $options: "i",
        },
      })),
    };

    setSearch(filter);
  };

  const handleOnClickLogout = async () => {
    setIsLoading(true);
    const response = await authService.logout();
    setBool(true);
    setContent(response.data.message);

    if (!response.data.success) {
      setTitle("Error");
      setIsLoading(false);
      return;
    }

    localStorage.removeItem("user");
    setTitle("Success");
    setTimeout(() => {
      setIsLoading(true);
      navigate("/");
      window.location.reload();
    }, 3000);
  };

  useEffect(() => {
    const fetchApi = async () => {
      if (user) {
        try {
          const response = await cartService.getCarts(user._id);
          if (response.data.success) {
            const cart = response.data.result.items;
            setQualityCart(cart.length);
          }
        } catch {
          setBool(true);
          setContent("Lỗi kết nối đến server");
          setTitle("Error");
        }
      }
    };

    fetchApi();
  }, [user]);

  useEffect(() => {
    const fetchApi = async () => {
      if (user) {
        try {
          const response = await invoiceService.getOrder();
          if (response.data.success) {
            const invoice = response.data.result;
            setQualityOrder(invoice.length);
          }
        } catch {
          setBool(true);
          setContent("Lỗi kết nối đến server");
          setTitle("Error");
        }
      }
    };

    fetchApi();
  }, [user]);

  return (
    <div className={cx("header__body")}>
      <div className={cx("wrapper")}>
        <div className={cx("header__body__child")}>
          <NavLink to="/">
            <div className={cx("header__body__child__logo")}>
              <IconLogo />
            </div>
          </NavLink>
          <div className={cx("header__body__child__search")}>
            <div
              className={cx("header__body__child__search__details")}
              tabIndex={100}
            >
              <input
                type="text"
                placeholder="Search for Products"
                className={cx("header__body__child__search__details__input")}
                onChange={handleSearchRoom}
              />
            </div>
            <div className={cx("header__body__child__search__btnSearch")}>
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className={cx(
                  "header__body__child__search__btnSearch--iconSearch"
                )}
              />
            </div>
          </div>
          <div className={cx("header__body__child__selection")}>
            <div className={cx("header__body__child__selection__compare")}>
              <FontAwesomeIcon
                icon={faRepeat}
                className={cx("header__body__child__selection__icon")}
              />
              <div
                className={cx("header__body__child__selection__compare__hover")}
              >
                So sánh
              </div>
            </div>
            <div className={cx("header__body__child__selection__heart")}>
              <FontAwesomeIcon
                icon={faHeart}
                className={cx("header__body__child__selection__icon")}
              />
              <div
                className={cx("header__body__child__selection__heart__hover")}
              >
                Yêu thích
              </div>
            </div>

            <NavLink to="/don_mua">
              <div className={cx("header__body__child__selection__cart")}>
                <div
                  className={cx("header__body__child__selection__cart__icon")}
                >
                  <FontAwesomeIcon
                    icon={faBagShopping}
                    className={cx("header__body__child__selection__icon")}
                  />
                  <div
                    className={cx(
                      "header__body__child__selection__cart__icon__quality"
                    )}
                  >
                    {qualityOrder}
                  </div>
                </div>
                <span
                  className={cx(
                    "header__body__child__selection__cart__content"
                  )}
                ></span>
                <div
                  className={cx("header__body__child__selection__cart__hover")}
                >
                  Đơn mua
                </div>
              </div>
            </NavLink>
            <div className={cx("header__body__child__selection__acc")}>
              <FontAwesomeIcon
                icon={faUser}
                className={cx("header__body__child__selection__icon")}
              />
              {user === null ? (
                <div
                  className={cx("header__body__child__selection__acc__hover")}
                >
                  <NavLink to="/dang_nhap">
                    <div
                      className={cx(
                        "header__body__child__selection__acc__hover__login"
                      )}
                    >
                      Đăng nhập
                    </div>
                  </NavLink>
                  <NavLink to="/dang_ki">
                    <div
                      className={cx(
                        "header__body__child__selection__acc__hover__register"
                      )}
                    >
                      Đăng ký
                    </div>
                  </NavLink>
                </div>
              ) : (
                <div
                  className={cx("header__body__child__selection__acc__hover")}
                >
                  <div
                    className={cx(
                      "header__body__child__selection__acc__hover__userName"
                    )}
                  >
                    {user.ten ? user.ten : user.sdt}
                  </div>
                  <div
                    className={cx(
                      "header__body__child__selection__acc__hover__info"
                    )}
                  >
                    <NavLink
                      to={"/tai_khoan"}
                      style={{ textDecoration: "none", color: "currentcolor" }}
                    >
                      Thông tin cá nhân
                    </NavLink>
                  </div>
                  <div
                    className={cx(
                      "header__body__child__selection__acc__hover__logout"
                    )}
                    onClick={handleOnClickLogout}
                  >
                    Đăng xuất
                  </div>
                </div>
              )}
            </div>
            <NavLink to="/gio_hang">
              <div className={cx("header__body__child__selection__cart")}>
                <div
                  className={cx("header__body__child__selection__cart__icon")}
                >
                  <FontAwesomeIcon
                    icon={faCartShopping}
                    className={cx("header__body__child__selection__icon")}
                  />
                  <div
                    className={cx(
                      "header__body__child__selection__cart__icon__quality"
                    )}
                  >
                    {qualityCart}
                  </div>
                </div>
                <span
                  className={cx(
                    "header__body__child__selection__cart__content"
                  )}
                ></span>
                <div
                  className={cx("header__body__child__selection__cart__hover")}
                >
                  Giỏ hàng
                </div>
              </div>
            </NavLink>
          </div>
          {bool && (
            <ToastInformation
              content={content}
              title={title}
              bool={bool}
              setBool={setBool}
              timeOut={3000}
            />
          )}

          {isLoading && <LoadingComponent />}
        </div>
      </div>
    </div>
  );
}

HeaderBody.propTypes = {
  setSearch: PropTypes.func,
};

export default HeaderBody;
