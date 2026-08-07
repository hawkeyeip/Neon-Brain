import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { Upload, ArrowRight, Check, AlertCircle, X, CheckSquare, Square } from 'lucide-react';

const EXPECTED_FIELDS = [
  { key: 'id', label: 'ID (Unique Identifier)' },
  { key: 'name', label: 'Resource Name' },
  { key: 'type', label: 'Type (e.g., account, software)' },
  { key: 'url', label: 'URL' },
  { key: 'username', label: 'Username' },
  { key: 'description', label: 'Description' }
];

export default function ImportWizard({ onComplete }) {
  const [step, setStep] = useState(1);
  const [parsedData, setParsedData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [mapping, setMapping] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [mergeStrategy, setMergeStrategy] = useState('update');
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.name.endsWith('.csv')) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setColumns(results.meta.fields);
          setParsedData(results.data);
          setSelectedRows(results.data.map((_, i) => i)); // Select all by default
          
          // Auto-map columns if names match
          const initialMapping = {};
          results.meta.fields.forEach(col => {
            const match = EXPECTED_FIELDS.find(f => f.key.toLowerCase() === col.toLowerCase());
            if (match) initialMapping[match.key] = col;
          });
          setMapping(initialMapping);
          setStep(2);
        }
      });
    } else if (file.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = JSON.parse(evt.target.result);
          if (Array.isArray(data)) {
            const firstItem = data[0] || {};
            const cols = Object.keys(firstItem);
            setColumns(cols);
            setParsedData(data);
            setSelectedRows(data.map((_, i) => i));
            
            const initialMapping = {};
            cols.forEach(col => {
              const match = EXPECTED_FIELDS.find(f => f.key.toLowerCase() === col.toLowerCase());
              if (match) initialMapping[match.key] = col;
            });
            setMapping(initialMapping);
            setStep(2);
          }
        } catch (e) {
          alert('Invalid JSON file format.');
        }
      };
      reader.readAsText(file);
    } else {
      alert('Unsupported file type. Please upload CSV or JSON.');
    }
  };

  const handleMappingChange = (expectedKey, csvColumn) => {
    setMapping(prev => ({ ...prev, [expectedKey]: csvColumn }));
  };

  const toggleRowSelection = (index) => {
    setSelectedRows(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const toggleAllRows = () => {
    if (selectedRows.length === parsedData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(parsedData.map((_, i) => i));
    }
  };

  const executeImport = () => {
    // 1. Filter selected rows
    const dataToImport = selectedRows.map(index => parsedData[index]);

    // 2. Map data based on user configuration
    const mappedData = dataToImport.map(row => {
      const newRecord = {};
      EXPECTED_FIELDS.forEach(field => {
        const sourceCol = mapping[field.key];
        if (sourceCol && row[sourceCol] !== undefined) {
          newRecord[field.key] = row[sourceCol];
        }
      });
      // Generate ID if missing
      if (!newRecord.id) {
        newRecord.id = 'import_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
      }
      return newRecord;
    });

    onComplete(mappedData, mergeStrategy);
    // Reset state
    setStep(1);
    setParsedData([]);
    setColumns([]);
    setMapping({});
    setSelectedRows([]);
  };

  return (
    <div className="import-wizard" style={{
      background: 'var(--surface-color, #1e1e1e)',
      border: '1px solid var(--border-color, #333)',
      borderRadius: '8px',
      padding: '1.5rem',
      marginTop: '1rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>Advanced Import Wizard</h3>
        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <span style={{ color: step === 1 ? 'var(--accent-blue)' : '' }}>1. Upload</span>
          <ArrowRight size={14} />
          <span style={{ color: step === 2 ? 'var(--accent-blue)' : '' }}>2. Map Fields</span>
          <ArrowRight size={14} />
          <span style={{ color: step === 3 ? 'var(--accent-blue)' : '' }}>3. Preview & Merge</span>
        </div>
      </div>

      {step === 1 && (
        <div style={{ textAlign: 'center', padding: '2rem 1rem', border: '2px dashed var(--border-color, #444)', borderRadius: '8px' }}>
          <Upload size={32} style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }} />
          <p style={{ marginBottom: '1rem' }}>Upload a CSV or JSON file to import resources.</p>
          <button className="btn btn-primary" onClick={() => fileInputRef.current?.click()}>
            Select File
          </button>
          <input 
            type="file" 
            accept=".csv,.json" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            style={{ display: 'none' }} 
          />
        </div>
      )}

      {step === 2 && (
        <div>
          <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            Map the columns from your uploaded file to the expected fields in the tracker.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {EXPECTED_FIELDS.map(field => (
              <div key={field.key} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ flex: 1, fontWeight: '500' }}>{field.label}</div>
                <ArrowRight size={16} style={{ color: 'var(--text-secondary)' }} />
                <div style={{ flex: 1 }}>
                  <select 
                    value={mapping[field.key] || ''} 
                    onChange={(e) => handleMappingChange(field.key, e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '0.5rem', 
                      background: 'var(--background-color)', 
                      border: '1px solid var(--border-color)', 
                      borderRadius: '4px',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <option value="">-- Ignore Field --</option>
                    {columns.map(col => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn btn-secondary" onClick={() => setStep(1)}>Back</button>
            <button className="btn btn-primary" onClick={() => setStep(3)}>Next: Preview</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Merge Strategy</label>
            <select 
              value={mergeStrategy} 
              onChange={(e) => setMergeStrategy(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.5rem', 
                background: 'var(--background-color)', 
                border: '1px solid var(--border-color)', 
                borderRadius: '4px',
                color: 'var(--text-primary)'
              }}
            >
              <option value="update">Update Existing (Merge matching IDs, append new)</option>
              <option value="append">Append Only (Add all as new records)</option>
            </select>
          </div>

          <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '500' }}>Select rows to import ({selectedRows.length} selected)</span>
            <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }} onClick={toggleAllRows}>
              {selectedRows.length === parsedData.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          <div style={{ 
            maxHeight: '300px', 
            overflowY: 'auto', 
            border: '1px solid var(--border-color)', 
            borderRadius: '4px',
            marginBottom: '1.5rem'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead style={{ position: 'sticky', top: 0, background: 'var(--surface-color)', zIndex: 1, borderBottom: '1px solid var(--border-color)' }}>
                <tr>
                  <th style={{ padding: '0.5rem', textAlign: 'left', width: '40px' }}></th>
                  {Object.keys(mapping).filter(k => mapping[k]).map(k => (
                    <th key={k} style={{ padding: '0.5rem', textAlign: 'left' }}>{EXPECTED_FIELDS.find(f => f.key === k)?.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {parsedData.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border-color)', background: selectedRows.includes(i) ? 'rgba(139, 92, 246, 0.1)' : '' }}>
                    <td style={{ padding: '0.5rem', cursor: 'pointer' }} onClick={() => toggleRowSelection(i)}>
                      {selectedRows.includes(i) ? <CheckSquare size={16} color="var(--accent-purple)" /> : <Square size={16} color="var(--text-secondary)" />}
                    </td>
                    {Object.keys(mapping).filter(k => mapping[k]).map(k => (
                      <td key={k} style={{ padding: '0.5rem' }}>{row[mapping[k]]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn btn-secondary" onClick={() => setStep(2)}>Back</button>
            <button className="btn btn-primary" onClick={executeImport}>
              <Check size={16} style={{ marginRight: '0.5rem' }} />
              Import {selectedRows.length} Records
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
