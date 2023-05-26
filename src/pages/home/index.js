import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      <Link to="/face-tec"><button className="btn" onClick={() => console.log("redirect to FaceTec")}>Using FaceTec</button></Link>
    </div>
  );
};

export default Home;
