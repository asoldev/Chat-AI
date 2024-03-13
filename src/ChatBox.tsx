import { RecordingData, VoiceRecorder } from "capacitor-voice-recorder";
import { useEffect, useRef, useState } from "react";
import * as icon from "react-loader-spinner";
import Audio from "./Audio";
import MessagesContainer from "./MessagesContainer";
import { apiSendMessage, apiSendSpeechToText } from "./api";
import { TChatsHistories } from "./type";

const mimeType = "audio/wav";
function base64ToArrayBuffer(base64: string) {
  var binaryString = atob(base64);
  var bytes = new Uint8Array(binaryString.length);
  for (var i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

function ChatBox() {
  const [chatsHistories, setChatsHistories] = useState<TChatsHistories[]>([]);
  const [audioSrc, setAudioSrc] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const speakerRef = useRef<HTMLAudioElement | null>(null);

  const addMessageToHistories = (message: TChatsHistories) => {
    return setChatsHistories((pre) => [...pre, message]);
  };

  const sendMessage = async (text: string) => {
    addMessageToHistories({ content: text, isBot: false });
    setIsLoading(true);
    const messageRes = await apiSendMessage(text);
    addMessageToHistories(messageRes);
    setIsLoading(false);
    setAudioSrc(messageRes.audioUrl);
  };

  const startRecording = async (): Promise<void> => {
    await VoiceRecorder.requestAudioRecordingPermission();
    await VoiceRecorder.startRecording();
    setIsRecording(true);
  };

  const stopRecording = async (): Promise<void> => {
    setIsRecording(false);
    const result: RecordingData = await VoiceRecorder.stopRecording();
    const arrayBuffer = base64ToArrayBuffer(result.value.recordDataBase64);
    const blob = new Blob([arrayBuffer], {
      type: "audio/wav",
    });
    const audioFile = new File([blob], "recordedAudio.wav", {
      type: mimeType,
    });
    const formData = new FormData();
    formData.append("file", audioFile);
    const messageRes = await apiSendSpeechToText(formData);
    sendMessage(messageRes.content);
  };

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      sendMessage(inputValue);
      setInputValue("");
    }
  };

  useEffect(() => {
    setTimeout(() => {
      speakerRef.current && speakerRef.current.play();
    }, 500);
  }, [audioSrc]);
  return (
    <>
      <audio className="hidden" src={audioSrc} ref={speakerRef} />
      <div
        className="flex-1 p:2 sm:p-6 justify-between 
        flex flex-col w-[800px] h-screen"
      >
        <div
          id="style-1"
          className="flex flex-col space-y-4 p-3 overflow-y-auto scrolling-touch"
        >
          <MessagesContainer isLoading={isLoading} messages={chatsHistories} />
        </div>

        <div className=" border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
          <div className="relative flex gap-2">
            <div className="relative w-[100%]">
              <div className="absolute top-1/2 right-1 transform -translate-x-1/2 -translate-y-1/2">
                {isRecording && (
                  <icon.Audio
                    height="24"
                    width="24"
                    color="#4fa94d"
                    ariaLabel="audio-loading"
                    wrapperClass="wrapper-class"
                    visible={true}
                  />
                )}
              </div>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleKeyPress(e);
                }}
                placeholder="Write your message!"
                className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 px-6 bg-gray-200 rounded-md py-3"
              />
            </div>
            <span className=" inset-y-0 flex items-center">
              <Audio
                isRecording={isRecording}
                startRecording={startRecording}
                stopRecording={stopRecording}
              />
            </span>
            <div className=" right-0 items-center inset-y-0 hidden sm:flex">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
                onClick={() => {
                  sendMessage(inputValue);
                  setInputValue("");
                }}
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

export default ChatBox;
