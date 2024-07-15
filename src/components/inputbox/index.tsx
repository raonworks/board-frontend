import { ChangeEvent, forwardRef, KeyboardEvent } from "react";
import "./style.css";

interface PropsType {
  label: string;
  type: "text" | "password";
  placeholder: string;
  value: string;
  error: boolean;
  icon?: string;
  message?: string;
  //setValue: React.Dispatch<React.SetStateAction<string>>;
  setValue: (value: string) => void;
  onButtonClick?: () => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

const InputBox = forwardRef<HTMLInputElement, PropsType>(
  (props: PropsType, ref) => {
    const { label, type, placeholder, value, error, icon, message } = props;
    const { setValue } = props;
    const { onButtonClick, onKeyDown } = props;

    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setValue(value);
    };

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
              onChange={onChangeHandler}
              onKeyDown={onKeyDownHandler}
            />
            {onButtonClick !== undefined && (
              <div className="icon-button">
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

// export default InputBox;

// import { ChangeEvent, forwardRef, KeyboardEvent } from "react";
// import "./style.css";

// interface PropsType {
//   label: string;
//   type: "text" | "password";
//   placeholder: string;
//   value: string;
//   error: boolean;
//   icon?: string;
//   message?: string;
//   //setValue: React.Dispatch<React.SetStateAction<string>>;
//   setValue: (value: string) => void;
//   onButtonClick?: () => void;
//   onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
// }

// const InputBox = function (props: PropsType) {
//   const { label, type, placeholder, value, error, icon, message } = props;
//   const { setValue } = props;
//   const { onButtonClick, onKeyDown } = props;

//   const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
//     const { value } = event.target;
//     setValue(value);
//   };

//   const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
//     if (!onKeyDown) return;
//     onKeyDown(e);
//   };

//   return (
//     <>
//       <div className="inputbox">
//         <div className="inputbox-label">{label}</div>
//         <div
//           className={error ? "inputbox-container-error" : "inputbox-container"}
//         >
//           <input
//             // ref={ref}
//             type={type}
//             placeholder={placeholder}
//             value={value}
//             className="input"
//             onChange={onChangeHandler}
//             onKeyDown={onKeyDownHandler}
//           />
//           {onButtonClick !== undefined && (
//             <div className="icon-button">
//               {icon !== undefined && <div className={`icon ${icon}`}></div>}
//             </div>
//           )}
//         </div>
//         {message !== undefined && (
//           <div className="inputbox-message">
//             비밀번호는 8자 이상 입력해주세요.
//           </div>
//         )}
//       </div>
//     </>
//   );
// };
// // );

export default InputBox;