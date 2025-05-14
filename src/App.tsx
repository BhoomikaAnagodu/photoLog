import { Outlet } from "react-router-dom";
import Header from "./components/Header";

function App() {
  return (
    <div className="relative w-full">
      <Header />
      <div className="aspect-auto w-5/6 mx-auto pt-25">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
