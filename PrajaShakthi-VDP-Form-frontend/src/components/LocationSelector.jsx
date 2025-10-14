import React from "react";
import CommunityCouncilTable from "./CommunityCouncilTable";

const LocationSelector = ({
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
  isSectionFull,
}) => {
  return (
    <>
      <div className="form-group">
        <label className="form-label">දිස්ත්‍රික්කය:</label>
        <select
          value={district}
          onChange={handleDistrictChange}
          className="form-control"
        >
          <option value="">-- දිස්ත්‍රික්කය තෝරන්න --</option>
          {districts.map((d) => (
            <option key={d.district.trim()} value={d.district.trim()}>
              {d.district.trim()}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">ප්‍රාදේශීය ලේකම් කොට්ඨාශය:</label>
        <select
          value={divisionalSec}
          onChange={handleDivisionalSecChange}
          className="form-control"
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

      <div className="form-group">
        <label className="form-label">ග්‍රාම නිලධාරී කොට්ඨාශය:</label>
        <select
          value={gnDivision}
          onChange={(e) => setGnDivision(e.target.value)}
          className="form-control"
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

      <div className="form-group">
        <label className="form-label">CDC/VDP ID:</label>{" "}
        <input
          type="text"
          value={cdcVdpId}
          onChange={(e) => setCdcVdpId(e.target.value)}
          className="form-control"
        />{" "}
      </div>
      <CommunityCouncilTable
        data={communityCouncilData}
        onChange={handleCouncilRowChange}
        onAddRow={addCouncilRow}
        deleteCouncilRow={deleteCouncilRow}
        isSectionFull={isSectionFull}
      />
    </>
  );
};

export default LocationSelector;
