import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function Layout() {
  return (
    <div className="App">
      <Header />
      <div style={{ height: '50px'}} />
      <Outlet />
    </div>
  )
}