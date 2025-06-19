import { Navigate, Outlet } from "react-router-dom"


const ProtectedRoute=()=>{
    const isAuth=localStorage.getItem("token")
    if(!isAuth){
        return <Navigate to={"/"} replace={true} />
    }
    return <Outlet />
}

export default ProtectedRoute