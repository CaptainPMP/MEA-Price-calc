import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PriceCalculator.css';

function PriceCalculator() {
  const [items, setItems] = useState([]);
  const [removeItems, setRemoveItems] = useState([]); // New state for remove items
  const [showSelector, setShowSelector] = useState(false);
  const [showRemoveSelector, setShowRemoveSelector] = useState(false); // New state for remove selector
  const [search, setSearch] = useState("");
  const [removeSearch, setRemoveSearch] = useState(""); // New search state for remove items
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    setLoading(true);
    axios.get("https://script.google.com/macros/s/AKfycbzmH8jh4Qi2B-EjEr7sJjtULr8vuFxuy4DLm7OfHXxIKmH4lw0UyUUOS8K68hv0pRVh/exec?path=ติดตั้ง&action=read")
      .then(res => {
        // Filter out rows without a name or price
        const filtered = res.data.data.filter(row =>
          row["อุปกรณ์"] || row["(ของ+แรง)\nราคาที่คิดเงินกับลูกค้า"]
        );
        setApiData(filtered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Use apiData for mockData
  const mockData = Array.isArray(apiData)
    ? apiData.map(row => {
        // Fix price: parse as float, not int, and remove commas, treat "" as 0
        let priceStr = (row["(ของ+แรง)\nราคาที่คิดเงินกับลูกค้า"] || "0").toString().replace(/,/g, "");
        let price = priceStr.trim() === "" ? 0 : parseFloat(priceStr) || 0;
        return {
          name: row["อุปกรณ์"],
          group: row["หมวด"] || "",
          price,
          methodType: row["Method_type"] || ""
        };
      })
    : [];

  // Initialize selectedIndexes with indexes of items already in the list
  const getInitialSelectedIndexes = () => {
    return mockData
      .map((item, idx) => items.some(i => i.name === item.name) ? idx : null)
      .filter(idx => idx !== null);
  };
  const [selectedIndexes, setSelectedIndexes] = useState(getInitialSelectedIndexes);

  // Initialize selectedRemoveIndexes with indexes of remove items already in the list
  const getInitialSelectedRemoveIndexes = () => {
    return mockData
      .map((item, idx) => removeItems.some(i => i.name === item.name) ? idx : null)
      .filter(idx => idx !== null);
  };
  const [selectedRemoveIndexes, setSelectedRemoveIndexes] = useState(getInitialSelectedRemoveIndexes);

  // State for expanded categories in the selector modal
  const [selectorExpandedCategories, setSelectorExpandedCategories] = useState({});
  const [removeSelectorExpandedCategories, setRemoveSelectorExpandedCategories] = useState({});

  // Toggle expand/collapse for a category in selector modal
  const handleSelectorToggleCategory = group => {
    setSelectorExpandedCategories(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  // Toggle expand/collapse for a category in remove selector modal
  const handleRemoveSelectorToggleCategory = group => {
    setRemoveSelectorExpandedCategories(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  // Update selectedIndexes when opening selector to reflect already-added items
  const handleOpenSelector = () => {
    setSelectedIndexes(
      mockData
        .map((item, idx) => items.some(i => i.name === item.name) ? idx : null)
        .filter(idx => idx !== null)
    );
    setShowSelector(true);
  };

  // Update selectedRemoveIndexes when opening remove selector to reflect already-added items
  const handleOpenRemoveSelector = () => {
    setSelectedRemoveIndexes(
      mockData
        .map((item, idx) => removeItems.some(i => i.name === item.name) ? idx : null)
        .filter(idx => idx !== null)
    );
    setShowRemoveSelector(true);
  };

  const handleQuantityChange = (index, delta) => {
    setItems(prev =>
      prev.map((item, i) =>
        i === index
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      )
    );
  };

  const handleRemoveQuantityChange = (index, delta) => {
    setRemoveItems(prev =>
      prev.map((item, i) =>
        i === index
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      )
    );
  };

  const handleAddItems = () => {
    setItems(prev => {
      const existingNames = prev.map(item => item.name);
      const newItems = selectedIndexes
        .filter(idx => !existingNames.includes(mockData[idx].name))
        .map(idx => ({ ...mockData[idx], quantity: 1 }));
      return [
        ...prev.filter(item => selectedIndexes.some(idx => mockData[idx].name === item.name)),
        ...newItems
      ];
    });
    setShowSelector(false);
    setSelectedIndexes([]);
  };

  const handleAddRemoveItems = () => {
    setRemoveItems(prev => {
      const existingNames = prev.map(item => item.name);
      const newItems = selectedRemoveIndexes
        .filter(idx => !existingNames.includes(mockData[idx].name))
        .map(idx => ({ ...mockData[idx], quantity: 1 }));
      return [
        ...prev.filter(item => selectedRemoveIndexes.some(idx => mockData[idx].name === item.name)),
        ...newItems
      ];
    });
    setShowRemoveSelector(false);
    setSelectedRemoveIndexes([]);
  };

  const handleToggleSelect = idx => {
    setSelectedIndexes(prev =>
      prev.includes(idx)
        ? prev.filter(i => i !== idx)
        : [...prev, idx]
    );
  };

  const handleToggleRemoveSelect = idx => {
    setSelectedRemoveIndexes(prev =>
      prev.includes(idx)
        ? prev.filter(i => i !== idx)
        : [...prev, idx]
    );
  };

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalRemovePrice = removeItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const grandTotal = totalPrice + totalRemovePrice;

  // Add Google Fonts Prompt dynamically
  React.useEffect(() => {
    const id = 'google-font-prompt';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Prompt:wght@400;700&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  // Add Material Icons font dynamically
  React.useEffect(() => {
    const id = 'material-icons-font';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
      document.head.appendChild(link);
    }
  }, []);

  // Responsive styles
  const fontFamily = "'Prompt', sans-serif";
  const containerStyle = {
    background: '#FFA769',
    minHeight: '100vh',
    width: '100vw',
    color: 'black',
    fontFamily,
  };
  const cardStyle = {
    padding: '12px',
    borderRadius: '10px',
    maxWidth: '100%',
    margin: '0 auto',
    boxSizing: 'border-box',
    width: '100%',
    '@media (minWidth: 600px)': {
      maxWidth: '600px',
      padding: '20px',
    }
  };
  const modalStyle = {
    background: 'white',
    padding: 12,
    borderRadius: 10,
    minWidth: 0,
    width: '90vw',
    maxWidth: 400,
    color: 'black',
    fontFamily,
    boxSizing: 'border-box'
  };
  const itemListStyle = {
    background: 'white',
    padding: '8px',
    borderRadius: '10px',
    color: 'black',
    fontFamily,
    fontSize: '15px'
  };
  const itemRowStyle = {
    marginBottom: '0',
    padding: '14px 10px',
    color: 'black',
    fontFamily,
    borderRadius: '0',
    background: '#fff',
    borderBottom: '2px solid #e0e0e0'
  };
  const itemFlexStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    fontFamily,
    flexWrap: 'wrap',
    gap: '16px',
    padding: '6px 0'
  };
  const qtyBtnStyle = {
    background: 'white',
    border: '2px solid #FF6D00',
    color: '#FF6D00',
    borderRadius: '5px',
    fontWeight: 'bold',
    fontSize: 18,
    cursor: 'pointer',
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };
  const qtySpanStyle = {
    minWidth: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily,
    fontSize: 16
  };
  const bottomBtnRowStyle = {
    display: 'flex',
    marginTop: '16px',
    gap: '8px',
    fontFamily,
    flexDirection: 'column'
  };
  const priceBtnStyle = {
    flex: 1,
    background: 'white',
    fontWeight: 'bold',
    fontSize: '18px',
    color: 'black',
    fontFamily,
    padding: '10px 0'
  };
  const addBtnStyle = {
    flex: 1,
    background: '#FF6D00',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '18px',
    fontFamily,
    padding: '10px 0'
  };
  const removeBtnStyle = {
    flex: 1,
    background: '#E53935',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '18px',
    fontFamily,
    padding: '10px 0'
  };

  // Media query for desktop
  React.useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @media (min-width: 600px) {
        .responsive-card {
          max-width: 600px !important;
          padding: 20px !important;
        }
        .responsive-modal {
          max-width: 400px !important;
          padding: 20px !important;
        }
        .responsive-btn-row {
          flex-direction: row !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Filtered mockData for search (no sorting while selecting)
  const filteredMockData = mockData.filter(item =>
    (item.name && item.name.toLowerCase().includes(search.toLowerCase())) ||
    (item.group && item.group.toLowerCase().includes(search.toLowerCase()))
  );

  // Filtered mockData for remove search
  const filteredRemoveMockData = mockData.filter(item =>
    (item.name && item.name.toLowerCase().includes(removeSearch.toLowerCase())) ||
    (item.group && item.group.toLowerCase().includes(removeSearch.toLowerCase()))
  );

  // Handler for clearing all items (and checked)
  const handleClearAll = () => {
    setItems([]);
    setRemoveItems([]);
    setSelectedIndexes([]);
    setSelectedRemoveIndexes([]);
  };

  return (
    <div style={containerStyle}>
      <div className="responsive-card" style={cardStyle}>
        {/* Logo left, Title right, white background */}
        <div
          className="logo-container"
          style={{
            background: 'white',
            borderRadius: '10px',
            padding: '20px 0 16px 0',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
            gap: 18
          }}
        >
          <img
            src="/MEALogo.png"
            style={{
              height: '56px',
              width: '56px',
              marginRight: 0,
              display: 'block',
              objectFit: 'contain'
            }}
            alt="MEA Logo"
          />
          <h2
            style={{
              textAlign: 'left',
              color: 'black',
              fontFamily,
              fontSize: 22,
              margin: 0
            }}
          >
            คำนวณราคาโดยคร่าว ๆ
          </h2>
        </div>

        {/* Install Item Selection Modal */}
        {showSelector && (
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10
          }}>
            <div className="responsive-modal" style={modalStyle}>
              <h3 style={{ marginTop: 0, fontFamily, fontSize: 18 }}>เลือกอุปกรณ์ (ติดตั้ง)</h3>
              <input
                type="text"
                placeholder="ค้นหาอุปกรณ์ หรือหมวด..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: 'calc(100% - 2px)',
                  marginBottom: 12,
                  padding: 8,
                  fontSize: 15,
                  borderRadius: 6,
                  border: '1px solid #ccc',
                  fontFamily,
                  boxSizing: 'border-box',
                  display: 'block'
                }}
              />
              <div style={{ maxHeight: 300, overflowY: 'auto', fontFamily }}>
                {loading ? (
                  <div style={{ color: '#888', textAlign: 'center', padding: 12 }}>กำลังโหลด...</div>
                ) : (() => {
                  // Filter for install type - check for various possible values
                  const installOnlyGrouped = filteredMockData
                    .filter(item => 
                      !item.methodType || 
                      item.methodType === "install" || 
                      item.methodType === "Install" ||
                      item.methodType === "ติดตั้ง" ||
                      item.methodType.toLowerCase().includes("install") ||
                      item.methodType.toLowerCase().includes("ติดตั้ง")
                    )
                    .reduce((acc, item) => {
                      const group = item.group || "ไม่ระบุหมวด";
                      if (!acc[group]) acc[group] = [];
                      acc[group].push(item);
                      return acc;
                    }, {});
                  
                  // Debug: show available method types if no items found
                  if (Object.keys(installOnlyGrouped).length === 0) {
                    const uniqueMethodTypes = [...new Set(mockData.map(item => item.methodType).filter(Boolean))];
                    return (
                      <div style={{ color: '#888', textAlign: 'center', padding: 12 }}>
                        <div>ไม่พบรายการติดตั้ง</div>
                        {uniqueMethodTypes.length > 0 && (
                          <div style={{ fontSize: 12, marginTop: 8 }}>
                            Method types พบ: {uniqueMethodTypes.join(", ")}
                          </div>
                        )}
                      </div>
                    );
                  }
                  return (
                    Object.entries(installOnlyGrouped).map(([group, items]) => (
                      <div key={group}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            padding: '4px 0',
                            userSelect: 'none'
                          }}
                          onClick={() => handleSelectorToggleCategory(group)}
                        >
                          <span
                            className="material-icons"
                            style={{
                              fontSize: 18,
                              color: '#FF6D00',
                              marginRight: 6,
                              transition: 'transform 0.15s'
                            }}
                          >
                            {selectorExpandedCategories[group] ? 'expand_more' : 'chevron_right'}
                          </span>
                          <span style={{
                            fontWeight: 600,
                            fontSize: 16,
                            color: '#FF6D00',
                            background: '#FFF5E6',
                            padding: '4px 8px',
                            borderRadius: 4
                          }}>
                            {group}
                          </span>
                        </div>
                        {selectorExpandedCategories[group] && items.map(item => {
                          const realIdx = mockData.findIndex(m => m.name === item.name && m.price === item.price && m.group === item.group);
                          return (
                            <div key={realIdx} style={{ marginBottom: 8, fontFamily }}>
                              <label style={{ fontFamily, fontSize: 15 }}>
                                <input
                                  type="checkbox"
                                  checked={selectedIndexes.includes(realIdx)}
                                  onChange={() => handleToggleSelect(realIdx)}
                                  style={{ marginRight: 8 }}
                                />
                                {item.name}
                                <span style={{ color: '#888', marginLeft: 8 }}>
                                  {item.price ? `(${item.price.toLocaleString()} ฿)` : ""}
                                </span>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    ))
                  );
                })()}
              </div>
              <div style={{ marginTop: 16, display: 'flex', gap: 8, fontFamily }}>
                <button onClick={handleAddItems} disabled={selectedIndexes.length === 0} style={{ fontFamily, flex: 1, padding: 8 }}>เพิ่ม</button>
                <button onClick={() => { setShowSelector(false); setSelectedIndexes([]); setSearch(""); }} style={{ fontFamily, flex: 1, padding: 8 }}>ยกเลิก</button>
              </div>
            </div>
          </div>
        )}

        {/* Remove Item Selection Modal */}
        {showRemoveSelector && (
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10
          }}>
            <div className="responsive-modal" style={modalStyle}>
              <h3 style={{ marginTop: 0, fontFamily, fontSize: 18 }}>เลือกอุปกรณ์ (รื้อถอน)</h3>
              <input
                type="text"
                placeholder="ค้นหาอุปกรณ์ หรือหมวด..."
                value={removeSearch}
                onChange={e => setRemoveSearch(e.target.value)}
                style={{
                  width: 'calc(100% - 2px)',
                  marginBottom: 12,
                  padding: 8,
                  fontSize: 15,
                  borderRadius: 6,
                  border: '1px solid #ccc',
                  fontFamily,
                  boxSizing: 'border-box',
                  display: 'block'
                }}
              />
              <div style={{ maxHeight: 300, overflowY: 'auto', fontFamily }}>
                {loading ? (
                  <div style={{ color: '#888', textAlign: 'center', padding: 12 }}>กำลังโหลด...</div>
                ) : (() => {
                  // Filter for remove type - check for various possible values
                  const removeOnlyGrouped = filteredRemoveMockData
                    .filter(item => 
                      item.methodType && 
                      item.methodType !== "install" && 
                      item.methodType !== "Install" &&
                      item.methodType !== "ติดตั้ง" &&
                      !item.methodType.toLowerCase().includes("install") &&
                      !item.methodType.toLowerCase().includes("ติดตั้ง")
                    )
                    .reduce((acc, item) => {
                      const group = item.group || "ไม่ระบุหมวด";
                      if (!acc[group]) acc[group] = [];
                      acc[group].push(item);
                      return acc;
                    }, {});
                  
                  // Debug: show available method types if no items found
                  if (Object.keys(removeOnlyGrouped).length === 0) {
                    const uniqueMethodTypes = [...new Set(mockData.map(item => item.methodType).filter(Boolean))];
                    return (
                      <div style={{ color: '#888', textAlign: 'center', padding: 12 }}>
                        <div>ไม่พบรายการรื้อถอน</div>
                        {uniqueMethodTypes.length > 0 && (
                          <div style={{ fontSize: 12, marginTop: 8 }}>
                            Method types พบ: {uniqueMethodTypes.join(", ")}
                          </div>
                        )}
                      </div>
                    );
                  }
                  return (
                    Object.entries(removeOnlyGrouped).map(([group, items]) => (
                      <div key={group}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            padding: '4px 0',
                            userSelect: 'none'
                          }}
                          onClick={() => handleRemoveSelectorToggleCategory(group)}
                        >
                          <span
                            className="material-icons"
                            style={{
                              fontSize: 18,
                              color: '#E53935',
                              marginRight: 6,
                              transition: 'transform 0.15s'
                            }}
                          >
                            {removeSelectorExpandedCategories[group] ? 'expand_more' : 'chevron_right'}
                          </span>
                          <span style={{
                            fontWeight: 600,
                            fontSize: 16,
                            color: '#E53935',
                            background: '#FFEBEE',
                            padding: '4px 8px',
                            borderRadius: 4
                          }}>
                            {group}
                          </span>
                        </div>
                        {removeSelectorExpandedCategories[group] && items.map(item => {
                          const realIdx = mockData.findIndex(m => m.name === item.name && m.price === item.price && m.group === item.group);
                          return (
                            <div key={realIdx} style={{ marginBottom: 8, fontFamily }}>
                              <label style={{ fontFamily, fontSize: 15 }}>
                                <input
                                  type="checkbox"
                                  checked={selectedRemoveIndexes.includes(realIdx)}
                                  onChange={() => handleToggleRemoveSelect(realIdx)}
                                  style={{ marginRight: 8 }}
                                />
                                {item.name}
                                <span style={{ color: '#888', marginLeft: 8 }}>
                                  {item.price ? `(${item.price.toLocaleString()} ฿)` : ""}
                                </span>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    ))
                  );
                })()}
              </div>
              <div style={{ marginTop: 16, display: 'flex', gap: 8, fontFamily }}>
                <button onClick={handleAddRemoveItems} disabled={selectedRemoveIndexes.length === 0} style={{ fontFamily, flex: 1, padding: 8 }}>เพิ่ม</button>
                <button onClick={() => { setShowRemoveSelector(false); setSelectedRemoveIndexes([]); setRemoveSearch(""); }} style={{ fontFamily, flex: 1, padding: 8 }}>ยกเลิก</button>
              </div>
            </div>
          </div>
        )}

        {/* Install Items Section */}
        <div>
          <div style={{ marginBottom: 8, fontFamily, fontSize: 16, fontWeight: 'bold', color: '#FF6D00' }}>
            รายการติดตั้ง
          </div>
          
          {/* Install Items List */}
          {items.length > 0 && (
            <div style={itemListStyle}>
              {items.map((item, index) => (
                <div
                  key={index}
                  style={{
                    ...itemRowStyle,
                    borderBottom: index === items.length - 1 ? 'none' : '2px solid #e0e0e0'
                  }}
                >
                  <div style={{ fontFamily }}>{item.name}</div>
                  <div style={itemFlexStyle}>
                    <strong style={{ color: 'black', fontFamily, fontSize: 16 }}>{item.price.toLocaleString()} ฿</strong>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily }}>
                      <button
                        onClick={() => handleQuantityChange(index, -1)}
                        style={qtyBtnStyle}
                      >-</button>
                      <span style={qtySpanStyle}>{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(index, 1)}
                        style={qtyBtnStyle}
                      >+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Install Section Controls */}
          <div className="responsive-btn-row" style={bottomBtnRowStyle}>
            <button style={priceBtnStyle}>
              ราคาติดตั้ง: {totalPrice.toLocaleString()} ฿
            </button>
            <button
              style={addBtnStyle}
              onClick={handleOpenSelector}
            >
              ➕ เพิ่มอุปกรณ์ติดตั้ง
            </button>
          </div>
        </div>

        {/* Remove Items Section */}
        <div style={{ marginTop: 24 }}>
          <div style={{ marginBottom: 8, fontFamily, fontSize: 16, fontWeight: 'bold', color: '#E53935' }}>
            รายการรื้อถอน
          </div>
          
          {/* Remove Items List */}
          {removeItems.length > 0 && (
            <div style={itemListStyle}>
              {removeItems.map((item, index) => (
                <div
                  key={index}
                  style={{
                    ...itemRowStyle,
                    borderBottom: index === removeItems.length - 1 ? 'none' : '2px solid #e0e0e0'
                  }}
                >
                  <div style={{ fontFamily }}>{item.name}</div>
                  <div style={itemFlexStyle}>
                    <strong style={{ color: 'black', fontFamily, fontSize: 16 }}>{item.price.toLocaleString()} ฿</strong>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily }}>
                      <button
                        onClick={() => handleRemoveQuantityChange(index, -1)}
                        style={{...qtyBtnStyle, borderColor: '#E53935', color: '#E53935'}}
                      >-</button>
                      <span style={qtySpanStyle}>{item.quantity}</span>
                      <button
                        onClick={() => handleRemoveQuantityChange(index, 1)}
                        style={{...qtyBtnStyle, borderColor: '#E53935', color: '#E53935'}}
                      >+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Remove Section Controls */}
          <div className="responsive-btn-row" style={bottomBtnRowStyle}>
            <button style={{...priceBtnStyle, color: '#E53935'}}>
              ราคารื้อถอน: {totalRemovePrice.toLocaleString()} ฿
            </button>
            <button
              style={removeBtnStyle}
              onClick={handleOpenRemoveSelector}
            >
              ➖ เพิ่มอุปกรณ์รื้อถอน
            </button>
          </div>
        </div>

        {/* Summary Section */}
        <div style={{ marginTop: 24 }}>
          <div style={{
            background: 'white',
            padding: '16px',
            borderRadius: '10px',
            marginBottom: '16px',
            fontFamily,
            color: 'black'
          }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', textAlign: 'center' }}>
              สรุปค่าใช้จ่าย
            </div>
            <div style={{ fontSize: '16px', marginBottom: '8px' }}>
              ค่าติดตั้ง: {totalPrice.toLocaleString()} ฿
            </div>
            <div style={{ fontSize: '16px', marginBottom: '8px' }}>
              ค่ารื้อถอน: {totalRemovePrice.toLocaleString()} ฿
            </div>
            <div style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              borderTop: '2px solid #e0e0e0', 
              paddingTop: '12px',
              marginTop: '12px',
              textAlign: 'center'
            }}>
              รวม: {grandTotal.toLocaleString()} ฿
            </div>
          </div>
          
          {/* Clear All button */}
          <button
            onClick={handleClearAll}
            style={{
              background: 'white',
              border: '2px solid #E53935',
              borderRadius: 8,
              padding: '12px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              margin: '0 auto',
              cursor: 'pointer',
              fontFamily,
              fontSize: 16,
              fontWeight: 'bold',
              color: '#E53935'
            }}
            title="ล้างรายการทั้งหมด"
          >
            <span
              className="material-icons"
              style={{
                color: '#E53935',
                fontSize: 20
              }}
            >
              delete
            </span>
            ล้างรายการทั้งหมด
          </button>
        </div>
      </div>

      
      {/* Floating Edit Data Button */}
      <a
        href="https://docs.google.com/spreadsheets/d/1eb85f8WfMrkCPW1jX5h7ijCRZiVXtOWgBJh7gmXKQD4/edit?usp=sharing"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          right: 24,
          bottom: 24,
          zIndex: 100,
          background: 'white',
          color: '#FF6D00',
          borderRadius: 32,
          boxShadow: '0 2px 8px rgba(0,0,0,0.13)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 18px 10px 14px',
          fontFamily,
          fontWeight: 600,
          fontSize: 17,
          textDecoration: 'none',
          border: '2px solid #FF6D00',
          transition: 'background 0.15s'
        }}
      >
        <span className="material-icons" style={{ fontSize: 24, color: '#FF6D00' }}>edit_note</span>
        แก้ไขข้อมูล
      </a>
    </div>
  );
}

export default PriceCalculator;