import classNames from "classnames/bind";
import styles from "./SideBarType.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import config from "~/config/config";
import PropTypes from "prop-types";

const cx = classNames.bind(styles);
function SideBarType({ type }) {
  return (
    <li className={cx("sidebarType")}>
      <div className={cx("sidebarType__parent")}>
        <span className={cx("sidebarType__parent__icon")}>
          <FontAwesomeIcon
            icon={faAngleRight}
            className={cx("sidebarType__parent__icon--child")}
          />
        </span>
        <NavLink to={config.routes.home}>
          <div className={cx("sidebarType__parent__content")}>
            {type.tenSanPham}
          </div>

          <span className={cx("sidebarType__parent__quality")}></span>
        </NavLink>
      </div>
    </li>
  );
}
SideBarType.propTypes = {
  type: PropTypes.shape({
    tenSanPham: PropTypes.string.isRequired,
  }).isRequired,
};

export default SideBarType;