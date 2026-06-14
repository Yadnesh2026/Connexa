import React from "react";
import NavBarComponent from "../../components/Navbar";

function UserLayout({ children }) {
  return (
    <>
      <NavBarComponent />
      {children}
    </>
  );
}

export default UserLayout;