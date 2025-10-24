// import React from "react";
// import { Link, useLocation } from "react-router-dom";

// export default function ProfileSelector({ activeCategory, setActiveCategory }) {
//   const location = useLocation();

//   const categories = [
//     {
//       id: "driver",
//       label: "Driver",
//       icon: "fa-person",
//       path: "/register-driver",
//     },
//     {
//       id: "operator",
//       label: "Parking Facility Operator",
//       icon: "fa-building",
//       path: "/register-operator",
//     },
//   ];

//   return (
//     <div className="flex justify-center flex-wrap gap-4 mb-6 mt-10">
//       {categories.map((cat) => {
//         const isActive =
//           activeCategory === cat.id || location.pathname.includes(cat.id);

//         return (
//           <Link
//             key={cat.id}
//             to={cat.path}
//             onClick={() => setActiveCategory(cat.id)}
//             className={`w-44 border rounded-lg p-6 text-center transition-all 
//               hover:shadow-[0_4px_25px_gray] shadow-sm
//               ${
//                 isActive
//                   ? "border-[#469bd5] bg-[#469bd5]"
//                   : "border-gray-300 bg-white"
//               }`}
//           >
//             <div className="flex flex-col gap-4 items-center">
//               <i
//                 className={`fa-solid ${cat.icon} text-5xl ${
//                   isActive ? "text-white" : "text-[#469bd5]"
//                 }`}
//               ></i>
//               <p
//                 className={`font-medium text-sm ${
//                   isActive ? "text-white" : "text-[#469bd5]"
//                 }`}
//               >
//                 {cat.label}
//               </p>
//             </div>
//           </Link>
//         );
//       })}
//     </div>
//   );
// }
