import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { marked } from "marked";
import DOMPurify from "dompurify";
import WelcomeCard from "./WelcomeCard";
import jarvis_logo from "../assets/jarvis_logo.png";
import copy_btn from "../assets/copy_btn.svg";
import speaker_btn from "../assets/speaker_btn.svg";
import { useCurrentChat } from "./ChatContext";
import expand_icon from "../assets/expand_icon.svg";
import minimize_icon from "../assets/minimize_icon.svg";
import send_btn from "../assets/send_btn.svg";
import cross_icon from "../assets/cross_icon.svg";
import hljs from "highlight.js";
import 'regenerator-runtime/runtime';
import './AiNotesMaker.css'

import { FaMicrophone } from "react-icons/fa";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import regenerate_btn from "../assets/regenerate_btn.svg";
import upload_btn from "../assets/upload_btn.svg";
import scrollDown_btn from "../assets/scrollDown_btn.svg";
import attachment_btn from "../assets/attachment_btn.svg";
import {Link, useNavigate} from "react-router-dom"
import { AuthContext } from "./AuthContext";


const ChatArea = () => {
  const [prompt, setPrompt] = useState("");
  const [percentage, setPercentage] = useState(0);
  const [response, setResponse] = useState([]);
  const [prevChat, setprevChat] = useState([]);
  const [newprompt, setnewprompt] = useState("");
  const [largeTextArea, setlargeTextArea] = useState(false);
  const { currentChat } = useCurrentChat();
  const textareaRef = useRef(null);
  const hiddenTextRef = useRef(null);
  const [speaking, setSpeaking] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState(null); // Track index of the currently spoken response
  const { currentModel } = useCurrentChat();
  const [atBottom, setAtBottom] = useState(false);
  const [useJarvisMode, setuseJarvisMode] = useState(false);
  const [attachment, setattachment] = useState(false);
  const {isLoggedIn}= useContext(AuthContext)

  const navigate = useNavigate();
  const goBack = ()=>{
    navigate(-1);
  }
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };
  const escapeHtml = (str) => {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const formatPrompt = (prompt) => {
    const codePattern =
      /\b(?:function|return|if|else|while|for|let|const|var|=>|\{|}|;|class|import|export|require|module\.exports)\b|\(\)|\(\w+\)|\[\]|\w+\(\)|\w+\.\w+/;

    // Escape HTML tags to show as text
    const escapedPrompt = escapeHtml(prompt);

    if (codePattern.test(prompt)) {
      return { __html: `<pre class="code-block">${escapedPrompt}</pre>` };
    } else {
      return { __html: `<div class="normal-text">${escapedPrompt}</div>` };
    }
  };

  const isAtBottom = () => {
    // Get the scroll position
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    // Get the height of the viewport
    const windowHeight = window.innerHeight;
    // Get the total height of the document
    const documentHeight = document.documentElement.scrollHeight;

    // Check if scrolled to the bottom
    const isAtBottom = scrollTop + windowHeight >= documentHeight - 1; // Adding -1 to handle precision issues
    setAtBottom(isAtBottom);
  };
  const handleButtonClick = (buttonText) => {
    setPrompt(buttonText);
  };
  useEffect(() => {
    // Add scroll event listener
    window.addEventListener("scroll", isAtBottom);

    // Remove scroll event listener on cleanup
    return () => {
      window.removeEventListener("scroll", isAtBottom);
    };
  }, []);
  const formatText = (text) => {
    const markdownToHtml = marked(text); // Convert Markdown to HTML
    const sanitizedHtml = DOMPurify.sanitize(markdownToHtml); // Sanitize HTML to prevent XSS
    return { __html: sanitizedHtml };
  };

  const handleSubmit = async () => {
    if (prompt.trim() === "") {
      toast.error("Prompt cannot be empty");
      return;
    }
    const currentChat = localStorage.getItem("currentChat");
    const spin = document.getElementById("loading-placeholder");
    const path = document.querySelector(".path-send-btn");
    const sendbtn = document.getElementById("send-prompt");
    path.classList.add("hidden");
    spin.classList.add("loading-spinner");
    sendbtn.disabled = true;
    try {
      const res = await axios.post(
        "http://localhost:4000/app/response",
        {
          prompt: prompt,
        },
        { withCredentials: true }
      );

      console.log("Response:", res.data);
      spin.classList.remove("loading-spinner");
      path.classList.remove("hidden");
      sendbtn.disabled = false;
      // Assuming the response structure is { prompt: string, response: string }
      const {
        prompt: newPrompt,
        response: newResponse,
        model: model,
      } = res.data;

      // Update both prompt and responses
      setResponse((prevResponses) => [
        ...prevResponses,
        { prompt: prompt, response: newResponse, model: model },
      ]);

      // Clear the prompt for the next entry
      setPrompt("");
      scrollToBottom();
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };
  const getPrevChat = async () => {
    let url = "http://localhost:4000/app/prevSummarization";
    try {
      const res = await axios.get(
        url,
        { withCredentials: true }
      );

      console.log(res.data);
      if (res.data.status) {
        setResponse(res.data.prevChat);
        scrollToBottom();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch previous chat: " + error.message);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [response]);

  useEffect(() => {
    getPrevChat();
  }, [currentChat]);

  useEffect(() => {
    let value = localStorage.getItem("cardValue");
    if (value) {
      setPrompt(value);
      localStorage.removeItem("cardValue");
    }
  }, []);

  useEffect(() => {
    const handleInput = () => {
      const textarea = textareaRef.current;
      const hiddenText = hiddenTextRef.current;
      const firstLine = prompt.split("\n")[0];
      hiddenText.textContent = firstLine;
      const textWidth = hiddenText.offsetWidth;
      const textareaWidth = textarea.clientWidth;
      // Calculate the percentage
      const calculatedPercentage = Math.min(
        (textWidth / textareaWidth) * 100,
        100
      ).toFixed(2);
      // Update the state
      setPercentage(calculatedPercentage);
    };
    handleInput();
  }, [prompt]);

  const expandTextArea = () => {
    setlargeTextArea(true);
  };
  const minimizeTextArea = () => {
    setlargeTextArea(false);
  };
  const messageRefs = useRef([]);
  const messageRef = useRef(null);
  const buttonRef = useRef([]);
  //important functions
  const copyText = (textToCopy) => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        toast.success("Text copied to clipboard!");
      })
      .catch((err) => {
        toast.error("Failed to copy text to clipboard.");
        console.error("Error copying text: ", err);
      });
  };
  const handleSpeak = (text, index) => {
    if ("speechSynthesis" in window && text.trim() !== "") {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.2;

      window.speechSynthesis.speak(utterance);

      utterance.onstart = () => {
        setSpeakingIndex(index); // Set the current index when speaking starts
      };
      utterance.onend = () => {
        setSpeakingIndex(null); // Clear the index when speaking ends
      };
      utterance.onerror = (event) => {
        console.error("An error occurred:", event.error);
        setSpeakingIndex(null); // Clear the index on error
      };
    } else {
      toast.warning(
        "Text-to-Speech is not supported in this browser or the text input is empty."
      );
    }
  };

  const handleStop = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null); // Clear the speaking index
    }
  };
  useEffect(() => {
    hljs.highlightAll();
  }, [response]);

  const { transcript, resetTranscript, listening } = useSpeechRecognition();

  // Check if the browser supports speech recognition
  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <p>Your browser does not support speech recognition.</p>;
  }

  // Function to start speech recognition
  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({
      continuous: true, // Keeps listening for continuous speech
      language: "en-US", // Sets the language
    });
    setSpeaking(true);
  };

  // Function to stop speech recognition
  const stopListening = () => {
    let promptBar = document.getElementById("send-prompt");
    SpeechRecognition.stopListening();
    setPrompt(transcript);
    setSpeaking(false);
    promptBar.focus();
  };

  // Function to reset the transcript
  const handleResetTranscript = () => {
    resetTranscript();
  };
  return (
    <div className="w-full overflow-x-hidden  justify-center items-start ">
      
      <div
        className={`${
          response.length > 0 ? "hidden" : "fixed overflow-hidden top-1/3"
        }  w-[100%] h-full bg-[#212121]`}
      >
        <div
        className={`${
          isLoggedIn ? "fixed" : "hidden"
        } p-3 shadow-xl lg:top-20 lg:left-4 md:top-20 top-16  left-2 text-white `}
      >
        <Link onClick={goBack} className="bg-indigo-700 p-3 rounded">
          Go back
        </Link>
      </div>
        <div className=" flex  flex-col justify-center items-center ">
          <img className="m-2" src={jarvis_logo} width={90} alt="JARVIS Logo" />
          <WelcomeCard className="welcome-card" onButtonClick={handleButtonClick} />
        </div>
      </div>
      <div className="w-full justify-center flex-col items-center gap-10 transition-all duration-300">
        <div
          className={`response-area  gap-10 md:gap-6 lg:gap-2  mt-[3rem] flex flex-col justify-center h-[90%] items-center w-full ${
            prompt.length > 200 || percentage > 95 ? "pb-[14rem]" : "pb-[7rem]"
          }`}
        >
          {response.map((responseObject, index) => (
            <div
              key={index}
              className="response-body w-11/12 md:w-2/3 lg:w-2/3 flex justify-center flex-col"
            >
              <div className="user-prompt w-full p-2 flex flex-col items-center md:items-end lg:items-end">
                <div className="prompt ">
                </div>
                <div className="prompt flex p-3 rounded-3xl justify-end  bg-[#4f5051] [1.05rem]">
                  <div />
                  <div
                    className=""
                    dangerouslySetInnerHTML={formatPrompt(
                      responseObject.prompt
                    )}
                  />
                </div>
              </div>
              <div className="response-message justify-center items-start lg:gap-6 md:gap-6 gap-3 w-full flex p-2">
                <div
                  className="message text-[1.05rem] w-full flex flex-col"
                  ref={(el) => (messageRefs.current[index] = el)}
                >
                  <div
                    dangerouslySetInnerHTML={formatText(
                      responseObject.response
                    )}
                  />

                  <div className="copy-btn-wrapper items-center flex gap-1 mt-2">
                    <span>
                      <button
                        onClick={() => {
                          const text = messageRefs.current[index].innerText;
                          copyText(text);
                        }}
                        title="Copy Response"
                        className="transition-all duration-200   hover:bg-[#4f5051] rounded-md flex items-center gap-1.5  p-1 text-xs text-gray-600"
                      >
                        <img className="" src={copy_btn} alt="" />
                      </button>
                    </span>
                    <span>
                      <button
                        onClick={() => {
                          const text = messageRefs.current[index].innerText;
                          handleSpeak(text, index);
                        }}
                        title="Speak the response"
                        className=" hover:bg-[#4f5051]  transition-all duration-200 flex hover:text-black items-center gap-1.5 rounded-md p-1 text-xs text-gray-600"
                      >
                        <img
                          className={` ${
                            speakingIndex === index ? "hidden" : "block"
                          }`}
                          src={speaker_btn}
                          alt=""
                        />
                      </button>
                    </span>
                    <span>
                      <button
                        className={`${
                          speakingIndex === index
                            ? "flex justify-center items-center"
                            : "hidden"
                        }`}
                        onClick={handleStop}
                        disabled={speakingIndex !== index}
                      >
                        <img src={cross_icon} alt="" />
                      </button>
                    </span>
                    <span
                      title="Regenerate response"
                      className="flex items-center justify-center hover:bg-[#4f5051] duration-200 rounded-md cursor-pointer p-1"
                    >
                      <img src={regenerate_btn} alt="" />
                    </span>
                    <span title="model used">
                      <button className="cursor-pointer hover:bg-[#4f5051] duration-200 rounded-md p-1">
                        {responseObject.model}
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* <div
        onClick={() => {
          setuseJarvisMode(!useJarvisMode);
        }}
        className={`${
          currentModel == "advanced" ? "fixed " : "hidden"
        } top-12 right-2 p-2 bg-blue-500 text-white font-bold rounded-lg shadow-lg cursor-pointer transition-transform transform hover:bg-blue-600 hover:scale-105 active:bg-blue-700`}
      >
        <span>{useJarvisMode ? "Use Normal Mode" : "Use JARVIS Mode"}</span>
      </div> */}
      <button
        onClick={scrollToBottom}
        className={`${atBottom || response.length === 0 ? "hidden" : "fixed"} ${
          prompt.length > 200 || percentage > 95 ? " bottom-48 " : "bottom-32 "
        } ${
          largeTextArea ? "hidden" : ""
        } left-1/2 scroll-down-btn z-10 transition-all duration-300 rounded-full bg-clip-padding text-token-text-secondary bg-token-main-surface-primary`}
      >
        <img src={scrollDown_btn} alt="" />
      </button>
      <div className="prompt-area w-full fixed bottom-7 md:bottom-8 lg:bottom-8 flex justify-center items-center">
        <div className="prompt-essentials-wrapper flex w-full items-center justify-center">
          <div
            className={`bg-[#4f5051] ${
              attachment ? "absolute bottom-20" : "hidden"
            } rounded-lg `}
          >
            <div
              role="menuitem"
              className="flex duration-150 items-center m-1.5 p-2.5 text-sm cursor-pointer focus:outline-none group relative hover:bg-[#212121] focus:bg-[#f5f5f5] dark:hover:bg-token-main-surface-secondary dark:focus:bg-token-main-surface-secondary rounded-md px-3 mx-2 py-3 gap-2.5"
              tabIndex="-1"
              data-orientation="vertical"
              data-radix-collection-item=""
            >
              <div className="flex items-center justify-center text-token-text-secondary h-5 w-5">
                <img src={upload_btn} alt="" />
              </div>
              <input type="file" name="" id="" placeholder="Upload file" />
            </div>
          </div>
          <div
            className={`prompt-essentials ${
              useJarvisMode ? "hidden" : ""
            } relative flex items-center  justify-center`}
          >
            <img
              onClick={expandTextArea}
              className={`${
                largeTextArea ? "hidden" : ""
              } absolute cursor-pointer top-[5%] right-[3%] lg:top-[5%] lg:right-[1%] ${
                prompt.length > 200 ? "block" : "hidden"
              }`}
              src={expand_icon}
              alt=""
            />
            <div
              className={`prompt-input rounded-xl  flex w-full items-center justify-center ${
                largeTextArea ? "large-text-area" : ""
              }`}
            >
              <img
                onClick={minimizeTextArea}
                className={`absolute cursor-pointer z-[1] top-[3%] right-[3%] lg:top-[3%] lg:right-[1%] ${
                  !largeTextArea ? "hidden " : ""
                } `}
                src={minimize_icon}
                alt=""
              />

              <button
                onClick={() => {
                  setattachment(!attachment);
                }}
                className={`${
                  currentModel === "advanced" ? "flex" : "hidden"
                } ml-[0.5rem] items-center justify-center h-8 w-8 rounded-full text-token-text-primary focus-visible:outline-black dark:text-white dark:focus-visible:outline-white mb-1 ${largeTextArea?"hidden" : ""}`}
                aria-disabled="true"
              >
                <img src={attachment_btn} alt="" />
              </button>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                autoComplete="off"
                id="prompt"
                name="prompt"
                ref={textareaRef}
                className={`${
                  percentage > 95 ? "h-[8rem] py-3" : "h-16 "
                }  p-3 mx-4 w-full bg-transparent outline-none border- resize-none ${
                  prompt.length > 200 && !largeTextArea? "h-[15rem] " : "py-4"
                } ${largeTextArea ? "h-full rounded-xl py-10" : ""} `}
                type="text"
                placeholder="Paste your notes here..."
              ></textarea>
              <div
                className={`relative 
                ${
                  currentModel == "advanced" ? "flex " : "hidden"
                } right-3 hover:opacity-90 p-2 text-white font-bold rounded-full cursor-pointer transition-transform transform  flex items-center`}
              >
                <FaMicrophone
                  onClick={startListening}
                  className={`h-[1.23rem] ${
                    largeTextArea ? "hidden" : ""
                  } w-[1.23rem] ${speaking ? "hidden" : ""} `}
                />{" "}
                {/* Microphone icon */}
                <div
                  className={`gap-2 ${
                    currentModel == "advanced" ? "flex " : "hidden"
                  }`}
                >
                  <button
                    className={`${speaking ? "" : "hidden"}`}
                    onClick={stopListening}
                  >
                    <img
                      className="text-white w-[1.75rem]"
                      src={cross_icon}
                      alt=""
                    />
                  </button>
                </div>
              </div>
              <div></div>
              <div className="send-message relative right-3 transition-all duration-300 flex items-center">
                <button
                  onClick={handleSubmit}
                  title="Send Button"
                  id="send-prompt"
                  className={`disabled:opacity-20 bg-gray-300 rounded-md enabled:bg-white enabled:text-black ${
                    largeTextArea ? "hidden" : ""
                  }`}
                  data-testid="send-button"
                  disabled={prompt.trim() === ""}
                >
                  <span className="rounded-md" data-state="closed">
                    {/* <img className="path-send-btn" src={send_btn} alt="" /> */}

                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        className="path-send-btn"
                        d="M7 11L12 6L17 11M12 18V7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>

                    <span
                      id="loading-placeholder"
                      className="flex justify-center items-center opacity-40"
                    ></span>
                  </span>
                </button>
              </div>
              <div
                ref={hiddenTextRef}
                style={{
                  visibility: "hidden",
                  whiteSpace: "pre",
                  position: "absolute",
                  fontSize: "16px",
                  lineHeight: "1.5",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      {console.log(transcript)}
    </div>
  );
};

export default ChatArea;