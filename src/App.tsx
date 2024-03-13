import { useEffect, useState } from "react";
import "./App.css";
import useSpeechToText from "react-hook-speech-to-text";

function AnyComponent({ sendMessage, changeInput }: any) {
  const {
    error,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;

  useEffect(() => {
    if (isRecording === false && results.length > 0) {
      const result: any = results[results.length - 1];
      stopSpeechToText();
      sendMessage(result["transcript"]);
      setResults([]);
    }
  }, [isRecording]);

  useEffect(() => {
    changeInput(...results.map((item: any) => item.transcript));
  }, [results]);
  return (
    <svg
      onClick={isRecording ? stopSpeechToText : startSpeechToText}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="h-6 w-6 text-gray-600"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
      ></path>
    </svg>
  );
}
function App() {
  const [dataset, setDataset] = useState<any>([]);
  const [inputValue, setInputValue] = useState("");

  const sendMessage = async (question: string) => {
    setInputValue("");

    if (!question || question === "") {
      return;
    }

    handleSetData({
      isActive: false,
      text: question,
    });

    const param = {
      question,
    };
    const response = await fetch("http://localhost:3000/chatbot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(param),
    });

    const json = await response.json();

    handleSetData({
      isActive: true,
      text: json.answer,
    });
    new Audio(json.audioUrl).play();
  };

  const handleSetData = (data: any) => {
    return setDataset((pre: any) => [...pre, data]);
  };
  const handleChange = (value: string) => {
    setInputValue(value);
  };

  return (
    <>
      <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col w-[500px] h-screen">
        <div
          id="messages"
          className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
        >
          {dataset.map((item: any) =>
            item.isActive === true ? (
              <div className="chat-message" key={item}>
                <div className="flex items-end">
                  <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                    <div>
                      <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
                        {item.text}
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
              <div className="chat-message" key={item}>
                <div className="flex items-end justify-end">
                  <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                    <div>
                      <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
                        {item.text}
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
        </div>

        <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
          <div className="relative flex">
            <span className="absolute inset-y-0 flex items-center">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
              >
                <AnyComponent
                  sendMessage={sendMessage}
                  changeInput={handleChange}
                />
              </button>
            </span>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Write your message!"
              className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3"
            />
            <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
                onClick={() => sendMessage(inputValue)}
              >
                <span className="font-bold">Send</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-6 w-6 ml-2 transform rotate-90"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
