import React from 'react';

const RoboHashAvatar = ({ seed, width,  }) => {
  const avatarUrl = `https://robohash.org/${seed}`;

  return (
    <img width={width} src={avatarUrl} alt="RoboHash Avatar" />
  );
};

export default RoboHashAvatar;
