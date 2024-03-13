import { useEffect, useState } from "react";
import useSpeechToText from "react-hook-speech-to-text";
import "./App.css";

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
    <div className=" right-0 items-center inset-y-0 hidden sm:flex">
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
        onClick={isRecording ? stopSpeechToText : startSpeechToText}
      >
        <span className="font-bold">{isRecording ? "Stop" : "Speak"}</span>
      </button>
    </div>
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
    const response = await fetch("http://18.141.178.175:5002/chatbot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      referrerPolicy: "unsafe-url",
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
      <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col w-[800px] h-screen">
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
          <div className="relative flex gap-2">
            <span className=" inset-y-0 flex items-center">
              <AnyComponent
                sendMessage={sendMessage}
                changeInput={handleChange}
              />
            </span>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Write your message!"
              className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3"
            />
            <div className=" right-0 items-center inset-y-0 hidden sm:flex">
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
            {/* <div className=" right-0 items-center inset-y-0 hidden sm:flex">
              <label
                htmlFor="uploadFile1"
                className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 mr-2 fill-white inline"
                  viewBox="0 0 32 32"
                >
                  <path
                    d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                    data-original="#000000"
                  />
                  <path
                    d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                    data-original="#000000"
                  />
                </svg>
                Upload
                <input
                  type="file"
                  onChange={(e) => onFileChange(e)}
                  id="uploadFile1"
                  className="hidden"
                />
              </label>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
