// src/components/DevelopmentFormLocation.jsx (New name, new content)
import React from "react";
import LocationSelectorBase from "./LocationSelectorBase"; // Import the base component

// This component now contains ONLY the LocationSelectorBase
// CommunityCouncilTable has been removed from the main form
const DevelopmentFormLocation = ({
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
  return (
    <>
      {/* Reusable Location Dropdowns */}
      <LocationSelectorBase
        district={district}
        divisionalSec={divisionalSec}
        gnDivision={gnDivision}
        districts={districts}
        dsDivisions={dsDivisions}
        gnDivisions={gnDivisions}
        handleDistrictChange={handleDistrictChange}
        handleDivisionalSecChange={handleDivisionalSecChange}
        setGnDivision={setGnDivision}
        isDistrictDisabled={isDistrictDisabled}
        isDSDisabled={isDSDisabled}
      />
    </>
  );
};

export default DevelopmentFormLocation;