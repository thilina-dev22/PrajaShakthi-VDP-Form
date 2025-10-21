import React from "react";

const SectorSelector = ({
  sectors,
  sector,
  subCategory,
  subSubCategory,
  subSubSubCategory,
  setSector,
  setSubCategory,
  setSubSubCategory,
  setSubSubSubCategory,
  resetSelections,
}) => {
  const getSubCategories = () =>
    sector ? Object.keys(sectors[sector] || {}) : [];
  const getSubSubCategories = () =>
    sector && subCategory
      ? Object.keys(sectors[sector][subCategory] || {})
      : [];
  const getSubSubSubCategories = () =>
    sector && subCategory && subSubCategory
      ? Object.keys(sectors[sector][subCategory][subSubCategory] || {})
      : [];

  return (
    <>
      <div className="mb-5">
        <label className="block mb-2 font-medium text-gray-700 text-base">
          Select Focused Area / Development Sector / මූලික සංවර්ධන අංශය:
        </label>
        <select
          value={sector}
          onChange={(e) => {
            setSector(e.target.value);
            resetSelections(1);
          }}
          className="w-full px-3 py-3 sm:px-4 sm:py-3 border border-gray-300 rounded-md text-base focus:border-[#A8234A] focus:ring-2 focus:ring-[#F37021]/20 transition-all duration-200 outline-none"
        >
          <option value="">තෝරන්න</option>
          {Object.keys(sectors).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      {sector && getSubCategories().length > 0 && (
        <div className="mb-5">
          <label className="block mb-2 font-medium text-gray-700 text-base">Select Sub-Category / උප කාණ්ඩය:</label>
          <select
            value={subCategory}
            onChange={(e) => {
              setSubCategory(e.target.value);
              resetSelections(2);
            }}
            className="w-full px-3 py-3 sm:px-4 sm:py-3 border border-gray-300 rounded-md text-base focus:border-[#A8234A] focus:ring-2 focus:ring-[#F37021]/20 transition-all duration-200 outline-none"
          >
            <option value="">තෝරන්න</option>
            {getSubCategories().map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      )}
      {subCategory &&
        getSubSubCategories().length > 0 &&
        !(
          sectors[sector][subCategory].isTable ||
          sectors[sector][subCategory].isFixedRowTable ||
            sectors[sector][subCategory].isHybridTable ||
          sectors[sector][subCategory].problems
        ) && (
          <div className="mb-5">
            <label className="block mb-2 font-medium text-gray-700 text-base">
              Select Sub-Sub-Category / උප උප කාණ්ඩය:
            </label>
            <select
              value={subSubCategory}
              onChange={(e) => {
                setSubSubCategory(e.target.value);
                resetSelections(3);
              }}
              className="w-full px-3 py-3 sm:px-4 sm:py-3 border border-gray-300 rounded-md text-base focus:border-[#A8234A] focus:ring-2 focus:ring-[#F37021]/20 transition-all duration-200 outline-none"
            >
              <option value="">තෝරන්න</option>
              {getSubSubCategories().map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}
      {subSubCategory &&
        getSubSubSubCategories().length > 0 &&
        !(
          sectors[sector][subCategory][subSubCategory].isTable ||
          sectors[sector][subCategory][subSubCategory].isFixedRowTable ||
            sectors[sector][subCategory][subSubCategory].isHybridTable ||
          sectors[sector][subCategory][subSubCategory].problems
        ) && (
          <div className="mb-5">
            <label className="block mb-2 font-medium text-gray-700 text-base">
              Select Sub-Sub-Sub-Category / උප උප උප කාණ්ඩය:
            </label>
            <select
              value={subSubSubCategory}
              onChange={(e) => {
                setSubSubSubCategory(e.target.value);
                resetSelections(4);
              }}
              className="w-full px-3 py-3 sm:px-4 sm:py-3 border border-gray-300 rounded-md text-base focus:border-[#A8234A] focus:ring-2 focus:ring-[#F37021]/20 transition-all duration-200 outline-none"
            >
              <option value="">තෝරන්න</option>
              {getSubSubSubCategories().map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}
    </>
  );
};

export default SectorSelector;