import { useEffect, useRef, useState } from "react";
import useSpeechToText from "react-hook-speech-to-text";
import * as icon from "react-loader-spinner";
import "./App.css";

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

function Voice({ sendMessage, changeInput, setIsSpeek }: any) {
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
    setIsSpeek(isRecording);
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
    <>
      <div className=" right-0 items-center inset-y-0 hidden sm:flex">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
          onClick={isRecording ? stopSpeechToText : startSpeechToText}
        >
          <i className="ri-mic-line"></i>
        </button>
      </div>
    </>
  );
}

function App() {
  const [dataset, setDataset] = useState<any>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [srcAudio, setSrcAudio] = useState("");
  const [isSpeek, setIsSpeek] = useState<boolean>(false);
  const speakerRef = useRef<HTMLAudioElement | null>(null);

  const divRef = useRef<any>(null);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollIntoView({ behavior: "smooth" });
    }
  });

  const sendMessage = async (question: string) => {
    setInputValue("");
    setIsLoading(true);

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
    setSrcAudio(json.audioUrl);
    setIsLoading(false);
  };

  const handleSetData = (data: any) => {
    return setDataset((pre: any) => [...pre, data]);
  };
  const handleChange = (value: string) => {
    setInputValue(value);
  };

  useEffect(() => {
    setTimeout(() => {
      speakerRef.current && speakerRef.current.play();
    }, 500);
  }, [srcAudio]);
  return (
    <>
      <h2>Chat AI</h2>
      <audio className="hidden" src={srcAudio} ref={speakerRef} />
      <div
        className="flex-1 p:2 sm:p-6 justify-between 
        flex flex-col w-[800px] h-screen"
      >
        <div
          id="style-1"
          className="flex flex-col space-y-4 p-3 overflow-y-auto scrolling-touch"
        >
          {dataset.map((item: any) =>
            item.isActive === true ? (
              <div className="chat-message" key={item}>
                <div className="flex items-end">
                  <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                    <div>
                      <span
                        ref={divRef}
                        className=" px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600"
                      >
                        <Typewriter text={item.text} delay={30} />
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
                      <span className=" px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
                        <p>{item.text}</p>
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

          {isLoading ? (
            <div className="chat-message">
              <div className="flex items-end">
                <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                  <div>
                    <span className=" px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
                      <icon.ThreeDots
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
          ) : null}
        </div>

        <div className=" border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
          <div className="relative flex gap-2">
            <div className="relative w-[100%]">
              <div className="absolute top-1/2 right-1 transform -translate-x-1/2 -translate-y-1/2">
                {isSpeek ? (
                  <icon.Audio
                    height="24"
                    width="24"
                    color="#4fa94d"
                    ariaLabel="audio-loading"
                    wrapperStyle={{}}
                    wrapperClass="wrapper-class"
                    visible={true}
                  />
                ) : null}
              </div>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="Write your message!"
                className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 px-6 bg-gray-200 rounded-md py-3"
              />
            </div>
            <span className=" inset-y-0 flex items-center">
              <Voice
                sendMessage={sendMessage}
                changeInput={handleChange}
                setIsSpeek={setIsSpeek}
              />
            </span>
            <div className=" right-0 items-center inset-y-0 hidden sm:flex">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
                onClick={() => sendMessage(inputValue)}
              >
                <i className="ri-send-plane-2-line"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
