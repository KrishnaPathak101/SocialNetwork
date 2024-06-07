import React from 'react';

const UserWebsite = ({ website }) => {
  return (
    website && (
      <p className="mt-2 text-blue-500">
        <a href={website} target="_blank" rel="noopener noreferrer">
          {website}
        </a>
      </p>
    )
  );
};

export default UserWebsite;
