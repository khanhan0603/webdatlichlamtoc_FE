import { 
  FaTachometerAlt, 
  FaShoppingCart, 
  FaChalkboardTeacher, 
  FaFileAlt, 
  FaUser, 
  FaCog 
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function MenuAD({ isOpen }) {
  //const admin = JSON.parse(localStorage.getItem("admin") || "{}");
 //const email = admin?.email || "";

  return (
    <nav className={`sidebar-menu ${isOpen ? "active" : ""}`}>
      <ul>
      <li>
          <Link to="/qldatlich">
            <FaShoppingCart />
            <span>Quản lý đặt lịch</span>
          </Link>
        </li>
        
        <li>
          <Link to="/qlsalon">
            <FaChalkboardTeacher />
            <span>Quản lý salon</span>
          </Link>
        </li>
        <li>
          <Link to="/qlnvtv">
            <FaFileAlt />
            <span>Quản lý nhân viên tư vấn</span>
          </Link>
        </li>
        <li>
          <Link to="/qlloaidichvu">
            <FaFileAlt />
            <span>Quản lý loại dịch vụ</span>
          </Link>
        </li>
        <li>
          <Link to="/qldichvu">
            <FaUser />
            <span>Quản lý dịch vụ</span>
          </Link>
        </li>
        <li>
          <Link to="/qlptdv">
            <FaCog />
            <span>Quản lý phương tiện dịch vụ</span>
          </Link>
        </li>
        <li>
          <Link to="/qlkm">
            <FaCog />
            <span>Quản lý khuyến mãi</span>
          </Link>
        </li>
        <li>
          <Link to="/listcustomer">
            <FaShoppingCart />
            <span>Quản lý khách hàng</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}