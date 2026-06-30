import React from 'react';

const Notification = ({ message, type }) => {
  if (!message) return null;
  return (
    <div className={`notice show ${type}`} role="alert">
      {message}
    </div>
  );
};

export default Notification;
