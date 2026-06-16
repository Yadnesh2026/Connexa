import React from "react";
import UserLayout from "../layout/UserLayout/page";
import DashBoardLayout from "../layout/DashBoardLayout/Page";

export default function MyConnectionsPage() {
  return (
    <UserLayout>
      <DashBoardLayout>
        <div>
          <h1>My Connections</h1>
        </div>
      </DashBoardLayout>
    </UserLayout>
  );
}
