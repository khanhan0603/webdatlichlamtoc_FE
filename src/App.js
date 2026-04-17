import { RouterProvider } from "react-router-dom";
import { router } from "./route/routes";
import { ToastContainer } from 'react-toastify';
//import { StoreProvider } from "./contexts/storeProvider";

function App() {
  return (
  <>

  <RouterProvider router={router}>
  </RouterProvider>
  <ToastContainer />

 </>

  )
}

export default App;
