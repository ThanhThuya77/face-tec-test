
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <Link to="/face-tec"><button onClick={() => console.log("redirect to FaceTec")}>Using FaceTec</button></Link>
    </div>
  );
};

export default Home;
