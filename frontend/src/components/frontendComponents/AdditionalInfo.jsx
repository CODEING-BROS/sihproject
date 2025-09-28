import React from "react";
import useAuthStore from "@/store/authStore";
import { format } from "date-fns"; // ✅ Import the format function

export default function AdditionalInfo() {
  const { userprofile } = useAuthStore();

  if (!userprofile) {
    return (
      <div className="bg-[#1a1d23] p-4 rounded-lg text-sm space-y-3 text-center text-gray-500">
        <h3 className="text-lg font-semibold text-white mb-2">Additional Info</h3>
        <p>Loading...</p>
      </div>
    );
  }

  const { city, country, gender, experiencelevel, availability, dateofbirth } = userprofile;

  // ✅ Format the date of birth if it exists
  const formattedDate = dateofbirth ? format(new Date(dateofbirth), 'MMM dd, yyyy') : "N/A";

  return (
    <div className="bg-[#1a1d23] p-4 rounded-lg text-sm space-y-3">
      <h3 className="text-lg font-semibold mb-2 text-white">Additional Info</h3>
      
      <div className="flex justify-between text-gray-400">
        <span className="text-white">City:</span>
        <span>{city || "N/A"}</span>
      </div>
      <div className="flex justify-between text-gray-400">
        <span className="text-white">Country:</span>
        <span>{country || "N/A"}</span>
      </div>
      <div className="flex justify-between text-gray-400">
        <span className="text-white">Gender:</span>
        <span>{gender || "N/A"}</span>
      </div>
      <div className="flex justify-between text-gray-400">
        <span className="text-white">Experience:</span>
        <span className="capitalize">{experiencelevel || "N/A"}</span>
      </div>
      <div className="flex justify-between text-gray-400">
        <span className="text-white">Availability:</span>
        <span className="capitalize">{availability || "N/A"}</span>
      </div>
      <div className="flex justify-between text-gray-400">
        <span className="text-white">Date of Birth:</span>
        <span className="capitalize">{formattedDate}</span>
      </div>
    </div>
  );
}