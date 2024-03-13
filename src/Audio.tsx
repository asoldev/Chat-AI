interface IAudio {
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
}

function Audio(props: IAudio) {
  return (
    <>
      <div className=" right-0 items-center inset-y-0 hidden sm:flex">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
          onClick={() => {
            if (props.isRecording) return props.stopRecording();
            return props.startRecording();
          }}
        >
          <i className="ri-mic-line"></i>
        </button>
      </div>
    </>
  );
}

export default Audio;
