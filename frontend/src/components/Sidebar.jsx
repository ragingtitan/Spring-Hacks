import React, { useState, useEffect,useRef } from "react";
import jarvis_logo from "../assets/jarvis_logo.png";
import axios from "axios";
import { toast } from "react-toastify";
import { useCurrentChat } from "./ChatContext";
import newchat_logo from "../assets/newchat_logo.svg";
import closesidebar_logo from "../assets/closesidebar_logo.svg";
import { FaEllipsisV } from "react-icons/fa"; // Using FontAwesome's vertical ellipsis icon
import rename_btn from "../assets/rename_btn.svg"; //
import delete_btn from "../assets/delete_btn.svg";

const SidebarComponent = () => {
  const [collections, setCollections] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [currentCollection, setCurrentCollection] = useState("");
  const [key, setKey] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const chatRef = useRef(null);
const [DisplayOptions, setDisplayOptions] = useState(false);

  function fetchCollectionDate(collectionName) {
    const date = collectionName.split("_")[0];
    return new Date(date);
  }

  function fetchCollectionName(collectionName) {
    const [, name] = collectionName.split("_");
    return name;
  }

  const forceReRender = () => {
    setKey((prevKey) => prevKey + 1);
    window.location.reload(); // Change the key to force re-mount
  };

  const newCollections = async () => {
    const name = prompt("Enter chat name: ");
    if (!name || name.length === 0) {
      toast.error("Chat name cannot be empty!");
      return;
    }
    setCollectionName(name);
    const url = "http://localhost:4000/app/newCollection";
    try {
      const res = await axios.post(
        url,
        { collectionName: name },
        {
          withCredentials: true,
        }
      );
      if (res.data.status) {
        toast.success(res.data.message);
        localStorage.setItem("currentChat", name);
        getCollections();
        getCurrentCollection();
        
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getCurrentCollection = async () => {
    const url = "http://localhost:4000/app/setCurrentCollection";
    try {
      const res = await axios.post(
        url,
        {},
        {
          withCredentials: true,
        }
      );
      if (res.data.status) {
        setCurrentCollection(res.data.currentCollectionName);
        localStorage.setItem("currentChat", res.data.currentCollectionName);
        console.log(res.data.currentCollectionName);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getCollections = async () => {
    try {
      const url = "http://localhost:4000/app/collections";
      const response = await axios.get(url, {
        withCredentials: true,
      });
      if (response.data.collections !== "users") {
        setCollections(response.data.collections);
      }
    } catch (err) {
      console.error("Error fetching collections:", err.message);
    }
  };

  const changeCollection = async (collectionName) => {
    const url = "http://localhost:4000/app/setCurrentCollection";
    console.log("called changeCollection");
    try {
      const res = await axios.post(
        url,
        { collectionName },
        {
          withCredentials: true,
        }
      );
      if (res.data.status) {
        toast.success(res.data.message);
        setCurrentCollection(collectionName);
        localStorage.setItem("currentChat", collectionName);
        forceReRender();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const { currentChat } = useCurrentChat();

  useEffect(() => {
    getCollections();
  }, [collections]);

  useEffect(() => {
    setCurrentCollection(currentChat);
    if (!currentChat) {
      getCurrentCollection();
    }
  }, [currentChat]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  function sortCollections(collections) {
    function stripTime(date) {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    const today = stripTime(new Date());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const pastWeek = new Date(today);
    pastWeek.setDate(today.getDate() - 7);
    const pastThirtyDays = new Date(today);
    pastThirtyDays.setDate(today.getDate() - 30);

    const categorizedCollections = {
      today: [],
      yesterday: [],
      pastWeek: [],
      pastThirtyDays: [],
      older: [],
    };

    for (let i = 0; i < collections.length; i++) {
      let collection = collections[i];
      let collectionDate = stripTime(fetchCollectionDate(collection));

      if (collectionDate.getTime() === today.getTime()) {
        categorizedCollections.today.push(collection);
      } else if (collectionDate.getTime() === yesterday.getTime()) {
        categorizedCollections.yesterday.push(collection);
      } else if (collectionDate.getTime() >= pastWeek.getTime()) {
        categorizedCollections.pastWeek.push(collection);
      } else if (collectionDate.getTime() >= pastThirtyDays.getTime()) {
        categorizedCollections.pastThirtyDays.push(collection);
      } else {
        categorizedCollections.older.push(collection);
      }
    }
    return categorizedCollections;
  }

  const categorizedCollections = sortCollections(collections);


  const toggleDropdown = (e) => {
    e.stopPropagation();
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const handleOptionClick = (option, e) => {
    e.stopPropagation();
    toast.success(`You clicked ${option}`);
    setDropdownOpen(false);
  };

  return (
    <div>
      <div
        className={`sidebar hidden bg-[#171717] h-[100%] top-0 w-10/12 md:w-1/3 lg:w-1/3 border-gray-300 rounded-lg absolute z-40 transition-all duration-300 ${
          sidebarOpen ? "left-0 " : "-left-full"
        }`}
      >
        <div
          title="Toggle Sidebar"
          className={`bg-[#171717] cross w-fit fixed rounded-lg justify-center transition-all duration-150 p-2 cursor-pointer top-1/2 z-[10] ${
            !sidebarOpen
              ? "left-0 close-sidebar"
              : "lg:left-[33%] md:left-[33%] left-[83%] rotate-180"
          }`}
          onClick={toggleSidebar}
        >
          <img src={closesidebar_logo} alt="" />
        </div>
        <div
          className={`sidebar-content overflow-y-scroll overflow-x-hidden px-2 my-1 bg-[#171717] fixed h-[100%] top-0 w-10/12 md:w-1/3 lg:w-1/3 border-gray-300 rounded-lg z-20 transition-all duration-300`}
        >
          <div
            className="sticky rounded transition-all duration-150  w-full left-0 right-0 top-0 z-20 cursor-pointer"
            onClick={toggleSidebar}
          >
            <div
              onClick={newCollections}
              className="pb-0.5 bg-[#171717] last:pb-0"
              tabIndex="0"
            >
              <div className="group  transition-all flex h-10 items-center gap-2 rounded-lg bg-token-sidebar-surface-primary px-2 font-medium hover:bg-token-sidebar-surface-secondary">
                <div className="h-7 w-7 flex-shrink-0">
                  <div className="gizmo-shadow-stroke relative flex h-full items-center justify-center rounded-full">
                    <img src={jarvis_logo} alt="" width="28" />
                  </div>
                </div>
                <div className="grow overflow-hidden text-ellipsis whitespace-nowrap text-sm text-token-text-primary ">
                  New chat
                </div>

                <div className="flex gap-3 sidebar-newchat p-1 rounded duration-200">
                  <span className="flex items-center" data-state="closed">
                    <button className="text-token-text-primary">
                      <img src={newchat_logo} alt="" />
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <label className="px-1 my-4 w-full font-semibold text-lg" htmlFor="">
            <div className="flex flex-col gap-3">
              <div
                className={`${
                  categorizedCollections.today.length === 0 ? "hidden" : ""
                }`}
              >
                <h2>Today</h2>
                {categorizedCollections.today.length > 0 ? (
                  categorizedCollections.today.map((collection, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        changeCollection(collection);
                      }}
                      className={`flex w-full justify-between px-4 gap-2 hover:bg-[#212121] transition-all duration-150 items-center rounded-lg py-3 my-1 cursor-pointer hover:bg-token-sidebar-surface-secondary ${
                        collection === currentCollection ? "bg-[#212121]" : ""
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <div className="text-sm text-token-text-primary">
                          {fetchCollectionName(collection)}
                        </div>
                      </div>
                      <button onMouseEnter={()=>{setDisplayOptions(true)}} onMouseLeave={()=>{setDisplayOptions(false)}} className="p-1" onClick={(e) => { e.stopPropagation(); setDropdownOpen(dropdownOpen === index ? null : index); }}>
                        <FaEllipsisV className="rotate-90 z-[100000000000]" />
                        {dropdownOpen === index && (
                          <div className="dropdown left-[80%] z-[1000000]  md:left-[30%] lg:left-[30%]  p-4  text-sm rounded-3xl">
                            <a onClick={(e) => handleOptionClick('rename', e)}>
                              <div className="rename flex gap-2 p-4 rounded-xl">
                              <img src={rename_btn} alt="" />
                              rename
                              </div>
                              </a>
                            <a onClick={(e) => handleOptionClick('delete', e)}>
                              <div className="delete flex gap-2 p-4 rounded-xl">
                              <img src={delete_btn} alt="" />
                              <span className="text-red-600">Delete</span>
                              </div>
                            </a>
                           
                          </div>
                        )}
                      </button>
                    </div>
                  ))
                ) : (
                  <div
                    className={`flex w-full justify-center gap-2 text-[14px] text-gray-300 transition-all duration-150 items-center rounded-lg py-3 my-1 hover:bg-token-sidebar-surface-secondary `}
                  >
                    No chats found.
                  </div>
                )}
              </div>

              <div
                className={`${
                  categorizedCollections.yesterday.length === 0 ? "hidden" : ""
                }`}
              >
                <h2>Yesterday</h2>
                {categorizedCollections.yesterday.length > 0 ? (
                  categorizedCollections.yesterday.map((collection, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        changeCollection(collection);
                      }}
                      className={`flex w-full justify-between px-4 gap-2 hover:bg-[#212121] transition-all duration-150 items-center rounded-lg py-3 my-1 cursor-pointer hover:bg-token-sidebar-surface-secondary ${
                        collection === currentCollection ? "bg-[#212121]" : ""
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <div className="text-sm text-token-text-primary">
                          {fetchCollectionName(collection)}
                        </div>
                      </div>
                      <button className="p-1" onClick={(e) => { e.stopPropagation(); setDropdownOpen(dropdownOpen === index ? null : index); }}>
                        <FaEllipsisV className="rotate-90 hover:opacity-80 z-[100000000000]" />
                        {dropdownOpen === index && (
                          <div className="dropdown left-[80%] z-[1000000]  md:left-[30%] lg:left-[30%] p-4  text-sm rounded-3xl">
                            <a onClick={(e) => handleOptionClick('rename', e)}>
                              <div className="rename flex gap-2 p-4 rounded-xl">
                              <img src={rename_btn} alt="" />
                              rename
                              </div>
                              </a>
                            <a onClick={(e) => handleOptionClick('delete', e)}>
                              <div className="delete flex gap-2 p-4 rounded-xl">
                              <img src={delete_btn} alt="" />
                              <span className="text-red-600">Delete</span>
                              </div>
                            </a>
                           
                          </div>
                        )}
                      </button>
                    </div>
                  ))
                ) : (
                  <div
                    className={`flex w-full justify-center gap-2 text-[14px] text-gray-300 transition-all duration-150 items-center rounded-lg py-3 my-1 hover:bg-token-sidebar-surface-secondary `}
                  >
                    No chats found.
                  </div>
                )}
              </div>

              <div
                className={`${
                  categorizedCollections.pastWeek.length === 0 ? "hidden" : ""
                }`}
              >
                <h2>Past Week</h2>
                {categorizedCollections.pastWeek.length > 0 ? (
                  categorizedCollections.pastWeek.map((collection, index) => (
                    <div
                      key={index+10}
                      onClick={() => {
                        changeCollection(collection);
                      }}
                      className={`flex w-full justify-between px-4 gap-2 hover:bg-[#212121] transition-all duration-150 items-center rounded-lg py-3 my-1 cursor-pointer hover:bg-token-sidebar-surface-secondary ${
                        collection === currentCollection ? "bg-[#212121]" : ""
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <div className="text-sm text-token-text-primary">
                          {fetchCollectionName(collection)}
                        </div>
                      </div>
                      <button className="p-1" onClick={(e) => { e.stopPropagation(); setDropdownOpen(dropdownOpen === index+10 ? null : index+10); }}>
                        <FaEllipsisV className={`rotate-90 hover:opacity-80 z-[100000000000]`} />
                        {dropdownOpen === index+10 && (
                          <div className="dropdown left-[80%] z-[1000000] md:left-[30%] lg:left-[30%] p-4  text-sm rounded-3xl">
                            <a onClick={(e) => handleOptionClick('rename', e)}>
                              <div className="rename flex gap-2 p-4 rounded-xl">
                              <img src={rename_btn} alt="" />
                              rename
                              </div>
                              </a>
                            <a onClick={(e) => handleOptionClick('delete', e)}>
                              <div className="delete flex gap-2 p-4 rounded-xl">
                              <img src={delete_btn} alt="" />
                              <span className="text-red-600">Delete</span>
                              </div>
                            </a>
                           
                          </div>
                        )}
                      </button>
                      
                    </div>
                  ))
                ) : (
                  <div
                    className={`flex w-full justify-center gap-2 text-[14px] text-gray-300 transition-all duration-150 items-center rounded-lg py-3 my-1 hover:bg-token-sidebar-surface-secondary `}
                  >
                    No chats found.
                  </div>
                )}
              </div>

              <div
                className={`${
                  categorizedCollections.pastThirtyDays.length === 0
                    ? "hidden"
                    : ""
                }`}
              >
                <h2>Past Month</h2>
                {categorizedCollections.pastThirtyDays.length > 0 ? (
                  categorizedCollections.pastThirtyDays.map(
                    (collection, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          changeCollection(collection);
                        }}
                        className={`flex w-full justify-between px-4 gap-2 hover:bg-[#212121] transition-all duration-150 items-center rounded-lg py-3 my-1 cursor-pointer hover:bg-token-sidebar-surface-secondary ${
                          collection === currentCollection ? "bg-[#212121]" : ""
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <div className="text-sm text-token-text-primary">
                            {fetchCollectionName(collection)}
                          </div>
                        </div>
                        <button className="p-1" onClick={(e) => { e.stopPropagation(); setDropdownOpen(dropdownOpen === index ? null : index); }}>
                        <FaEllipsisV className="rotate-90 hover:opacity-80 z-[100000000000]" />
                        {dropdownOpen === index && (
                          <div className="dropdown left-[80%] z-[1000000]  md:left-[30%] lg:left-[30%] p-4  text-sm rounded-3xl">
                            <a onClick={(e) => handleOptionClick('rename', e)}>
                              <div className="rename flex gap-2 p-4 rounded-xl">
                              <img src={rename_btn} alt="" />
                              rename
                              </div>
                              </a>
                            <a onClick={(e) => handleOptionClick('delete', e)}>
                              <div className="delete flex gap-2 p-4 rounded-xl">
                              <img src={delete_btn} alt="" />
                              <span className="text-red-600">Delete</span>
                              </div>
                            </a>
                           
                          </div>
                        )}
                      </button>
                      </div>
                    )
                  )
                ) : (
                  <div
                    className={`flex w-full justify-center gap-2 text-[14px] text-gray-300 transition-all duration-150 items-center rounded-lg py-3 my-1 hover:bg-token-sidebar-surface-secondary `}
                  >
                    No chats found.
                  </div>
                )}
              </div>

              <div
                className={`${
                  categorizedCollections.older.length === 0 ? "hidden" : ""
                }`}
              >
                <h2>Older</h2>
                {categorizedCollections.older.length > 0 ? (
                  categorizedCollections.older.map((collection, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        changeCollection(collection);
                      }}
                      className={`flex w-full justify-between px-4 gap-2 hover:bg-[#212121] transition-all duration-150 items-center rounded-lg py-3 my-1 cursor-pointer hover:bg-token-sidebar-surface-secondary ${
                        collection === currentCollection ? "bg-[#212121]" : ""
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <div className="text-sm text-token-text-primary">
                          {fetchCollectionName(collection)}
                        </div>
                      </div>
                      <button className="p-1" onClick={(e) => { e.stopPropagation(); setDropdownOpen(dropdownOpen === index ? null : index); }}>
                        <FaEllipsisV className="rotate-90 hover:opacity-80 z-[100000000000]" />
                        {dropdownOpen === index && (
                          <div className="dropdown left-[80%] z-[1000000]  md:left-[30%] lg:left-[30%] p-4  text-sm rounded-3xl">
                            <a onClick={(e) => handleOptionClick('rename', e)}>
                              <div className="rename flex gap-2 p-4 rounded-xl">
                              <img src={rename_btn} alt="" />
                              rename
                              </div>
                              </a>
                            <a onClick={(e) => handleOptionClick('delete', e)}>
                              <div className="delete flex gap-2 p-4 rounded-xl">
                              <img src={delete_btn} alt="" />
                              <span className="text-red-600">Delete</span>
                              </div>
                            </a>
                           
                          </div>
                        )}
                      </button>
                    </div>
                  ))
                ) : (
                  <div
                    className={`flex w-full justify-center gap-2 text-[14px] text-gray-300 transition-all duration-150 items-center rounded-lg py-3 my-1 hover:bg-token-sidebar-surface-secondary `}
                  >
                    No chats found.
                  </div>
                )}
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default SidebarComponent;
