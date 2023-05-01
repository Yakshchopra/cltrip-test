/* eslint-disable comma-dangle */
/* eslint-disable array-callback-return */
/* eslint-disable multiline-ternary */
/* eslint-disable space-before-function-paren */
/* eslint-disable semi */
/* eslint-disable quotes */
/* eslint-disable jsx-quotes */
import { useEffect, useState } from "react";
import "./app.css";
import axios from "axios";
import Heading from "./components/Heading";
import { IoSend } from "react-icons/io5";
import { BsCheckAll } from "react-icons/bs";

export function App() {
  const [appdata, setAppdata] = useState(null) as any;
  const [displayData, setDisplayData] = useState([]) as any;
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const [timeout, setTimer] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await axios.get(
        "https://my-json-server.typicode.com/codebuds-fk/chat/chats"
      );
      if (res.status === 200) {
        setAppdata(res.data);
        setDisplayData(res.data);
        setLoading(false);
      } else {
        setLoading(false);
        alert("api error");
      }
    })();
  }, []);

  const handleChange = (e: any) => {
    const val = e.target.value;
    setInput(val);
    if (timeout) {
      clearTimeout(timeout);
    }
    // debouncing
    const timer: any = setTimeout(() => {
      const res = appdata.filter((item: any) => {
        return item?.orderId?.includes(val) || item?.title?.includes(val);
      });

      setDisplayData(res);
    }, 1000);

    setTimer(timer);
  };

  const [activeChild, setActiveChild] = useState(null) as any;

  const handleSend = () => {
    const newItem = {
      messageId: `msg${appdata[activeChild - 1].messageList?.length || "1"}`,
      message,
      timestamp: new Date().getTime(),
      sender: "USER",
      messageType: "text",
    };
    const newArr = appdata;
    newArr[activeChild - 1].messageList.push(newItem);
    setAppdata(newArr);
    setMessage("");
  };

  return (
    <div className="App">
      {!loading ? (
        <>
          <div className="child_1">
            <Heading>Filter by Title / Order ID</Heading>
            <input
              value={input}
              onChange={handleChange}
              placeholder="Start typing to search"
              className="search"
            />
            <div className="card-container">
              {displayData?.map((item: any, index: number) => {
                return (
                  <div
                    onClick={() => setActiveChild(item.id)}
                    key={item.id}
                    className="card"
                  >
                    <img src={item.imageURL} alt="" />

                    <div className="card_content">
                      <div>
                        <h4>{item.title}</h4>
                        <h6>Order: {item.orderId}</h6>
                      </div>
                      {item?.messageList?.length ? (
                        <p>{item.messageList[0].message}</p>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {activeChild && (
            <div className="child_2">
              <div className="header">
                <img src={appdata[activeChild - 1].imageURL} alt="" />
                <Heading>{appdata[activeChild - 1].title}</Heading>
              </div>
              <div className="bottom-bar">
                <input
                  onChange={(e) => setMessage(e.target.value)}
                  value={message}
                  placeholder="Type a Message"
                />
                <IoSend onClick={handleSend} className="send" />
              </div>
              {appdata[activeChild - 1].messageList.length ? (
                <div className="chat-list">
                  {appdata[activeChild - 1].messageList.map(
                    (item: any, index: any) => {
                      const hours = new Date(item.timestamp).getHours();
                      const minutes = new Date(item.timestamp).getMinutes();

                      const currDate = new Date(
                        appdata[activeChild - 1].messageList[index]?.timestamp
                      ).getDate();
                      const prevDate = new Date(
                        appdata[activeChild - 1].messageList[
                          index - 1
                        ]?.timestamp
                      ).getDate();

                      console.log(prevDate, currDate);

                      let showDate = null;

                      if (prevDate !== currDate) {
                        if (
                          new Date().getDate() !== currDate &&
                          new Date().getDate() !== currDate - 1
                        ) {
                          showDate = `${currDate} / ${new Date(
                            appdata[activeChild - 1].messageList[
                              index
                            ]?.timestamp
                          ).getMonth()} / ${new Date(
                            appdata[activeChild - 1].messageList[
                              index
                            ]?.timestamp
                          ).getFullYear()}`;
                        } else if (
                          currDate &&
                          new Date().getDate() === currDate - 1
                        ) {
                          showDate = "Yesterday";
                        } else {
                          showDate = "Today";
                        }
                      }

                      return (
                        <div key={item.messageId}>
                          {showDate && <p>{showDate}</p>}
                          <div
                            className={
                              item.sender === `USER` ? "chat-user" : "chat-bot"
                            }
                          >
                            <p>{item.message}</p>
                            <span className="time">
                              {hours > 12 ? hours - 12 : hours}:{minutes}{" "}
                              {hours > 12 ? "pm" : "am"}
                              {item.sender === `USER` && (
                                <BsCheckAll className="icon" />
                              )}
                            </span>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              ) : (
                <p className="empty">Send a message to start chatting</p>
              )}
            </div>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
