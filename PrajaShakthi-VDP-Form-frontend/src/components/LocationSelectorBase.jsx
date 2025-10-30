// src/components/LocationSelectorBase.jsx
import React, { useState, useEffect } from "react";
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
  isDistrictDisabled = false,
  isDSDisabled = false,
}) => {
  const { t } = useTranslation();
  
  const [isDSManual, setIsDSManual] = useState(false);
  const [isGNManual, setIsGNManual] = useState(false);
  const [manualDSValue, setManualDSValue] = useState('');
  const [manualGNValue, setManualGNValue] = useState('');

  // Reset manual entry states when district changes
  useEffect(() => {
    setIsDSManual(false);
    setIsGNManual(false);
    setManualDSValue('');
    setManualGNValue('');
  }, [district]);

  // Reset GN manual entry when DS changes
  useEffect(() => {
    setIsGNManual(false);
    setManualGNValue('');
  }, [divisionalSec]);

  const handleDSDropdownChange = (e) => {
    const value = e.target.value;
    if (value === '__MANUAL_ENTRY__') {
      setIsDSManual(true);
      setManualDSValue('');
    } else {
      setIsDSManual(false);
      setManualDSValue('');
      handleDivisionalSecChange(e);
    }
  };

  const handleManualDSChange = (e) => {
    const value = e.target.value;
    setManualDSValue(value);
    // Trigger the parent's change handler with manual value
    handleDivisionalSecChange({ target: { value } });
  };

  const handleGNDropdownChange = (e) => {
    const value = e.target.value;
    if (value === '__MANUAL_ENTRY__') {
      setIsGNManual(true);
      setManualGNValue('');
    } else {
      setIsGNManual(false);
      setManualGNValue('');
      setGnDivision(value);
    }
  };

  const handleManualGNChange = (e) => {
    const value = e.target.value;
    setManualGNValue(value);
    setGnDivision(value);
  };
  
  return (
    <>
      <div className="mb-5">
        <label className="block mb-2 font-medium text-gray-700 text-base">
          {t('form.district')} :
        </label>
        <select
          value={district}
          onChange={handleDistrictChange}
          disabled={isDistrictDisabled}
          className="w-full px-3 py-3 sm:px-4 sm:py-3 border border-gray-300 rounded-md text-base focus:border-[#A8234A] focus:ring-2 focus:ring-[#F37021]/20 transition-all duration-200 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
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
        {isDSManual ? (
          <>
            <input
              type="text"
              value={manualDSValue}
              onChange={handleManualDSChange}
              placeholder={t('form.enterDsManually') || 'Enter DS Division name'}
              className="w-full px-3 py-3 sm:px-4 sm:py-3 border border-gray-300 rounded-md text-base focus:border-[#A8234A] focus:ring-2 focus:ring-[#F37021]/20 transition-all duration-200 outline-none"
            />
            <button
              type="button"
              onClick={() => {
                setIsDSManual(false);
                setManualDSValue('');
                handleDivisionalSecChange({ target: { value: '' } });
              }}
              className="mt-2 text-sm text-[#A8234A] hover:text-[#8A1D3C] underline"
            >
              {t('form.backToDropdown') || 'Back to dropdown'}
            </button>
          </>
        ) : (
          <select
            value={divisionalSec}
            onChange={handleDSDropdownChange}
            className="w-full px-3 py-3 sm:px-4 sm:py-3 border border-gray-300 rounded-md text-base focus:border-[#A8234A] focus:ring-2 focus:ring-[#F37021]/20 transition-all duration-200 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={!district || isDSDisabled}
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
            <option value="__MANUAL_ENTRY__" className="text-[#A8234A] font-medium">
              -- {t('form.otherManualEntry') || 'Other (Enter Manually)'} --
            </option>
          </select>
        )}
      </div>

      <div className="mb-5">
        <label className="block mb-2 font-medium text-gray-700 text-base">
          {t('form.gnDivision')} :
        </label>
        {isGNManual ? (
          <>
            <input
              type="text"
              value={manualGNValue}
              onChange={handleManualGNChange}
              placeholder={t('form.enterGnManually') || 'Enter GN Division name'}
              className="w-full px-3 py-3 sm:px-4 sm:py-3 border border-gray-300 rounded-md text-base focus:border-[#A8234A] focus:ring-2 focus:ring-[#F37021]/20 transition-all duration-200 outline-none"
            />
            <button
              type="button"
              onClick={() => {
                setIsGNManual(false);
                setManualGNValue('');
                setGnDivision('');
              }}
              className="mt-2 text-sm text-[#A8234A] hover:text-[#8A1D3C] underline"
            >
              {t('form.backToDropdown') || 'Back to dropdown'}
            </button>
          </>
        ) : (
          <select
            value={gnDivision}
            onChange={handleGNDropdownChange}
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
            <option value="__MANUAL_ENTRY__" className="text-[#A8234A] font-medium">
              -- {t('form.otherManualEntry') || 'Other (Enter Manually)'} --
            </option>
          </select>
        )}
      </div>
    </>
  );
};

export default LocationSelectorBase;
