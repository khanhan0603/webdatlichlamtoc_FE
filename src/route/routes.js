import HeaderAD from "../component/header";
import LoginAdmin from "../component/qtv/login";
import LoginUser from "../component/user/login";
import { createBrowserRouter } from "react-router-dom";
import ListCustomer from "../pages/listcustomer";
import DSSalon from "../pages/salon/salon";
import KhuyenMai from "../pages/khuyenmai";
import DichVu from "../pages/services/dichvu";
import BookingPage from "../pages/datlich"
import MenuAD from "../component/menuad";
import LoaiDichVu from "../pages/typeservices/loaidichvu";
import NhanVien from "../pages/nhanvien/nhanvien";
import ADDNV from "../pages/nhanvien/themnv";
import UpdateNhanVien from "../pages/nhanvien/updatenv";
import RegisterUser from "../component/user/register";
import ADDSalon from "../pages/salon/addsalon";
import UpdateSalon from "../pages/salon/updatesalon";
import ADDDichVu from "../pages/services/adddv";
import UpdateDichVu from "../pages/services/updatedv";
import ADDLDV from "../pages/typeservices/addtype";
import UpdateType from "../pages/typeservices/updateldv";
import ListCustomerStaff from "../pages/staff/listKH";
import PTDV from "../pages/ptdv/listptdv";
import QuanlyDL from "../pages/qldatlich";

export const router=createBrowserRouter([
    
 {
    path:"/loginuser",
    element:<LoginUser />
 }
    ,
    {
    path:"/login",
    element:<LoginAdmin />
 },
 {
  path:"/register",
  element:<RegisterUser />
 }
 ,{
   path:"/header",
   element:<HeaderAD />
 },
 {
   path:"/listcustomer",
   element:<ListCustomer />
 }
 ,
 {
   path:"/qlsalon",
   element:<DSSalon />
 }
 ,{
   path:"/qlkm",
   element:<KhuyenMai />
 },
 {
   path:"/qldichvu",
   element:<DichVu />
 }
 ,
 {
   path:"/datlich",
   element:<BookingPage />
 }
 ,{
  path:"/menu",
  element:<MenuAD />
 },
{
  path:"/qlloaidichvu",
  element:<LoaiDichVu />
}
,{
  path:"/qlnvtv",
  element:<NhanVien />
},
{
  path:"/addnv",
  element:<ADDNV />
}
,
{
  path:"/updatenv/:id",
  element:<UpdateNhanVien />
}
,{
  path:"/addsalon",
  element:<ADDSalon />
}
,
{
  path:"/updatesalon/:id",
  element:<UpdateSalon />
}
,
{
  path:"/adddichvu",
  element:<ADDDichVu />
},
{
  path:"/updatedv/:id",
  element:<UpdateDichVu />
},
{
  path:"/addldv",
  element:<ADDLDV />
},

{
  path:"/updateldv/:id",
  element:<UpdateType />
}
,{
  path:"/staff",
  element:<ListCustomerStaff />
},
{
  path:"/qlptdv",
  element:<PTDV />
}
,{
  path:"/qldatlich",
  element:<QuanlyDL />
}
])