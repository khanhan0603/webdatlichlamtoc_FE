import HeaderAD from "../../component/header";
import MenuAD from "../../component/menuad";
import QLDichVu from "../../component/qtv/services/dichvu";



export default function DichVu(){
    return (
        <>
        <HeaderAD />
        <QLDichVu />
        <MenuAD />
        </>
    )
}