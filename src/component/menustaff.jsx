import { FaTachometerAlt, FaShoppingCart, FaChalkboardTeacher, FaFileAlt, FaUser, FaCog } from "react-icons/fa";
import { Link } from "react-router-dom";


export default function Menu({isOpen}) {
    const admin = JSON.parse(localStorage.getItem("admin"));
    const email = admin?.email || null;
  return (
  <>
    <nav className={`sidebar-menu ${isOpen ? "active":""}`}>
      <ul>
        <li>
          <Link to="/qldatlich" style={{textDecoration:"none",color:"#0E4274"}}>
            <FaTachometerAlt /><span>Quản lý Booking</span>
          </Link>
        </li>
        <li>
          <Link to="/listcusStaff" style={{textDecoration:"none",color:"#0E4274"}}>
            <FaShoppingCart /><span>Quản lý khách hàng</span>
          </Link>
        </li>
      
      </ul>
    </nav>
     </>
  );
}
