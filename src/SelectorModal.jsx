import React from 'react';

function SelectorModal({
  loading,
  search,
  setSearch,
  mockData,
  selectedIndexes,
  setSelectedIndexes,
  selectorExpandedCategories,
  setSelectorExpandedCategories,
  handleAddItems,
  setShowSelector
}) {
  const handleToggleSelect = (idx) => {
    setSelectedIndexes((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleToggleCategory = (group) => {
    setSelectorExpandedCategories((prev) => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  const grouped = mockData
    .filter((item) => item.methodType === 'install')
    .reduce((acc, item) => {
      const group = item.group || 'ไม่ระบุหมวด';
      if (!acc[group]) acc[group] = [];
      acc[group].push(item);
      return acc;
    }, {});

  const fontFamily = "'Prompt', sans-serif";

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10
    }}>
      <div className="responsive-modal" style={{
        background: 'white',
        padding: 12,
        borderRadius: 10,
        width: '90vw',
        maxWidth: 400,
        color: 'black',
        fontFamily
      }}>
        <h3 style={{ fontFamily, fontSize: 18, marginTop: 0 }}>เลือกเสา</h3>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ค้นหา..."
          style={{ width: '100%', padding: 8, fontSize: 15, fontFamily, marginBottom: 12 }}
        />

        <div style={{ maxHeight: 300, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ color: '#999', textAlign: 'center' }}>กำลังโหลด...</div>
          ) : (
            Object.keys(grouped).map((group) => (
              <div key={group}>
                <div
                  onClick={() => handleToggleCategory(group)}
                  style={{ cursor: 'pointer', padding: '4px 0', display: 'flex', alignItems: 'center' }}
                >
                  <span className="material-icons" style={{ fontSize: 18, color: '#FF6D00', marginRight: 6 }}>
                    {selectorExpandedCategories[group] ? 'expand_more' : 'chevron_right'}
                  </span>
                  <span style={{ fontWeight: 600, fontSize: 16, color: '#FF6D00' }}>{group}</span>
                </div>
                {selectorExpandedCategories[group] && grouped[group].map((item, i) => {
                    const idx = mockData.findIndex(m => m.name === item.name && m.price === item.price && m.group === item.group);
                    return (
                        <div key={`${group}-${i}`} style={{ fontFamily, fontSize: 15, paddingLeft: 18 }}>
                        <label>
                            <input
                            type="checkbox"
                            checked={selectedIndexes.includes(idx)}
                            onChange={() => handleToggleSelect(idx)}
                            style={{ marginRight: 8 }}
                            />
                            {item.name}
                            <span style={{ color: '#888', marginLeft: 6 }}>
                            {item.price ? `(${item.price.toLocaleString()} ฿)` : ''}
                            </span>
                        </label>
                        </div>
                    );
                })}

              </div>
            ))
          )}
        </div>

        <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
          <button onClick={handleAddItems} disabled={selectedIndexes.length === 0} style={{ flex: 1, padding: 10, fontFamily }}>
            เพิ่ม
          </button>
          <button onClick={() => setShowSelector(false)} style={{ flex: 1, padding: 10, fontFamily }}>
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
}

export default SelectorModal;