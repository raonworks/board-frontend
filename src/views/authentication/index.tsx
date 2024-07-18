import { useState, KeyboardEvent, useRef } from "react";
import "./style.css";
import InputBox from "components/inputbox";

export default function Authentication() {
  // 화면 상태
  const [view, setView] = useState<"sign-in" | "sign-up">("sign-in");

  //# sign-In card 컴포넌트
  const SignInCard = () => {
    const emailRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordType, setPasswordType] = useState<"text" | "password">(
      "password"
    );
    const [passwordButtonIcon, setPasswordButtonIcon] = useState<
      "eye-light-off-icon" | "eye-light-on-icon"
    >("eye-light-off-icon");
    const [error, setError] = useState<boolean>(false);

    //- 이벤트 핸들러
    const onSignInButtonClickHandler = () => {};

    const onPasswordButtonClickHandler = () => {
      if (passwordType === "text") {
        setPasswordType("password");
        setPasswordButtonIcon("eye-light-off-icon");
      } else {
        setPasswordType("text");
        setPasswordButtonIcon("eye-light-on-icon");
      }
    };

    const onEmailKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Enter") return;
      if (!passwordRef.current) return;
      passwordRef.current.focus();
    };

    const onPasswordKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Enter") return;
      onSignInButtonClickHandler();
    };

    return (
      <div className="auth-card">
        <div className="auth-card-box">
          {/* //- 상단 부분 */}
          <div className="auth-card-top">
            <div className="auth-card-title-box">
              <div className="auth-card-title">로그인</div>
            </div>
            {/* //- 이메일 주소 입력 */}
            <InputBox
              ref={emailRef}
              label="이메일 주소"
              type="text"
              placeholder="이메일 주소를 입력해주세요"
              error={error}
              value={email}
              setValue={setEmail}
              onKeyDown={onEmailKeyDownHandler}
            />
            {/* //- 비밀번호 입력 */}
            <InputBox
              ref={passwordRef}
              label="비밀번호"
              type={passwordType}
              placeholder="비밀번호를 입력해주세요"
              error={error}
              value={password}
              setValue={setPassword}
              icon={passwordButtonIcon}
              onButtonClick={onPasswordButtonClickHandler}
              onKeyDown={onPasswordKeyDownHandler}
            />
          </div>
          {/* //- 하단 부분 */}
          <div className="auth-card-bottom">
            <div className="auth-sign-in-error-box">
              <div className="auth-sign-in-error-message">
                이메일 주소 또는 비밀번호를 잘못 입력했습니다.
                <br />
                입력하신 내용을 다시 확인해주세요.
              </div>
            </div>
            <div
              className="black-large-full-button"
              onClick={onSignInButtonClickHandler}
            >
              로그인
            </div>
            <div className="auth-desc-box">
              <div className="auth-desc">신규 사용자이신가요?</div>
              <span className="auth-desc-link">회원가입</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  //# sign-Up card 컴포넌트
  const SignUpCard = () => {
    return <div className="auth-card"></div>;
  };

  return (
    <>
      <div id="auth-wrapper">
        <div className="auth-container">
          <div className="auth-jumbotron-box">
            <div className="auth-jumbotron-content">
              <div className="auth-logo-icon"></div>
              <div className="auth-jumbotron-text-box">
                <div className="auth-jumbotron-text">환영합니다.</div>
                <div className="auth-jumbotron-text">HARLOCK 보드입니다.</div>
              </div>
            </div>
          </div>
          {view === "sign-in" && <SignInCard />}
          {view === "sign-up" && <SignUpCard />}
        </div>
      </div>
    </>
  );
}
