function ClearButton({ onClear }) {
  return (
    <button
      onClick={onClear}
      style={{
        background: 'white',
        border: 'none',
        borderRadius: 8,
        width: 48,
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
        padding: 0,
        cursor: 'pointer'
      }}
      title="ล้างรายการ"
    >
      <span
        className="material-icons"
        style={{
          color: '#E53935',
          fontSize: 28,
          userSelect: 'none'
        }}
      >
        delete
      </span>
    </button>
  );
}

export default ClearButton;
