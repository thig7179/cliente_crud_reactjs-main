import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.min.css";
import { AppProvider } from "./context/Context";
import { DashBoard } from "./pages/DashBoard";

function App() {
  return (
    <AppProvider>
      <DashBoard />
      <ToastContainer />
    </AppProvider>
  );
}

export default App;
