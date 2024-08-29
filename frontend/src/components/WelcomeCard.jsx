import React, { useState } from 'react';

const ButtonGroup = ({ onButtonClick }) => {
  const [value, setValue] = useState('');

  const setValueofDisplayCard = (buttonVal) => {
    setValue(buttonVal);
    localStorage.setItem('cardValue', buttonVal);
    if (onButtonClick) {
      onButtonClick(buttonVal); // Call the callback function with the button value
    }
  };

  // Define buttons with a context related to note-making and AI assistance
  const buttons = [
    {
      color: 'rgb(203, 139, 208)',
      iconPath: (
        <>
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
            d="M3 6h7M3 10h4"
          ></path>
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13.428 17.572L20.5 10.5a2.828 2.828 0 1 0-4-4l-7.072 7.072a2 2 0 0 0-.547 1.022L8 19l4.406-.881a2 2 0 0 0 1.022-.547"
          ></path>
        </>
      ),
      text: 'Generate Meeting Notes',
    },
    {
      color: 'rgb(226, 197, 65)',
      iconPath: (
        <>
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19a3 3 0 1 1-6 0M15.865 16A7.54 7.54 0 0 0 19.5 9.538C19.5 5.375 16.142 2 12 2S4.5 5.375 4.5 9.538A7.54 7.54 0 0 0 8.135 16m7.73 0h-7.73m7.73 0v3h-7.73v-3"
          ></path>
        </>
      ),
      text: 'Create Summary of Lecture',
    },
    {
      color: 'rgb(118, 208, 235)',
      iconPath: (
        <>
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M12.455 4.105a1 1 0 0 0-.91 0L1.987 8.982 1.077 7.2l9.56-4.877a3 3 0 0 1 2.726 0l9.56 4.877A1.98 1.98 0 0 1 24 9.22V15a1 1 0 1 1-2 0v-3.784l-2.033.995v4.094a3 3 0 0 1-1.578 2.642l-4.967 2.673a3 3 0 0 1-2.844 0l-4.967-2.673a3 3 0 0 1-1.578-2.642v-4.094l-2.927-1.433C-.374 10.053-.39 7.949 1.077 7.2l.91 1.782 9.573 4.689a1 1 0 0 0 .88 0L22 8.989v-.014zM6.033 13.19v3.114a1 1 0 0 0 .526.88l4.967 2.674a1 1 0 0 0 .948 0l4.967-2.673a1 1 0 0 0 .526-.88V13.19l-4.647 2.276a3 3 0 0 1-2.64 0z"
            clipRule="evenodd"
          ></path>
        </>
      ),
      text: 'Quiz Me on Key Topics',
    },
    {
      color: 'rgb(203, 139, 208)',
      iconPath: (
        <>
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 18V7h16v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2"
          ></path>
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 10V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v4"
          ></path>
        </>
      ),
      text: 'Organize Daily Notes',
    },
  ];

  return (
    <div style={{ opacity: 1 }}>
      <div className="mx-3 mt-12 flex max-w-3xl flex-wrap items-stretch justify-center gap-4">
        {buttons.map((button, index) => (
          <div
            key={index}
            className={`max-w-3xl flex-wrap items-stretch justify-center gap-4 ${
              index === 0 || index === 1 ? 'lg:flex md:flex hidden' : ''
            } md:${
              index === 1 || index === 2 || index === 3 || index === 4
                ? 'flex'
                : ''
            } lg:${index === 1 || index === 2 || index === 3 || index === 4 ? 'flex' : ''}`}
          >
            <button
              onClick={() => setValueofDisplayCard(button.text)}
              className="relative flex w-40 flex-col gap-2 rounded-2xl px-3 pb-4 pt-3 text-start align-top text-[15px] shadow-xxs transition enabled:hover:bg-token-main-surface-secondary disabled:cursor-not-allowed border-gray-500 border-[0.5px] hover:bg-[#1e1e1e] opacity-90 hover:opacity-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                className="icon-md"
                style={{ color: button.color }}
              >
                {button.iconPath}
              </svg>
              <div className="leading-6 text-balance text-white dark:text-gray-500 break-word opacity-50">
                {button.text}
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ButtonGroup;
