import React, { useContext, useEffect, useState } from 'react';
import PostCreation from './PostCreation';
import TwitterFeed from './Twitterfeed';
import axios from 'axios';
import { UserContext } from '../useContext';
import LeftSidebar from './LeftSidebar';
import Maincontent from './Maincontent';
import { useParams } from 'react-router';
import Profile from '../pages/profile';
import RightSidebar from '../pages/Rightsidebar';


const Homepage = () => {
  const [activeTab, setActiveTab] = useState('you');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  let {subpage} = useParams();
  console.log(subpage)

  const {userId} = useParams();
  console.log(userId)

  return (
    <div className="flex">
      <LeftSidebar />
      {subpage === 'profile' ? <Profile userId={userId} /> : <Maincontent />}
      <RightSidebar />
    </div>
  );
};

export default Homepage;
