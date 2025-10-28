import React, { useState, useEffect } from "react";
import { getSubmissions, deleteSubmission, updateSubmission } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import provincialDataJson from "../data/provincial_data.json";
// Import sectors for label lookup
import { sectors } from "../data/sectors_data";
// Import libraries for export functionality
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
// REMOVED: import "./AdminTabs.css"; since custom CSS was removed

const SubmissionList = () => {
  const { isAuthenticated, isSuperAdmin } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("council_info"); // 'council_info' or 'main_form'

  const [filterDistrict, setFilterDistrict] = useState("");
  const [filterDsDivision, setFilterDsDivision] = useState("");
  const [filterGnDivision, setFilterGnDivision] = useState("");

  const [districts, setDistricts] = useState([]);
  const [dsDivisions, setDsDivisions] = useState([]);
  const [gnDivisions, setGnDivisions] = useState([]);

  // Edit state
  const [editingSubmission, setEditingSubmission] = useState(null);
  
  // Edit history state
  const [viewingHistory, setViewingHistory] = useState(null);

  useEffect(() => {
    const allDistricts = provincialDataJson[0]?.districts || [];
    setDistricts(allDistricts);
  }, []);

  useEffect(() => {
    setDsDivisions([]);
    setGnDivisions([]);
    if (filterDistrict) {
      const selectedDistrictData = districts.find(
        (d) => d.district.trim() === filterDistrict
      );
      if (selectedDistrictData)
        setDsDivisions(selectedDistrictData.ds_divisions);
    }
  }, [filterDistrict, districts]);

  useEffect(() => {
    setGnDivisions([]);
    if (filterDsDivision) {
      const selectedDsData = dsDivisions.find(
        (ds) => ds.ds_division_name.trim() === filterDsDivision
      );
      if (selectedDsData) setGnDivisions(selectedDsData.gn_divisions);
    }
  }, [filterDsDivision, dsDivisions]);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchSubmissionsData = async () => {
      setLoading(true);
      setError(null);
      try {
        const filters = {
          district: filterDistrict,
          divisionalSec: filterDsDivision,
          gnDivision: filterGnDivision,
          formType: activeTab, // <-- Pass the active tab as a filter
        };
        const cleanedFilters = Object.fromEntries(
          Object.entries(filters).filter(([, v]) => v)
        );

        const data = await getSubmissions(cleanedFilters);
        setSubmissions(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissionsData();
  }, [
    isAuthenticated,
    filterDistrict,
    filterDsDivision,
    filterGnDivision,
    activeTab,
  ]);

  const FilterPanel = () => (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg mb-5">
      <h3 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">
        Filter Submissions
      </h3>
      <div className="flex flex-col md:flex-row gap-5">
        {/* District Dropdown */}
        <div className="flex-1">
          <label className="block mb-2 font-medium text-gray-700 text-base">
            District:
          </label>
          <select
            value={filterDistrict}
            onChange={(e) => {
              setFilterDistrict(e.target.value);
              setFilterDsDivision("");
              setFilterGnDivision("");
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">-- All Districts --</option>
            {districts.map((d) => (
              <option key={d.district.trim()} value={d.district.trim()}>
                {d.district.trim()}
              </option>
            ))}
          </select>
        </div>
        {/* DS Division Dropdown */}
        <div className="flex-1">
          <label className="block mb-2 font-medium text-gray-700 text-base">
            DS Division:
          </label>
          <select
            value={filterDsDivision}
            onChange={(e) => {
              setFilterDsDivision(e.target.value);
              setFilterGnDivision("");
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            disabled={!filterDistrict}
          >
            <option value="">-- All DS Divisions --</option>
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
        {/* GN Division Dropdown */}
        <div className="flex-1">
          <label className="block mb-2 font-medium text-gray-700 text-base">
            GN Division:
          </label>
          <select
            value={filterGnDivision}
            onChange={(e) => setFilterGnDivision(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            disabled={!filterDsDivision}
          >
            <option value="">-- All GN Divisions --</option>
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
      </div>

      {/* Export Buttons */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          Export Filtered Data ({submissions.length} records)
        </h4>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={exportToExcel}
            disabled={submissions.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export to Excel
          </button>
        </div>
      </div>
    </div>
  );

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this submission? This action cannot be undone."
      )
    ) {
      try {
        await deleteSubmission(id);
        setSubmissions((currentSubmissions) =>
          currentSubmissions.filter((sub) => sub._id !== id)
        );
        alert("Submission deleted successfully!");
      } catch (err) {
        setError(err.message);
        alert(`Error deleting submission: ${err.message}`);
      }
    }
  };

  const handleEdit = (submission) => {
    setEditingSubmission(submission);
  };

  const handleCancelEdit = () => {
    setEditingSubmission(null);
  };

  const handleSaveEdit = async (updatedData) => {
    try {
      const updated = await updateSubmission(editingSubmission._id, updatedData);
      
      // Update the submission in the local state
      setSubmissions((currentSubmissions) =>
        currentSubmissions.map((sub) =>
          sub._id === editingSubmission._id ? updated.data : sub
        )
      );
      
      setEditingSubmission(null);
      alert("Submission updated successfully!");
    } catch (err) {
      setError(err.message);
      alert(`Error updating submission: ${err.message}`);
    }
  };

  // Export to Excel function
  const exportToExcel = () => {
    if (submissions.length === 0) {
      alert("No data to export!");
      return;
    }

    try {
      const exportData = [];

      if (activeTab === "council_info") {
        // Export Council Info
        submissions.forEach((sub) => {
          const location = sub.location || {};
          const council = sub.communityCouncil || {};
          
          // Committee Members (1-5)
          (council.committeeMembers || []).forEach((member, idx) => {
            exportData.push({
              'Submission ID': sub._id,
              'District': location.district || '',
              'DS Division': location.divisionalSec || '',
              'GN Division': location.gnDivision || '',
              'Section': 'Committee Members',
              'Row #': idx + 1,
              'Name': member.name || '',
              'Position': member.position || '',
              'Phone': member.phone || '',
              'WhatsApp': member.whatsapp || '',
              'NIC': member.nic || '',
              'Gender': member.gender || '',
              'Permanent Address': member.permanentAddress || '',
              'Submitted': new Date(sub.createdAt).toLocaleDateString(),
            });
          });

          // Community Reps (6-20)
          (council.communityReps || []).forEach((member, idx) => {
            exportData.push({
              'Submission ID': sub._id,
              'District': location.district || '',
              'DS Division': location.divisionalSec || '',
              'GN Division': location.gnDivision || '',
              'Section': 'Community Representatives',
              'Row #': idx + 6,
              'Name': member.name || '',
              'Position': member.position || '',
              'Phone': member.phone || '',
              'WhatsApp': member.whatsapp || '',
              'NIC': member.nic || '',
              'Gender': member.gender || '',
              'Permanent Address': member.permanentAddress || '',
              'Submitted': new Date(sub.createdAt).toLocaleDateString(),
            });
          });

          // Strategic Members (21-25)
          (council.strategicMembers || []).forEach((member, idx) => {
            exportData.push({
              'Submission ID': sub._id,
              'District': location.district || '',
              'DS Division': location.divisionalSec || '',
              'GN Division': location.gnDivision || '',
              'Section': 'Strategic Members',
              'Row #': idx + 21,
              'Name': member.name || '',
              'Position': member.position || '',
              'Phone': member.phone || '',
              'WhatsApp': member.whatsapp || '',
              'NIC': member.nic || '',
              'Gender': member.gender || '',
              'Permanent Address': member.permanentAddress || '',
              'Submitted': new Date(sub.createdAt).toLocaleDateString(),
            });
          });
        });
      } else {
        // Export Main Form submissions
        submissions.forEach((sub) => {
          const location = sub.location || {};
          const selection = sub.selection || {};
          
          // If there are proposals, create a row for each
          if (sub.proposals && sub.proposals.length > 0) {
            sub.proposals.forEach((proposal, idx) => {
              exportData.push({
                'Submission ID': sub._id,
                'District': location.district || '',
                'DS Division': location.divisionalSec || '',
                'GN Division': location.gnDivision || '',
                'CDC/VDP ID': location.cdcVdpId || '',
                'Sector': selection.sector || '',
                'Sub Category': selection.subCategory || '',
                'Sub-Sub Category': selection.subSubCategory || '',
                'Sub-Sub-Sub Category': selection.subSubSubCategory || '',
                'Proposal #': idx + 1,
                'Proposal': proposal.proposal || '',
                'Cost': proposal.cost || '',
                'Agency': proposal.agency || '',
                'Submitted': new Date(sub.createdAt).toLocaleDateString(),
              });
            });
          } else {
            // No proposals, just add basic info
            exportData.push({
              'Submission ID': sub._id,
              'District': location.district || '',
              'DS Division': location.divisionalSec || '',
              'GN Division': location.gnDivision || '',
              'CDC/VDP ID': location.cdcVdpId || '',
              'Sector': selection.sector || '',
              'Sub Category': selection.subCategory || '',
              'Sub-Sub Category': selection.subSubCategory || '',
              'Sub-Sub-Sub Category': selection.subSubSubCategory || '',
              'Proposal #': 0,
              'Proposal': '',
              'Cost': '',
              'Agency': '',
              'Submitted': new Date(sub.createdAt).toLocaleDateString(),
            });
          }
        });
      }

      // Create workbook and worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, activeTab === "council_info" ? "Council Info" : "Main Form");

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${activeTab}_export_${timestamp}.xlsx`;

      // Download
      XLSX.writeFile(wb, filename);
      alert(`Excel file exported successfully: ${filename}`);
    } catch (error) {
      console.error('Export error:', error);
      alert(`Error exporting to Excel: ${error.message}`);
    }
  };

  // Helper function to render text with proper Unicode support
  const renderTextWithUnicode = (doc, text, x, y, maxWidth = null) => {
    if (!text) return;
    
    // Check if text contains Sinhala/Tamil characters
    const hasUnicode = /[\u0D80-\u0DFF\u0B80-\u0BFF]/.test(text);
    
    if (hasUnicode) {
      // For Unicode text, create a temporary canvas and render as image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const fontSize = 20; // Increased from 11 for better quality
      ctx.font = `${fontSize}px Arial, sans-serif`;
      const metrics = ctx.measureText(text);
      const textWidth = maxWidth ? Math.min(metrics.width, maxWidth * 4) : metrics.width;
      
      canvas.width = textWidth + 10;
      canvas.height = fontSize + 10;
      
      // Clear and redraw
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px Arial, sans-serif`;
      ctx.fillStyle = '#000000';
      ctx.textBaseline = 'top';
      ctx.fillText(text, 5, 5);
      
      const imgData = canvas.toDataURL('image/png');
      // Scale down the image in PDF for crisp rendering
      const pdfWidth = textWidth * 0.15; // Adjusted scaling
      const pdfHeight = fontSize * 0.15;
      doc.addImage(imgData, 'PNG', x, y - 2, pdfWidth, pdfHeight);
    } else {
      // For ASCII text, use normal PDF text
      doc.text(text, x, y, { maxWidth: maxWidth });
    }
  };

  // Export single submission to PDF using jspdf-autotable with Unicode support
  const exportSubmissionToPDF = async (submission, event) => {
    try {
      // Show loading message
      const button = event?.currentTarget;
      const originalText = button?.innerHTML;
      if (button) {
        button.innerHTML = '<span class="flex items-center gap-1">Generating PDF...</span>';
        button.disabled = true;
      }

      const location = submission.location || {};
      const council = submission.communityCouncil || {};

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.width;
      let yPosition = 15;

      // Add title
      pdf.setFontSize(16);
      pdf.setFont(undefined, 'bold');
      pdf.text('Submission Details', 15, yPosition);
      yPosition += 10;

      // Add submission info with Unicode support
      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      
      const infoData = [
        ['District:', location.district || 'N/A'],
        ['DS Division:', location.divisionalSec || 'N/A'],
        ['GN Division:', location.gnDivision || 'N/A'],
        ['Submitted:', new Date(submission.createdAt).toLocaleDateString()]
      ];
      
      // Render info with Unicode support
      infoData.forEach(([label, value]) => {
        pdf.text(label, 15, yPosition);
        renderTextWithUnicode(pdf, value, 60, yPosition, 130);
        yPosition += 6;
      });
      yPosition += 5;

      // Committee Members (1-5)
      if (council.committeeMembers && council.committeeMembers.length > 0) {
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        pdf.setFillColor(220, 38, 38);
        pdf.rect(15, yPosition, pageWidth - 30, 8, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.text('Committee Members (1-5)', 17, yPosition + 5.5);
        pdf.setTextColor(0, 0, 0);
        yPosition += 10;

        const committeeData = council.committeeMembers.map((member, idx) => [
          String(idx + 1),
          member.name || '',
          member.position || '',
          member.phone || '',
          member.whatsapp || '',
          member.nic || '',
          member.gender || '',
          member.permanentAddress || ''
        ]);

        autoTable(pdf, {
          startY: yPosition,
          head: [['#', 'Name', 'Position', 'Phone', 'WhatsApp', 'NIC', 'Gender', 'Address']],
          body: committeeData,
          theme: 'grid',
          headStyles: {
            fillColor: [243, 244, 246],
            textColor: [0, 0, 0],
            fontStyle: 'bold',
            fontSize: 9
          },
          bodyStyles: {
            fontSize: 8,
            cellPadding: 3,
            minCellHeight: 8
          },
          columnStyles: {
            0: { cellWidth: 10 },
            1: { cellWidth: 28 },
            2: { cellWidth: 28 },
            3: { cellWidth: 24 },
            4: { cellWidth: 24 },
            5: { cellWidth: 40 }
          },
          margin: { left: 15, right: 15 },
          didDrawCell: (data) => {
            // Render Unicode text as images for name and position columns
            if ((data.column.index === 1 || data.column.index === 2) && data.section === 'body') {
              const text = data.cell.text[0];
              if (text && /[\u0D80-\u0DFF\u0B80-\u0BFF]/.test(text)) {
                // Clear the text that was drawn
                pdf.setFillColor(255, 255, 255);
                pdf.rect(data.cell.x + 1, data.cell.y + 1, data.cell.width - 2, data.cell.height - 2, 'F');
                
                // Create canvas for better quality Unicode rendering
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const fontSize = 24; // Larger for better quality
                ctx.font = `${fontSize}px Arial, sans-serif`;
                const metrics = ctx.measureText(text);
                
                canvas.width = metrics.width + 10;
                canvas.height = fontSize + 10;
                
                ctx.font = `${fontSize}px Arial, sans-serif`;
                ctx.fillStyle = '#000000';
                ctx.textBaseline = 'middle';
                ctx.fillText(text, 5, fontSize / 2 + 5);
                
                const imgData = canvas.toDataURL('image/png');
                const imgWidth = (metrics.width + 10) * 0.12;
                const imgHeight = (fontSize + 10) * 0.12;
                const xPos = data.cell.x + 3;
                const yPos = data.cell.y + (data.cell.height - imgHeight) / 2;
                
                pdf.addImage(imgData, 'PNG', xPos, yPos, imgWidth, imgHeight);
              }
            }
          }
        });

        yPosition = pdf.lastAutoTable.finalY + 10;
      }

      // Community Representatives (6-20)
      if (council.communityReps && council.communityReps.length > 0) {
        // Add new page if needed
        if (yPosition > 240) {
          pdf.addPage();
          yPosition = 15;
        }

        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        pdf.setFillColor(220, 38, 38);
        pdf.rect(15, yPosition, pageWidth - 30, 8, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.text('Community Representatives (6-20)', 17, yPosition + 5.5);
        pdf.setTextColor(0, 0, 0);
        yPosition += 10;

        const repsData = council.communityReps.map((member, idx) => [
          String(idx + 6),
          member.name || '',
          member.phone || '',
          member.whatsapp || '',
          member.nic || '',
          member.gender || '',
          member.permanentAddress || ''
        ]);

        autoTable(pdf, {
          startY: yPosition,
          head: [['#', 'Name', 'Phone', 'WhatsApp', 'NIC', 'Gender', 'Address']],
          body: repsData,
          theme: 'grid',
          headStyles: {
            fillColor: [243, 244, 246],
            textColor: [0, 0, 0],
            fontStyle: 'bold',
            fontSize: 9
          },
          bodyStyles: {
            fontSize: 8,
            cellPadding: 3,
            minCellHeight: 8
          },
          columnStyles: {
            0: { cellWidth: 10 },
            1: { cellWidth: 38 },
            2: { cellWidth: 30 },
            3: { cellWidth: 30 },
            4: { cellWidth: 46 }
          },
          margin: { left: 15, right: 15 },
          didDrawCell: (data) => {
            // Render Unicode text as images for name column
            if (data.column.index === 1 && data.section === 'body') {
              const text = data.cell.text[0];
              if (text && /[\u0D80-\u0DFF\u0B80-\u0BFF]/.test(text)) {
                pdf.setFillColor(255, 255, 255);
                pdf.rect(data.cell.x + 1, data.cell.y + 1, data.cell.width - 2, data.cell.height - 2, 'F');
                
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const fontSize = 24;
                ctx.font = `${fontSize}px Arial, sans-serif`;
                const metrics = ctx.measureText(text);
                
                canvas.width = metrics.width + 10;
                canvas.height = fontSize + 10;
                
                ctx.font = `${fontSize}px Arial, sans-serif`;
                ctx.fillStyle = '#000000';
                ctx.textBaseline = 'middle';
                ctx.fillText(text, 5, fontSize / 2 + 5);
                
                const imgData = canvas.toDataURL('image/png');
                const imgWidth = (metrics.width + 10) * 0.12;
                const imgHeight = (fontSize + 10) * 0.12;
                const xPos = data.cell.x + 3;
                const yPos = data.cell.y + (data.cell.height - imgHeight) / 2;
                
                pdf.addImage(imgData, 'PNG', xPos, yPos, imgWidth, imgHeight);
              }
            }
          }
        });

        yPosition = pdf.lastAutoTable.finalY + 10;
      }

      // Strategic Members (21-25)
      if (council.strategicMembers && council.strategicMembers.length > 0) {
        // Add new page if needed
        if (yPosition > 240) {
          pdf.addPage();
          yPosition = 15;
        }

        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        pdf.setFillColor(220, 38, 38);
        pdf.rect(15, yPosition, pageWidth - 30, 8, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.text('Strategic Members (21-25)', 17, yPosition + 5.5);
        pdf.setTextColor(0, 0, 0);
        yPosition += 10;

        const strategicData = council.strategicMembers.map((member, idx) => [
          String(idx + 21),
          member.name || '',
          member.phone || '',
          member.whatsapp || '',
          member.nic || '',
          member.gender || '',
          member.permanentAddress || ''
        ]);

        autoTable(pdf, {
          startY: yPosition,
          head: [['#', 'Name', 'Phone', 'WhatsApp', 'NIC', 'Gender', 'Address']],
          body: strategicData,
          theme: 'grid',
          headStyles: {
            fillColor: [243, 244, 246],
            textColor: [0, 0, 0],
            fontStyle: 'bold',
            fontSize: 9
          },
          bodyStyles: {
            fontSize: 8,
            cellPadding: 3,
            minCellHeight: 8
          },
          columnStyles: {
            0: { cellWidth: 10 },
            1: { cellWidth: 38 },
            2: { cellWidth: 30 },
            3: { cellWidth: 30 },
            4: { cellWidth: 46 }
          },
          margin: { left: 15, right: 15 },
          didDrawCell: (data) => {
            // Render Unicode text as images for name column
            if (data.column.index === 1 && data.section === 'body') {
              const text = data.cell.text[0];
              if (text && /[\u0D80-\u0DFF\u0B80-\u0BFF]/.test(text)) {
                pdf.setFillColor(255, 255, 255);
                pdf.rect(data.cell.x + 1, data.cell.y + 1, data.cell.width - 2, data.cell.height - 2, 'F');
                
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const fontSize = 24;
                ctx.font = `${fontSize}px Arial, sans-serif`;
                const metrics = ctx.measureText(text);
                
                canvas.width = metrics.width + 10;
                canvas.height = fontSize + 10;
                
                ctx.font = `${fontSize}px Arial, sans-serif`;
                ctx.fillStyle = '#000000';
                ctx.textBaseline = 'middle';
                ctx.fillText(text, 5, fontSize / 2 + 5);
                
                const imgData = canvas.toDataURL('image/png');
                const imgWidth = (metrics.width + 10) * 0.12;
                const imgHeight = (fontSize + 10) * 0.12;
                const xPos = data.cell.x + 3;
                const yPos = data.cell.y + (data.cell.height - imgHeight) / 2;
                
                pdf.addImage(imgData, 'PNG', xPos, yPos, imgWidth, imgHeight);
              }
            }
          }
        });
      }

      // Save PDF
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `submission_${submission._id}_${timestamp}.pdf`;
      pdf.save(filename);

      // Restore button
      if (button && originalText) {
        button.innerHTML = originalText;
        button.disabled = false;
      }
      
      alert(`PDF exported successfully: ${filename}`);
    } catch (error) {
      console.error('PDF export error:', error);
      alert(`Error exporting PDF: ${error.message}`);
      
      // Restore button on error
      if (event?.currentTarget) {
        event.currentTarget.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> Export PDF';
        event.currentTarget.disabled = false;
      }
    }
  };

  const renderCommunityCouncil = (councilData) => {
    if (
      !councilData ||
      typeof councilData !== "object" ||
      (!councilData.committeeMembers?.length &&
        !councilData.communityReps?.length &&
        !councilData.strategicMembers?.length)
    ) {
      return (
        <p className="text-gray-500 italic">
          No council information submitted.
        </p>
      );
    }
    const sections = [
      {
        title: "කාරක සභා සාමාජිකයින් (1-5)",
        key: "committeeMembers",
        startRow: 1,
        showPosition: true,
      },
      {
        title: "ප්‍රජා නියෝජිත කණ්ඩායම (6-20)",
        key: "communityReps",
        startRow: 6,
        showPosition: false,
      },
      {
        title: "උපාය මාර්ගික සාමාජික කණ්ඩායම (21-25)",
        key: "strategicMembers",
        startRow: 21,
        showPosition: false,
      },
    ];
    return (
      <div className="mt-4">
        <h4 className="text-lg font-semibold mt-6 pb-2 border-b border-gray-300">
          Community Development Council
        </h4>
        {sections.map((section) => (
          <div key={section.key} className="overflow-x-auto mt-6">
            <h5 className="text-md font-semibold mb-2 text-[#A8234A]">
              {section.title}
            </h5>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left font-bold w-12">#</th>
                  <th className="border border-gray-300 p-2 text-left font-bold">Name</th>
                  {section.showPosition && (
                    <th className="border border-gray-300 p-2 text-left font-bold">Position</th>
                  )}
                  <th className="border border-gray-300 p-2 text-left font-bold">Phone</th>
                  <th className="border border-gray-300 p-2 text-left font-bold">WhatsApp</th>
                  <th className="border border-gray-300 p-2 text-left font-bold">NIC</th>
                  <th className="border border-gray-300 p-2 text-left font-bold">Gender</th>
                  <th className="border border-gray-300 p-2 text-left font-bold">Permanent Address</th>
                </tr>
              </thead>
              <tbody>
                {section.key &&
                  councilData[section.key]?.map((member, index) => {
                    const globalRowNumber = section.startRow + index;
                    return (
                      <tr
                        key={`${section.key}-${globalRowNumber}`}
                        className="even:bg-gray-50"
                      >
                        <td className="border border-gray-300 p-2 font-semibold">{globalRowNumber}</td>
                        <td className="border border-gray-300 p-2">{member.name}</td>
                        {section.showPosition && (
                          <td className="border border-gray-300 p-2">{member.position}</td>
                        )}
                        <td className="border border-gray-300 p-2">{member.phone}</td>
                        <td className="border border-gray-300 p-2">{member.whatsapp}</td>
                        <td className="border border-gray-300 p-2">{member.nic}</td>
                        <td className="border border-gray-300 p-2">{member.gender}</td>
                        <td className="border border-gray-300 p-2">{member.permanentAddress}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    );
  }; // Helper function to retrieve the deep section data
  const getDeepSection = (selection) => {
    const { sector, subCategory, subSubCategory, subSubSubCategory } = selection;
    if (!sector || !subCategory || !sectors[sector]) return null;

    let current = sectors[sector];

    // Check all up to 3 levels deep
    for (const key of [subCategory, subSubCategory, subSubSubCategory]) {
      if (!key) break;

      const nextLevel = current[key];
      if (!nextLevel) return null;

      // If the next level is the final section (has problems/tables), return it
      if (nextLevel.problems || nextLevel.isTable || nextLevel.isFixedRowTable || nextLevel.isHybridTable) {
        return nextLevel;
      }

      // If it's a nested selector, continue down
      current = nextLevel;
    }
    return null;
  };

  // Helper to render dynamic/fixed tables (reused from previous fix)
  const renderDynamicTable = (tableData, tableConfig, title) => {
    if (!tableConfig) return null;

    let rowsToRender = [];
    const columns = tableConfig.tableColumns || [];
    const fixedRows = tableData.fixed ? Object.entries(tableData.fixed) : [];
    const dynamicRows = tableData.dynamic || tableData;

    // Handling Hybrid/Fixed Table Data
    if (fixedRows.length > 0) {
      const fixedRowLabels = [...(tableConfig.mainRows || []), ...(tableConfig.finalRows || [])].reduce((acc, r) => {
        acc[r.id] = r.label;
        return acc;
      }, {});

      rowsToRender.push(
        ...fixedRows.map(([id, rowData]) => {
          const row = {
            [tableConfig.fixedColumnHeader || 'Label']: fixedRowLabels[id] || id,
          };
          // Only add columns that are defined in tableConfig
          columns.forEach(col => {
            row[col.header] = rowData[col.header];
          });
          return row;
        })
      );
    }

    // Handling Dynamic Table Data
    if (Array.isArray(dynamicRows)) {
      dynamicRows.forEach(dynamicRow => {
        // Only include rows that have some data
        const hasData = Object.values(dynamicRow).some(v => v !== "" && v !== undefined && v !== null);
        if (hasData) {
          const row = {};

          // Add the fixed column (description) if it exists
          if (tableConfig.fixedColumnHeader && dynamicRow.description !== undefined) {
            row[tableConfig.fixedColumnHeader] = dynamicRow.description;
          }

          // Only add columns that are defined in tableConfig
          columns.forEach(col => {
            row[col.header] = dynamicRow[col.header];
          });

          rowsToRender.push(row);
        }
      });
    }

    if (rowsToRender.length === 0) return null;

    // Build the final column list for rendering
    const displayColumns = [];
    if (tableConfig.fixedColumnHeader && rowsToRender.some(row => row[tableConfig.fixedColumnHeader] !== undefined)) {
      displayColumns.push({ header: tableConfig.fixedColumnHeader });
    }
    displayColumns.push(...columns);

    // Use a different structure for rendering the dynamic table, ensuring no hydration errors
    return (
      <div className="mt-8 pt-4 border-t border-gray-200">
        <h5 className="text-base font-semibold mb-3 text-gray-700">{title}</h5>
        <div className="overflow-x-auto rounded-lg border border-gray-300">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                {displayColumns.map((col, i) => (
                  <th key={i} className="border border-gray-300 p-2 text-left font-bold">{col.header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rowsToRender.map((row, rowIndex) => (
                <tr key={rowIndex} className="even:bg-gray-50 border-b border-gray-200">
                  {displayColumns.map((col, colIndex) => (
                    <td key={colIndex} className="border border-gray-300 p-2 text-sm">
                      {row[col.header] || '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // MODIFIED: Renders the Main Form Data content with a clean look
  const renderMainFormData = (submission) => {
    const { sector, subCategory } = submission.selection || {};
    const currentSection = getDeepSection(submission.selection || {});

    // Fallback dictionary for simple problems data
    let problemLabels = {};
    if (currentSection && currentSection.problems) {
      problemLabels = currentSection.problems.reduce((acc, p) => {
        acc[p.id] = p.label;
        return acc;
      }, {});
    }

    return (
      <div className="mt-4">
        {/* Sector and Sub-Category Display */}
        <h4 className="text-lg font-semibold text-gray-800 mb-1">
          {sector || "No Sector Selected"}
        </h4>
        <p className="mb-4 text-gray-600 border-b pb-3 text-sm">
          <strong className="font-medium">Sub-Category:</strong>
          {subCategory || "N/A"}
        </p>

        {submission.data && Object.keys(submission.data).length > 0 && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold pb-2 border-b border-gray-300">Data Inputs (දත්ත ඇතුළත් කිරීම්)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-4 text-sm">
              {Object.entries(submission.data).map(([key, value]) => {
                // Skip table keys here, handled separately
                if (key === 'tableData' || key === 'secondaryTableData') {
                  return null;
                }

                const label = problemLabels[key] || key;
                let displayValue = "";

                if (typeof value === 'object' && value !== null) {
                  // Handles 'text_with_number' type
                  displayValue = `(${value.number || '0'}) - ${value.text || 'N/A'}`;
                } else {
                  displayValue = value;
                }

                // Only render non-empty data points (except when the value is explicitly 0)
                if (displayValue === "0" || displayValue.toString().trim() !== "") {
                  return (
                    <div key={key} className="flex flex-col p-3 bg-white rounded-md border border-gray-200">
                      <strong className="text-gray-600 font-medium leading-tight">{label}:</strong>
                      <span className="text-gray-800 font-bold mt-1">{displayValue}</span>
                    </div>
                  );
                }
                return null;
              })}
            </div>

            {/* Render dynamic/hybrid table data */}
            {currentSection && submission.data.tableData && renderDynamicTable(
              submission.data.tableData,
              currentSection,
              (currentSection.isHybridTable ? 'Fixed & Dynamic Table Data' : 'Table Data') + ' (වගු දත්ත)'
            )}

            {/* Render secondary table data */}
            {currentSection?.secondaryTable && submission.data.secondaryTableData && renderDynamicTable(
              submission.data.secondaryTableData,
              currentSection.secondaryTable,
              'Secondary Table Data (අතිරේක වගු දත්ත)'
            )}

          </div>
        )}

        {!submission.data || Object.keys(submission.data).length === 0 ? (
          <p className="text-gray-500 italic">
            No additional data for this submission.
          </p>
        ) : null}

        {renderProposals(submission.proposals)}
      </div>
    );
  };

  const renderProposals = (proposals) => {
    if (
      !proposals ||
      proposals.length === 0 ||
      (proposals.length === 1 && !proposals[0].proposal)
    ) {
      return null;
    }
    return (
      <>
        <h4 className="text-lg font-semibold mt-8 pb-2 border-b border-gray-300">
          Proposals
        </h4>
        <div className="overflow-x-auto rounded-lg border border-gray-300 mt-4">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="border border-gray-300 p-2 text-left font-bold">
                  Proposal
                </th>
                <th className="border border-gray-300 p-2 text-left font-bold w-32">
                  Cost (Rs.)
                </th>
                <th className="border border-gray-300 p-2 text-left font-bold w-40">
                  Agency/Officer
                </th>
              </tr>
            </thead>
            <tbody>
              {proposals.map((prop, index) => (
                <tr key={prop._id || index} className="even:bg-gray-50">
                  <td className="border border-gray-300 p-2">
                    {prop.proposal || '—'}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {prop.cost || '—'}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {prop.agency || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  // EditCouncilForm Component
  const EditCouncilForm = ({ submission, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      location: { ...submission.location },
      communityCouncil: JSON.parse(JSON.stringify(submission.communityCouncil))
    });

    const handleLocationChange = (field, value) => {
      setFormData(prev => ({
        ...prev,
        location: { ...prev.location, [field]: value }
      }));
    };

    const handleMemberChange = (section, index, field, value) => {
      setFormData(prev => {
        const newCouncil = { ...prev.communityCouncil };
        newCouncil[section][index] = { ...newCouncil[section][index], [field]: value };
        return { ...prev, communityCouncil: newCouncil };
      });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave({
        location: formData.location,
        communityCouncil: formData.communityCouncil
      });
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Location Fields */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Location</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
            <input
              type="text"
              value={formData.location.district}
              onChange={(e) => handleLocationChange('district', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">DS Division</label>
            <input
              type="text"
              value={formData.location.divisionalSec}
              onChange={(e) => handleLocationChange('divisionalSec', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GN Division</label>
            <input
              type="text"
              value={formData.location.gnDivision}
              onChange={(e) => handleLocationChange('gnDivision', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Committee Members */}
        {['committeeMembers', 'communityReps', 'strategicMembers'].map((section) => {
          const title = section === 'committeeMembers' ? 'Committee Members' : 
                       section === 'communityReps' ? 'Community Representatives' : 
                       'Strategic Members';
          
          return (
            <div key={section} className="space-y-3">
              <h3 className="font-semibold text-lg">{title}</h3>
              {formData.communityCouncil[section]?.map((member, idx) => (
                <div key={idx} className="border border-gray-200 rounded p-3 space-y-2">
                  <p className="text-sm font-medium text-gray-600">Member {idx + 1}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Name</label>
                      <input
                        type="text"
                        value={member.name || ''}
                        onChange={(e) => handleMemberChange(section, idx, 'name', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Position</label>
                      <input
                        type="text"
                        value={member.position || ''}
                        onChange={(e) => handleMemberChange(section, idx, 'position', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Phone</label>
                      <input
                        type="text"
                        value={member.phone || ''}
                        onChange={(e) => handleMemberChange(section, idx, 'phone', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">WhatsApp</label>
                      <input
                        type="text"
                        value={member.whatsapp || ''}
                        onChange={(e) => handleMemberChange(section, idx, 'whatsapp', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">NIC</label>
                      <input
                        type="text"
                        value={member.nic || ''}
                        onChange={(e) => handleMemberChange(section, idx, 'nic', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="National ID"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Gender</label>
                      <select
                        value={member.gender || ''}
                        onChange={(e) => handleMemberChange(section, idx, 'gender', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male / පුරුෂ</option>
                        <option value="Female">Female / ස්ත්‍රී</option>
                        <option value="Other">Other / වෙනත්</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-600 mb-1">Permanent Address</label>
                      <textarea
                        value={member.permanentAddress || ''}
                        onChange={(e) => handleMemberChange(section, idx, 'permanentAddress', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Permanent Address"
                        rows="2"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-md px-4 py-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[#A8234A] hover:bg-[#8B1C3D] text-white font-medium rounded-md px-4 py-2"
          >
            Save Changes
          </button>
        </div>
      </form>
    );
  };

  if (!isAuthenticated) return <div>Access Denied. Please log in.</div>;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
      <FilterPanel />

      <div className="flex space-x-2 border-b border-gray-300 mb-6">
        <button
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-150 ease-in-out ${activeTab === "council_info"
              ? "bg-white border-x border-t border-gray-300 text-[#A8234A] -mb-px" // Active style
              : "bg-gray-100 text-gray-600 hover:bg-gray-200" // Inactive style
            }`}
          onClick={() => setActiveTab("council_info")}
        >
          Council Info Data (ප්‍රජා සභා තොරතුරු)
        </button>
        {/* <button
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-150 ease-in-out ${activeTab === "main_form"
              ? "bg-white border-x border-t border-gray-300 text-[#A8234A] -mb-px" // Active style
              : "bg-gray-100 text-gray-600 hover:bg-gray-200" // Inactive style
            }`}
          onClick={() => setActiveTab("main_form")}
        >
          Main Form Data (සංවර්ධන සැලැස්ම)
        </button> */}
      </div>

      <h2 className="text-2xl font-bold mb-4">
        Filtered Submissions ({submissions.length})
      </h2>

      {loading && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
          Loading...
        </div>
      )}
      {error && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6 shadow-sm text-red-600">
          Error: {error}
        </div>
      )}

      {!loading && !error && submissions.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6 shadow-sm text-gray-500 italic">
          No submissions found for this category.
        </div>
      )}

      {!loading &&
        !error &&
        submissions.map((submission) => (
          <div
            key={submission._id}
            id={`submission-${submission._id}`}
            className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6 shadow-sm"
          >

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 bg-blue-50 p-4 rounded-md mb-4 text-sm">
              <p>
                <strong className="font-semibold">District:</strong>
                {submission.location.district}
              </p>
              <p>
                <strong className="font-semibold">DS Division:</strong>
                {submission.location.divisionalSec}
              </p>
              <p>
                <strong className="font-semibold">GN Division:</strong>
                {submission.location.gnDivision}
              </p>
              <p>
                <strong className="font-semibold">Submitted:</strong>
                {new Date(submission.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="p-2 text-right flex gap-2 justify-end">
              {activeTab === "council_info" && (
                <button
                  onClick={(e) => exportSubmissionToPDF(submission, e)}
                  className="export-pdf-btn bg-[#F37021] hover:bg-[#D65F1A] text-white font-medium rounded-md px-3 py-1 text-sm transition duration-150 ease-in-out flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export PDF
                </button>
              )}
              {isSuperAdmin && submission.editHistory && submission.editHistory.length > 0 && (
                <button
                  onClick={() => setViewingHistory(submission)}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md px-3 py-1 text-sm transition duration-150 ease-in-out flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  History ({submission.editHistory.length})
                </button>
              )}
              <button
                onClick={() => handleEdit(submission)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md px-3 py-1 text-sm transition duration-150 ease-in-out"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(submission._id)}
                className="bg-red-600 hover:bg-red-700 text-white font-medium rounded-md px-3 py-1 text-sm transition duration-150 ease-in-out"
              >
                Delete
              </button>
            </div>

            {activeTab === "council_info" &&
              renderCommunityCouncil(submission.communityCouncil)}
            {activeTab === "main_form" && renderMainFormData(submission)}
          </div>
        ))}

      {/* Edit Modal */}
      {editingSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-[#A8234A]">
                  Edit Submission
                </h2>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {editingSubmission.formType === 'council_info' ? (
                <EditCouncilForm
                  submission={editingSubmission}
                  onSave={handleSaveEdit}
                  onCancel={handleCancelEdit}
                />
              ) : (
                <div className="text-center p-4">
                  <p className="text-gray-600 mb-4">
                    Editing main form submissions is not yet supported. 
                    Please delete and create a new submission if changes are needed.
                  </p>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-md px-4 py-2"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit History Modal */}
      {viewingHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#A8234A]">
                  Edit History
                </h2>
                <button
                  onClick={() => setViewingHistory(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Submission Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-lg mb-2">Submission Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="font-medium">District:</span> {viewingHistory.location.district}</div>
                  <div><span className="font-medium">DS Division:</span> {viewingHistory.location.divisionalSec}</div>
                  <div><span className="font-medium">GN Division:</span> {viewingHistory.location.gnDivision}</div>
                  <div><span className="font-medium">Form Type:</span> {viewingHistory.formType === 'council_info' ? 'Council' : 'Development'}</div>
                </div>
              </div>

              {/* Edit History Timeline */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg mb-3">Change History ({viewingHistory.editHistory?.length || 0} edits)</h3>
                
                {viewingHistory.editHistory && viewingHistory.editHistory.length > 0 ? (
                  <div className="space-y-3">
                    {[...viewingHistory.editHistory].reverse().map((edit, index) => (
                      <div key={index} className="border-l-4 border-purple-500 pl-4 py-2 bg-gray-50 rounded">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span className="font-medium text-gray-700">
                              Edit #{viewingHistory.editHistory.length - index}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(edit.editedAt).toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">Edited by:</span>{' '}
                          {edit.editedBy?.username || edit.editedBy?.fullName || 'Unknown User'}
                        </div>
                        
                        <div className="mt-2 p-3 bg-white rounded border border-gray-200">
                          <p className="text-sm font-medium text-gray-700 mb-1">Changes:</p>
                          <p className="text-sm text-gray-600 whitespace-pre-wrap">{edit.changes}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No edit history available</p>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setViewingHistory(null)}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-md px-4 py-2"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionList;