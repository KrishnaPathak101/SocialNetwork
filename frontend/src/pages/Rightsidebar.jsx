import { useContext, useEffect, useState } from "react";
import { UserContext } from "../useContext";
import axios from "axios";
import UsersToFollow from "../Components/UsersToFollow";
import profile from '../assets/profile.jpg';


const RightSidebar = () => {
    return (
      <div >
        <div className="">
          <div className="p-4"> 
            <UsersToFollow />
          </div>
        </div>
      </div>
    )
  };

  export default RightSidebar;