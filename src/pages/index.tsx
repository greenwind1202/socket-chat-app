import io from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import Cryptr from "cryptr";
import dateFormat from "dateformat";
import Icon from "@mdi/react";
import { mdiSend } from "@mdi/js";

let socket;

type Message = {
  author: string;
  message: string;
  date: string;
};

export default function Home() {
  const [username, setUsername] = useState("");
  const [chosenUsername, setChosenUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<Message>>([]);
  const messagesEnd = useRef();
  const crypt = new Cryptr("phongquangthien");

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    // We just call it because we don't need anything else out of it
    await fetch("/api/socket");

    socket = io();

    socket.on("newIncomingMessage", (msg) => {
      setMessages((currentMsg) => [
        ...currentMsg,
        { author: msg.author, message: msg.message, date: msg.date },
      ]);
      scrollToBottom();
    });
  };

  const sendMessage = async () => {
    // var startTime: Date = new Date();
    // const encrypt_message = crypt.encrypt(message);
    const encrypt_message = message;
    // var endTime: Date = new Date();
    // var timeDiff = +endTime - +startTime; //in ms
    // // strip the ms
    // timeDiff /= 1000;

    // // get seconds
    // var seconds = Math.round(timeDiff);
    // console.log(seconds + " seconds");
    const current_date = dateFormat(new Date(), "h:MM TT");

    socket.emit("createdMessage", {
      author: chosenUsername,
      message: encrypt_message,
      date: current_date,
    });
    setMessages((currentMsg) => [
      ...currentMsg,
      { author: chosenUsername, message: encrypt_message, date: current_date },
    ]);
    setMessage("");
  };

  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      if (message) {
        sendMessage();
      }
    }
  };
  const handleSubmitName = (e) => {
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      if (username) {
        setChosenUsername(username);
      }
    }
  };

  const scrollToBottom = () => {
    if (messagesEnd.current) {
      messagesEnd.current.scrollTop = messagesEnd.current.scrollHeight;
    }
  };

  return !chosenUsername ? (
    <div className="flex items-center p-4 mx-auto min-h-screen justify-center bg-gray-700">
      <main className="gap-4 flex flex-col items-center justify-center w-full h-full">
        <h3 className="font-bold text-white text-xl">
          How people should call you?
        </h3>
        <input
          type="text"
          placeholder="Identity..."
          value={username}
          className="p-3 rounded-md outline-none"
          onChange={(e) => setUsername(e.target.value)}
          onKeyUp={handleSubmitName}
        />
        <button
          onClick={() => {
            setChosenUsername(username);
          }}
          className="bg-white rounded-md px-4 py-2 text-xl"
        >
          Go!
        </button>
      </main>
    </div>
  ) : (
    <div class="h-screen bg-gray-300">
      <div class="flex justify-center items-center h-screen ">
        <div class="w-full h-screen bg-gray-200 rounded shadow-2xl">
          <nav className="w-full h-10 bg-gray-900 rounded-tr rounded-tl flex justify-between items-center">
            <div className="flex justify-center items-center">
              {" "}
              <i className="mdi mdi-arrow-left font-normal text-gray-300 ml-1"></i>
              <span className="text-xs font-medium text-gray-300 ml-1">
                {"Vì Bữa Cơm Thêm Thịt"}
              </span>{" "}
            </div>
            <div className="flex items-center">
              {" "}
              <i className="mdi mdi-video text-gray-300 mr-4"></i>{" "}
              <i className="mdi mdi-phone text-gray-300 mr-2"></i>{" "}
              <i className="mdi mdi-dots-vertical text-gray-300 mr-2"></i>{" "}
            </div>
          </nav>
          <div
            className="overflow-auto px-1 py-1"
            style={{ height: "calc(100vh - 81px)" }}
            id="journal-scroll"
            ref={messagesEnd}
          >
            {messages.map((msg, i) => {
              if (msg.author !== username) {
                return (
                  <div className="flex items-center pr-10 pt-2">
                    <span
                      className="flex ml-1 h-auto bg-gray-900 text-gray-200 text-xs font-normal rounded-sm px-1 p-1 items-end text-base"
                      style={{ display: "inline-block" }}
                    >
                      <span className="font-bold text-amber-400">
                        {msg.author}
                      </span>
                      <br />
                      {msg.message}{" "}
                      <span className="text-gray-400 pl-1 text-xs">
                        {msg.date}
                      </span>
                    </span>
                  </div>
                );
              }
              return (
                <div className="flex justify-end pt-2 pl-10">
                  {" "}
                  <span
                    className="bg-green-900 h-auto text-gray-200 text-xs font-normal p-1 rounded-sm px-1 items-end flex justify-end text-base"
                    style={{ display: "inline-block" }}
                  >
                    <span className="font-bold text-amber-600">
                      {msg.author}
                    </span>
                    <br />
                    {msg.message}
                    <span className="text-gray-400 pl-1 text-xs">
                      {msg.date}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between items-center p-1 ">
            <div className="relative" style={{ width: "calc(100vw - 40px)" }}>
              <input
                style={{ fontSize: "11px" }}
                type="text"
                value={message}
                className="rounded-full pl-6 pr-12 py-2 focus:outline-none h-auto placeholder-gray-50 bg-gray-700 text-white w-full"
                onChange={(e) => setMessage(e.target.value)}
                onKeyUp={handleKeypress}
                placeholder="Type a message..."
                autoFocus
              />
            </div>
            <div className="w-7 h-7 rounded-full bg-blue-300 text-center items-center flex justify-center">
              {" "}
              <button
                className="w-7 h-7 rounded-full text-center items-center flex justify-center focus:outline-none hover:bg-gray-900 hover:text-white"
                onClick={() => {
                  sendMessage();
                }}
              >
                <Icon path={mdiSend} size={0.7} />
              </button>{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
