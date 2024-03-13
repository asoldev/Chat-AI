import { useEffect, useRef, useState } from "react";
import * as iconSpinner from "react-loader-spinner";
import { TChatsHistories } from "./type";

interface TMessagesContainer {
  messages: TChatsHistories[];
  isLoading: boolean;
}

function MessagesContainer(props: TMessagesContainer) {
  const divRef = useRef<any>(null);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollIntoView({ behavior: "smooth" });
    }
  });
  return (
    <>
      <div
        id="style-1"
        className="flex flex-col space-y-4 p-3 overflow-y-auto scrolling-touch"
      >
        {props.messages.map((item: TChatsHistories, index: number) =>
          item.isBot === true ? (
            <div className="chat-message" key={index}>
              <div className="flex items-end">
                <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                  <div>
                    <span
                      ref={divRef}
                      className=" px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600"
                    >
                      <Typewriter text={item.content} delay={30} />
                    </span>
                  </div>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
                  alt="My profile"
                  className="w-6 h-6 rounded-full order-1"
                />
              </div>
            </div>
          ) : (
            <div className="chat-message" key={index}>
              <div className="flex items-end justify-end">
                <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                  <div>
                    <span className=" px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
                      <p>{item.content}</p>
                    </span>
                  </div>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
                  alt="My profile"
                  className="w-6 h-6 rounded-full order-2"
                />
              </div>
            </div>
          )
        )}

        {props.isLoading && (
          <div className="chat-message">
            <div className="flex items-end">
              <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                <div>
                  <span className=" px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
                    <iconSpinner.ThreeDots
                      visible={true}
                      height="18"
                      width="18"
                      color="#353230"
                      radius="9"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                    />
                  </span>
                </div>
              </div>
              <img
                src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
                alt="My profile"
                className="w-6 h-6 rounded-full order-1"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function Typewriter({ text, delay }: any) {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  // Typing logic goes here
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  return <span>{currentText}</span>;
}

export default MessagesContainer;
