import React from 'react'; 
import '../css/navbar.css';


const NavBar = () => {
    return (
      <header className='header'>
        <a href='/' className='logo'>SpeeDial</a>
        <nav>
          <ul>
            <li><a href='/'>Home</a></li>
            <li><a href='/about'>About</a></li>
            <li><a href='/shop'>Shop</a></li>
          </ul>
        </nav>
      </header>
    );
}

export default NavBar;