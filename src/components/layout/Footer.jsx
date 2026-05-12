import React from "react";
import { Shield, Lock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-0  mt-auto shadow-sm">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
         
          <div className="text-sm text-gray-500">
             {new Date().getFullYear()} AXIPAYS. All rights reserved.
          </div>

         
          <div className="flex items-center gap-4">
            HELLO !
          </div>

          
          <div className="text-xs text-gray-400">
            support@axipays.com
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;