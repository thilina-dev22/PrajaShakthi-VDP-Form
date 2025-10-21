// src/components/DevelopmentFormLocation.jsx (New name, new content)
import React from "react";
import LocationSelectorBase from "./LocationSelectorBase"; // Import the base component

// This component now contains ONLY the LocationSelectorBase
// CommunityCouncilTable has been removed from the main form
const DevelopmentFormLocation = ({
  district,
  divisionalSec,
  gnDivision,
  cdcVdpId,
  districts,
  dsDivisions,
  gnDivisions,
  handleDistrictChange,
  handleDivisionalSecChange,
  setGnDivision,
  setCdcVdpId,
}) => {
  return (
    <>
      {/* Reusable Location Dropdowns */}
      <LocationSelectorBase
        district={district}
        divisionalSec={divisionalSec}
        gnDivision={gnDivision}
        cdcVdpId={cdcVdpId}
        districts={districts}
        dsDivisions={dsDivisions}
        gnDivisions={gnDivisions}
        handleDistrictChange={handleDistrictChange}
        handleDivisionalSecChange={handleDivisionalSecChange}
        setGnDivision={setGnDivision}
        setCdcVdpId={setCdcVdpId}
      />
    </>
  );
};

export default DevelopmentFormLocation;