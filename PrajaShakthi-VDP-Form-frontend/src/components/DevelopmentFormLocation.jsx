// src/components/DevelopmentFormLocation.jsx (New name, new content)
import React from "react";
import CommunityCouncilTable from "./CommunityCouncilTable";
import LocationSelectorBase from "./LocationSelectorBase"; // Import the base component

// This component now *combines* the LocationSelectorBase and the CommunityCouncilTable
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
  communityCouncilData,
  handleCouncilRowChange,
  addCouncilRow,
  deleteCouncilRow,
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
      
      {/* Community Council Table (Only for the Main Form) */}
      <CommunityCouncilTable
        data={communityCouncilData}
        onChange={handleCouncilRowChange}
        onAddRow={addCouncilRow}
        deleteCouncilRow={deleteCouncilRow}
      />
    </>
  );
};

export default DevelopmentFormLocation;