import { AUTH_PATH } from "contants";
import Footer from "layouts/footer";
import Header from "layouts/header";
import { Outlet, useLocation } from "react-router-dom";

export default function Container() {
  const { pathname } = useLocation();

  return (
    <>
      <Header />
      <Outlet />
      {pathname !== AUTH_PATH() && <Footer />}
    </>
  );
}
