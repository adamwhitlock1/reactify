import React from 'react';
import logo from '@img/logo.png';
import Social from '@comps/Social';

function Header() {
  return (
    <header>
      <div className="[ filler ]" />
      <div className="[ logo ]">
        <img src={logo} alt="site logo" />
      </div>
      <div className="[ social ]">
        <Social />
      </div>
    </header>
  );
}

export default Header;
