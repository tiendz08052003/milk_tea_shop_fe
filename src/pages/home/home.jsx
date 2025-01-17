import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faArrowLeft,
  faArrowRight,
  faBars,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";

import classNames from "classnames/bind";
import styles from "./Home.module.scss";
import HomeChild from "./homeChild/HomeChild";
import * as productService from "../../services/product.service";

const cx = classNames.bind(styles);

const sortOptions = [
  { value: "", name: "Default sorting" },
  { value: "date", name: "Sort by latest" },
  { value: "price", name: "Sort by price: low to high" },
  { value: "price-desc", name: "Sort by price: high to low" },
];

const showOptions = [
  { value: 12, name: "Show 12" },
  { value: 24, name: "Show 24" },
  { value: -1, name: "Show All" },
];

function Home({ search = {}, category = {} }) {
  const [listSanPham, setListSanPham] = useState([]);
  const [listSanPhamRecommend, setListSanPhamRecommend] = useState([]);
  const [sortOrder, setSortOrder] = useState("");
  const [total, setTotal] = useState(0);
  const [limitItem, setLimitItem] = useState(12);
  const [pageIndex, setPageIndex] = useState(1);
  const [numberPage, setNumberPage] = useState(1);
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    setPageIndex(1);
  }, [search]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await productService.filterProducts(
        pageIndex ? pageIndex : 1,
        limitItem,
        sortOrder,
        search,
        category
      );
      if (response.data.success) {
        setListSanPham(response.data.result.data);
        setTotal(response.data.result.pagination.total);
        setLimitItem(response.data.result.pagination.limit);
        setItemCount(response.data.result.pagination.itemCount);
        setNumberPage(response.data.result.pagination.totalPages);
      }
    };
    fetchData();
  }, [pageIndex, limitItem, sortOrder, search, category]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await productService.getProducts();
      if (response.data.success) {
        setListSanPhamRecommend(response.data.result);
      }
    };
    fetchData();
  }, []);

  const handleSortChange = (event) => {
    setPageIndex(1);
    setSortOrder(event.target.value);
  };

  const handleShowChange = (event) => {
    setPageIndex(1);
    setLimitItem(event.target.value);
  };

  const handleChangePageIndex = (e) => {
    const index = Number(e.target.getAttribute("value"));
    setPageIndex(index);
  };

  return (
    <>
      <div className={cx("home", "grid__column__10")}>
        <div className={cx("home__child")}>
          <div className={cx("home__child")}>
            <div className={cx("home__child__recommend")}>
              <div className={cx("home__child__recommend__content")}>
                Recommended Products
              </div>
              <div className={cx("home__child__recommend__icon")}>
                <FontAwesomeIcon
                  icon={faAngleLeft}
                  className={cx("home__child__recommend__icon--left")}
                />
                <FontAwesomeIcon
                  icon={faAngleRight}
                  className={cx("home__child__recommend__icon--right")}
                />
              </div>
            </div>
            <div className={cx("home__child__product--wrapper")}>
              <ul className={cx("home__child__product", "grid__row--noWrap")}>
                {listSanPhamRecommend.map((sanPham, index) => {
                  if (sanPham.deXuat) {
                    return <HomeChild key={index} sanPham={sanPham} />;
                  }
                })}
              </ul>
            </div>
            <div className={cx("home__child__page")}>
              <div
                className={cx(
                  "home__child__page__icon",
                  "home__child__page__icon--first"
                )}
              ></div>
              <div
                className={cx(
                  "home__child__page__icon",
                  "home__child__page__icon--second"
                )}
              ></div>
              <div
                className={cx(
                  "home__child__page__icon",
                  "home__child__page__icon--third"
                )}
              ></div>
            </div>
          </div>
        </div>
        <div className={cx("home__shop")}>
          <div className={cx("home__shop__name")}>
            <div className={cx("home__shop__name--left")}>Shop</div>
            <div className={cx("home__shop__name--right")}>
              Showing {itemCount} of {total} results
            </div>
          </div>
          <div className={cx("home__shop__selection")}>
            <div className={cx("home__shop__selection__icon")}>
              <Fragment>
                <FontAwesomeIcon
                  icon={faBars}
                  className={cx("home__shop__selection__icon__child")}
                />
                <FontAwesomeIcon
                  icon={faList}
                  className={cx("home__shop__selection__icon__child")}
                />
              </Fragment>
            </div>
            <div className={cx("home__shop__selection__list")}>
              <div className={cx("home__shop__selection__list__sort")}>
                <select
                  name="orderby"
                  className={cx("home__shop__selection__list__sort__selection")}
                  aria-label="Shop order"
                  value={sortOrder}
                  onChange={handleSortChange}
                >
                  {sortOptions.map((option) => (
                    <option
                      key={option.value}
                      className={cx(
                        "home__shop__selection__list__sort__selection--child"
                      )}
                      value={option.value}
                    >
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={cx("home__shop__selection__list__show")}>
                <select
                  name="quality"
                  className={cx("home__shop__selection__list__show__selection")}
                  aria-label="Show count"
                  value={limitItem}
                  onChange={handleShowChange}
                >
                  {showOptions.map((option) => (
                    <option
                      key={option.value}
                      className={cx(
                        "home__shop__selection__list__show__selection--child"
                      )}
                      value={option.value}
                    >
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className={cx("home__shop__selection__page")}>
              {pageIndex > 1 && (
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  onClick={() =>
                    setPageIndex(pageIndex - 1 < 1 ? 1 : pageIndex - 1)
                  }
                />
              )}
              <input
                type="text"
                name=""
                id=""
                value={pageIndex}
                className={cx("home__shop__selection__page--input")}
                onChange={(e) =>
                  setPageIndex(
                    e.target.value > numberPage ? numberPage : e.target.value
                  )
                }
              />
              <span className={cx("home__shop__selection__page--content")}>
                of {numberPage}
              </span>
              <FontAwesomeIcon
                icon={faArrowRight}
                onClick={() =>
                  setPageIndex(
                    pageIndex + 1 > numberPage ? numberPage : pageIndex + 1
                  )
                }
              />
            </div>
          </div>
          <ul className={cx("home__shop__product", "grid__row")}>
            {listSanPham.map((sanPham) => (
              <HomeChild key={sanPham._id} sanPham={sanPham} />
            ))}
          </ul>
          <div className={cx("home__shop__page")}>
            <div className={cx("home__shop__page--left")}>
              Showing {itemCount} of {total} results
            </div>
            <div className={cx("home__shop__page--right")}>
              {Array.from({ length: numberPage }, (_, index) => index + 1).map(
                (item) => (
                  <div
                    key={item}
                    className={cx("home__shop__page--right--round", {
                      "home__shop__page--right--round--active":
                        item == pageIndex,
                    })}
                    value={item}
                    onClick={handleChangePageIndex}
                  >
                    {item}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
Home.propTypes = {
  search: PropTypes.object,
  category: PropTypes.object,
};

export default Home;
