import React from "react";
import NavBarComponent from "../../components/Navbar/page";

function UserLayout({ children }) {
  return (
    <>
      <NavBarComponent />
      {children}
    </>
  );
}

export default UserLayout;