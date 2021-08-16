import "./styles.scss";
import { useState } from "react";
import { toast } from "react-toastify";
import { toastConfig } from "../../config/toastConfig";

type RoomCodeProps = {
  code: string;
};

function RoomCode(props: RoomCodeProps) {
  const [copyImage, setCopyImage] = useState(false);

  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(props.code);

    changeCopyImage();
  }

  function changeCopyImage() {
    setCopyImage(true);

    setTimeout(() => {
      setCopyImage(false);
    }, 1000);

    toast.success("Code room copied!", toastConfig);
  }

  return (
    <button className="room-code" onClick={copyRoomCodeToClipboard}>
      <div>
        <svg
          enable-background="new 0 0 128 128"
          height="24px"
          id="Layer_1"
          version="1.1"
          viewBox="0 0 128 128"
          width="24px"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M88,24H16C7.164,24,0,31.164,0,40v72c0,8.836,7.164,16,16,16h72c8.836,0,16-7.164,16-16V40    C104,31.164,96.836,24,88,24z M96,112c0,4.414-3.586,8-8,8H16c-4.41,0-8-3.586-8-8V40c0-4.414,3.59-8,8-8h72c4.414,0,8,3.586,8,8    V112z"
            fill="#FFF"
          />
          {!copyImage && (
            <>
              <path d="M24,56h56v-8H24V56z" fill="#FFF" />
              <path d="M24,72h56v-8H24V72z" fill="#FFF" />
              <path d="M24,88h56v-8H24V88z" fill="#FFF" />
              <path d="M24,104h32v-8H24V104z" fill="#FFF" />
            </>
          )}

          <path
            d="M112,0H40c-8.836,0-16,7.164-16,16h8c0-4.414,3.59-8,8-8h72c4.414,0,8,3.586,8,8v72c0,4.414-3.586,8-8,8v8  c8.836,0,16-7.164,16-16V16C128,7.164,120.836,0,112,0z"
            fill="#FFF"
          />
        </svg>
      </div>
      <span>Sala {props.code}</span>
    </button>
  );
}

export { RoomCode };
