// src/components/LocationSelectorBase.jsx
import React from "react";

// This component contains ONLY the location dropdowns.
const LocationSelectorBase = ({
  district,
  divisionalSec,
  gnDivision,
  districts,
  dsDivisions,
  gnDivisions,
  handleDistrictChange,
  handleDivisionalSecChange,
  setGnDivision,
}) => {
  return (
    <>
      <div className="mb-5">
        <label className="block mb-2 font-medium text-gray-700 text-base">
          දිස්ත්‍රික්කය / மாவட்டம் / District :
        </label>
        <select
          value={district}
          onChange={handleDistrictChange}
          className="w-full px-3 py-3 sm:px-4 sm:py-3 border border-gray-300 rounded-md text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
        >
          <option value="">-- දිස්ත්‍රික්කය තෝරන්න --</option>
          {districts.map((d) => (
            <option key={d.district.trim()} value={d.district.trim()}>
              {d.district.trim()}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-5">
        <label className="block mb-2 font-medium text-gray-700 text-base">
          ප්‍රාදේශීය ලේකම් කොට්ඨාශය / பிரதேச செயலகப் பிரிவு / Divisional
          Secretariat Division :
        </label>
        <select
          value={divisionalSec}
          onChange={handleDivisionalSecChange}
          className="w-full px-3 py-3 sm:px-4 sm:py-3 border border-gray-300 rounded-md text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          disabled={!district}
        >
          <option value="">-- ප්‍රා. ලේ. කොට්ඨාශය තෝරන්න --</option>
          {dsDivisions.map((ds) => (
            <option
              key={ds.ds_division_name.trim()}
              value={ds.ds_division_name.trim()}
            >
              {ds.ds_division_name.trim()}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-5">
        <label className="block mb-2 font-medium text-gray-700 text-base">
          ග්‍රාම නිලධාරී කොට්ඨාශය / கிராம அலுவலர் பிரிவு / Grama Niladhari
          Division :
        </label>
        <select
          value={gnDivision}
          onChange={(e) => setGnDivision(e.target.value)}
          className="w-full px-3 py-3 sm:px-4 sm:py-3 border border-gray-300 rounded-md text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          disabled={!divisionalSec}
        >
          <option value="">-- ග්‍රා. නි. වසම තෝරන්න --</option>
          {gnDivisions.map((gn, index) => (
            <option
              key={`${gn.gn_name.trim()}-${index}`}
              value={gn.gn_name.trim()}
            >
              {gn.gn_name.trim()}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default LocationSelectorBase;
