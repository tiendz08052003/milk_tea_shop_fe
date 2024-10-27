import HeaderTop from "./HeaderTop";
import HeaderBody from "./HeaderBody";

import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import HeaderFooter from "./HeaderFooter";
import PropTypes from "prop-types";

const cx = classNames.bind(styles);

function Header({ setSearch }) {
  return (
    <div className={cx("header")}>
      <HeaderTop />
      <HeaderBody setSearch={setSearch} />
      <HeaderFooter />
    </div>
  );
}

Header.propTypes = {
  setSearch: PropTypes.func.isRequired,
};

export default Header;