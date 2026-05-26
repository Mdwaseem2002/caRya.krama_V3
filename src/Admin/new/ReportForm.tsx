import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, XCircle, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { CarReportData, saveReport } from '../data/reports';
import { Car } from '../data/cars';

interface ReportFormProps {
  car: Car;
  existingReport?: CarReportData;
  onSave: () => void;
}

export default function ReportForm({ car, existingReport, onSave }: ReportFormProps) {
  const [formData, setFormData] = useState<CarReportData>(existingReport || {
    carId: car.id,
    overallScore: 9.0,
    price: 600,
    isApproved: false,
    sections: [
      { label: 'Engine', score: 9.0 },
      { label: 'Exterior', score: 9.0 },
      { label: 'Interior', score: 9.0 },
      { label: 'Electrical', score: 9.0 },
    ],
    detailed: [
      {
        icon: 'Settings',
        title: 'Engine',
        items: [{ label: 'Engine condition', value: 'Perfect', status: 'ok' }]
      },
      {
        icon: 'Layout',
        title: 'Exterior',
        items: [{ label: 'Paint', value: 'Original', status: 'ok' }]
      }
    ],
    remarks: [{ type: 'info', text: 'Clean vehicle' }]
  });

  // Update form if car changes
  useEffect(() => {
    if (!existingReport) {
      setFormData({
        ...formData,
        carId: car.id,
        isApproved: false
      });
    } else {
      setFormData(existingReport);
    }
  }, [car.id, existingReport]);

  const handleSectionScoreChange = (index: number, score: number) => {
    const newSections = [...formData.sections];
    newSections[index].score = score;
    setFormData({ ...formData, sections: newSections });
  };

  const handleDetailedItemChange = (sIdx: number, iIdx: number, field: string, value: string) => {
    const newDetailed = [...formData.detailed];
    (newDetailed[sIdx].items[iIdx] as any)[field] = value;
    setFormData({ ...formData, detailed: newDetailed });
  };

  const handleSave = () => {
    saveReport(formData);
    onSave();
    alert('Report saved successfully!');
  };

  return (
    <div className="bg-transparent p-8 md:p-12 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h3 className="text-2xl font-black text-white tracking-tight">Inspection Protocol: {car.name}</h3>
          <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Asset ID: {car.id}</p>
        </div>
        <button 
          onClick={handleSave}
          className="group flex items-center gap-3 bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-[12px] uppercase tracking-widest hover:bg-blue-500 hover:shadow-2xl hover:shadow-blue-600/30 transition-all active:scale-95"
        >
          <Save size={18} className="group-hover:scale-125 transition-transform" /> Commit Protocol
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] px-2 flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Executive Rating
          </label>
          <input 
            type="number" 
            step="0.1" 
            min="0" 
            max="10"
            value={formData.overallScore}
            onChange={(e) => setFormData({...formData, overallScore: parseFloat(e.target.value)})}
            className="w-full p-6 bg-white/[0.02] border border-white/5 rounded-[1.5rem] focus:bg-white/[0.04] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-black text-white tracking-tight"
          />
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] px-2 flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Access Value (₹)
          </label>
          <input 
            type="number" 
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
            className="w-full p-6 bg-white/[0.02] border border-white/5 rounded-[1.5rem] focus:bg-white/[0.04] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-black text-white tracking-tight"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {formData.sections.map((section, idx) => (
          <div key={idx} className="space-y-3">
            <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] px-2">{section.label}</label>
            <input 
              type="number" 
              step="0.1"
              min="0"
              max="10"
              value={section.score}
              onChange={(e) => handleSectionScoreChange(idx, parseFloat(e.target.value))}
              className="w-full p-4 bg-white/[0.02] border border-white/5 rounded-2xl focus:border-blue-500 focus:bg-white/[0.04] outline-none transition-all font-black text-white text-center"
            />
          </div>
        ))}
      </div>

      <div className="space-y-8">
        <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] border-b border-white/5 pb-4">Detailed Technical Scan</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {formData.detailed.map((section, sIdx) => (
            <div key={sIdx} className="p-6 bg-white/[0.01] border border-white/5 rounded-[2rem] space-y-6">
              <h5 className="font-black text-blue-400 text-sm uppercase tracking-widest">{section.title} Parameters</h5>
              {section.items.map((item, iIdx) => (
                <div key={iIdx} className="flex gap-3">
                  <input 
                    placeholder="Parameter"
                    value={item.label}
                    onChange={(e) => handleDetailedItemChange(sIdx, iIdx, 'label', e.target.value)}
                    className="flex-grow p-4 bg-white/[0.02] border border-white/5 rounded-xl text-[11px] font-black text-white/80 outline-none focus:border-blue-400 transition-all"
                  />
                  <input 
                    placeholder="Status"
                    value={item.value}
                    onChange={(e) => handleDetailedItemChange(sIdx, iIdx, 'value', e.target.value)}
                    className="w-24 p-4 bg-white/[0.02] border border-white/5 rounded-xl text-[11px] font-black text-white/80 outline-none focus:border-blue-400 transition-all text-center"
                  />
                  <select 
                    value={item.status}
                    onChange={(e) => handleDetailedItemChange(sIdx, iIdx, 'status', e.target.value)}
                    className="p-4 bg-white/[0.05] border border-white/5 rounded-xl text-[11px] font-black text-blue-400 outline-none cursor-pointer"
                  >
                    <option value="ok" className="bg-[#050510]">OK</option>
                    <option value="issue" className="bg-[#050510]">Issue</option>
                  </select>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex items-center justify-between group">
          <div className="flex items-center gap-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 bg-gradient-to-br ${formData.isApproved ? 'from-green-500 to-green-700 shadow-xl shadow-green-500/20' : 'from-white/5 to-white/10'}`}>
              {formData.isApproved ? <CheckCircle className="text-white" size={24} /> : <XCircle className="text-white/20" size={24} />}
            </div>
            <div>
              <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Operational Status</span>
              <h5 className="text-lg font-black text-white tracking-tight mt-0.5">{formData.isApproved ? 'Approved for Deployment' : 'Restricted (Internal Only)'}</h5>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={formData.isApproved}
              onChange={(e) => setFormData({...formData, isApproved: e.target.checked})}
              className="sr-only peer"
            />
            <div className="w-14 h-8 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white/40 after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600 peer-checked:after:bg-white peer-checked:after:opacity-100"></div>
          </label>
        </div>

        <div className="w-full md:w-auto p-8 border border-blue-500/10 bg-blue-500/5 rounded-[2.5rem]">
          <p className="text-[10px] font-black text-blue-400/60 uppercase tracking-widest flex items-center gap-3">
            <AlertCircle size={16} /> 
            Deployment Visibility: {formData.isApproved ? 'Public Node' : 'Private Node'}
          </p>
        </div>
      </div>
    </div>
  );
}
