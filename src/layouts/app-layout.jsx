//import Header from "@/components/header";

//import React from "react";
import Header from "@/components/header";
import {Outlet} from "react-router-dom";

const AppLayout = () => {
  return (
    <div>
        <main className="min-h-screen countainer">
         <Header/>
            <Outlet />
        </main>
        <div className=" font-bold p-10 text-center bg-gray-800 mt-10">
            Made By Sanat Kumar
        </div>
    </div>
  );
};

export default AppLayout;