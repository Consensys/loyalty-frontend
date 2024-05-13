import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useMatch, useLocation } from "react-router-dom";

// convert path to title
const getTitle = (path) => {
  return path
    .replace(/\//g, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

export default function Layout() {
  const location = useLocation();
  const match = useMatch(location.pathname);

  return (
    <div className="App">
      <Header />
      <div style={{ borderBottom: "1px solid #777", padding: "0 48px" }}>
        <h1 style={{ color: "white" }}>
          {getTitle(match.pathname) || "Dashboard"}
        </h1>
      </div>
      <div className="content" style={{ padding: "32px" }}>
        <Outlet />
      </div>
    </div>
  );
}
