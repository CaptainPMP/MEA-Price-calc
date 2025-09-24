const fontFamily = "'Prompt', sans-serif";

function Header() {
  return (
    <div
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
        alt="MEA Logo"
        style={{
          height: '56px',
          width: '56px',
          objectFit: 'contain'
        }}
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
  );
}

export default Header;
