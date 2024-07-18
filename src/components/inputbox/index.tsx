import { ChangeEvent, forwardRef, KeyboardEvent } from "react";
import "./style.css";

interface PropsType {
  label: string;
  type: "text" | "password";
  placeholder: string;
  value: string;
  error: boolean;
  icon?: "eye-light-off-icon" | "eye-light-on-icon" | "expand-right-light-icon";
  message?: string;
  // setValue: React.Dispatch<React.SetStateAction<string>>;
  // setValue: (value: string) => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onButtonClick?: () => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

const InputBox = forwardRef<HTMLInputElement, PropsType>(
  (props: PropsType, ref) => {
    const { label, type, placeholder, value, error, icon, message } = props;
    const { onChange } = props;
    const { onButtonClick, onKeyDown } = props;

    //handler 키 다운에 대한 이벤트 핸들러
    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
      if (!onKeyDown) return;
      onKeyDown(e);
    };

    return (
      <>
        <div className="inputbox">
          <div className="inputbox-label">{label}</div>
          <div
            className={
              error ? "inputbox-container-error" : "inputbox-container"
            }
          >
            <input
              ref={ref}
              type={type}
              placeholder={placeholder}
              value={value}
              className="input"
              onChange={onChange}
              onKeyDown={onKeyDownHandler}
            />
            {onButtonClick !== undefined && (
              <div className="icon-button" onClick={onButtonClick}>
                {icon !== undefined && <div className={`icon ${icon}`}></div>}
              </div>
            )}
          </div>
          {message !== undefined && (
            <div className="inputbox-message">{message}</div>
          )}
        </div>
      </>
    );
  }
);

export default InputBox;
