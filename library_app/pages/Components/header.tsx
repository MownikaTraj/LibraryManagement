import React from 'react';

const Header: React.FC = () => {
  const headerStyle: React.CSSProperties = {
    backgroundColor: '#333', 
    color: 'white',
    textAlign: 'center',
    padding: '10px 0',
    height: '30px',
    fontFamily: 'Segoe UI'

    
  };

  return (
    <header style={headerStyle}>
      <h1>Library Management System</h1>
    </header>
  );
}

export default Header;
