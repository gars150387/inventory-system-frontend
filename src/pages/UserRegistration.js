import React from "react";
import { Register } from "../authentication/Register";
import { UpdateUser } from "../authentication/UpdateUser";
import { RoleDescription } from "../components/ui/RoleDescription";

export const UserRegistration = () => {
  return (
    <div style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
        <Register />
        <RoleDescription />
        <UpdateUser />
    </div>
  );
};
