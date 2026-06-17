import React, { useEffect } from "react";
import { clientServer } from "../config";

// SSR
export default function ViewProfilePage({ userProile }) {
  useEffect(() => {
    console.log("From View: View Profile");
  });
  return 
  <div>{userProile.userId.name}</div>;
}

export async function getServerSideProps(context) {
  console.log("From View");
  console.log(context.query.username);

  const request = await clientServer.get(
    "/user/getUserProfileAndUserBasedOnUsername",
    {
      params: {
        username: context.query.username,
      },
    },
  );
  const response = await request.data;
  console.log(response);

  return { props: { userProile: request.data.propfile } };
}
