// src/components/LocationSelectorBase.jsx
import React from "react";
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  
  return (
    <>
      <div className="mb-5">
        <label className="block mb-2 font-medium text-gray-700 text-base">
          {t('form.district')} :
        </label>
        <select
          value={district}
          onChange={handleDistrictChange}
          className="w-full px-3 py-3 sm:px-4 sm:py-3 border border-gray-300 rounded-md text-base focus:border-[#A8234A] focus:ring-2 focus:ring-[#F37021]/20 transition-all duration-200 outline-none"
        >
          <option value="">-- {t('form.selectDistrict')} --</option>
          {districts.map((d) => (
            <option key={d.district.trim()} value={d.district.trim()}>
              {d.district.trim()}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-5">
        <label className="block mb-2 font-medium text-gray-700 text-base">
          {t('form.dsDivision')} :
        </label>
        <select
          value={divisionalSec}
          onChange={handleDivisionalSecChange}
          className="w-full px-3 py-3 sm:px-4 sm:py-3 border border-gray-300 rounded-md text-base focus:border-[#A8234A] focus:ring-2 focus:ring-[#F37021]/20 transition-all duration-200 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          disabled={!district}
        >
          <option value="">-- {t('form.selectDs')} --</option>
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
          {t('form.gnDivision')} :
        </label>
        <select
          value={gnDivision}
          onChange={(e) => setGnDivision(e.target.value)}
          className="w-full px-3 py-3 sm:px-4 sm:py-3 border border-gray-300 rounded-md text-base focus:border-[#A8234A] focus:ring-2 focus:ring-[#F37021]/20 transition-all duration-200 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          disabled={!divisionalSec}
        >
          <option value="">-- {t('form.selectGn')} --</option>
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
