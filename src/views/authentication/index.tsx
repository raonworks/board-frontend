import { useState, KeyboardEvent, useRef, ChangeEvent } from "react";
import "./style.css";
import InputBox from "components/inputbox";
import { SignInRequestDTO } from "apis/request/auth";
import { signInRequest } from "apis";
import { SignInResponseDTO } from "apis/response/auth";
import { ResponseDTO } from "apis/response";
import { useCookies } from "react-cookie";
import { MAIN_PATH } from "contants";
import { useNavigate } from "react-router-dom";
import { Address, useDaumPostcodePopup } from "react-daum-postcode";

export default function Authentication() {
  //const 화면 상태 변수
  const [view, setView] = useState<"sign-in" | "sign-up">("sign-in");
  //const 쿠키 상태 관리
  const [cookie, setCookie] = useCookies();
  //const 네비게이터 관리
  const navigator = useNavigate();

  //# sign-In card 컴포넌트
  const SignInCard = () => {
    const emailRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);

    //const 이메일 상태 변수
    const [email, setEmail] = useState<string>("");
    //const 비밀번호 상태 변수
    const [password, setPassword] = useState<string>("");
    //const 비밀번호 타입 상태 변수
    const [passwordType, setPasswordType] = useState<"text" | "password">(
      "password"
    );
    //const 비밀번호 버튼 아이콘 상태 변수
    const [passwordButtonIcon, setPasswordButtonIcon] = useState<
      "eye-light-off-icon" | "eye-light-on-icon"
    >("eye-light-off-icon");
    //const 에러 상태 변수
    const [error, setError] = useState<boolean>(false);

    //function 로그인 처리
    const signInResponse = (
      resBody: SignInResponseDTO | ResponseDTO | null
    ) => {
      if (!resBody) {
        alert("네크워크에 문제가 발생했습니다.");
        return;
      }

      const { code } = resBody;
      if (code === "DBE") alert("데이터베이스 오류입니다.");
      if (code === "SF" || code === "VF") setError(true);
      if (code !== "SU") return;

      const { token, expirationTime } = resBody as SignInResponseDTO;
      const now = new Date().getTime();
      const expires = new Date(now + expirationTime * 1000);

      setCookie("accessToken", token, { expires, path: MAIN_PATH() });
      navigator(MAIN_PATH());
    };

    //handler "로그인" 클릭 이벤트 핸들러
    const onSignInButtonClickHandler = () => {
      const requestBody: SignInRequestDTO = { email, password };
      signInRequest(requestBody).then(signInResponse);
    };

    //handler "회원가입" 클릭 이벤트 핸들러
    const onSignUpClickHandler = () => {
      setView("sign-up");
    };

    //handler "비밀번호" 클릭 이벤트 핸들러
    const onPasswordButtonClickHandler = () => {
      if (passwordType === "text") {
        setPasswordType("password");
        setPasswordButtonIcon("eye-light-off-icon");
      } else {
        setPasswordType("text");
        setPasswordButtonIcon("eye-light-on-icon");
      }
    };

    //handler "이메일" 키다운 이벤트 핸들러
    const onEmailKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Enter") return;
      if (!passwordRef.current) return;
      passwordRef.current.focus();
    };

    //handler "비밀번호" 키다운 이벤트 핸들러
    const onPasswordKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Enter") return;
      onSignInButtonClickHandler();
    };

    //handler "이메일" 체인지 핸들러
    const onEmailClickChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
      setError(false);
      const { value } = e.target;
      setEmail(value);
    };

    //handler "비밀번호" 체인지 핸들러
    const onPasswordClickChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
      setError(false);
      const { value } = e.target;
      setPassword(value);
    };

    return (
      <div className="auth-card">
        <div className="auth-card-box">
          {/* //div 상단 부분 */}
          <div className="auth-card-top">
            <div className="auth-card-title-box">
              <div className="auth-card-title">로그인</div>
            </div>
            {/* //element 이메일 주소 입력 */}
            <InputBox
              ref={emailRef}
              label="이메일 주소"
              type="text"
              placeholder="이메일 주소를 입력해주세요"
              error={error}
              value={email}
              onChange={onEmailClickChangeHandler}
              onKeyDown={onEmailKeyDownHandler}
            />
            {/* //element 비밀번호 입력 */}
            <InputBox
              ref={passwordRef}
              label="비밀번호"
              type={passwordType}
              placeholder="비밀번호를 입력해주세요"
              error={error}
              value={password}
              onChange={onPasswordClickChangeHandler}
              icon={passwordButtonIcon}
              onButtonClick={onPasswordButtonClickHandler}
              onKeyDown={onPasswordKeyDownHandler}
            />
          </div>
          {/* //div 하단 부분 */}
          <div className="auth-card-bottom">
            {error && (
              <div className="auth-sign-in-error-box">
                <div className="auth-sign-in-error-message">
                  이메일 주소 또는 비번을 잘못 입력했습니다.
                  <br />
                  입력하신 내용을 다시 확인해주세요.
                </div>
              </div>
            )}
            <div
              className="black-large-full-button"
              onClick={onSignInButtonClickHandler}
            >
              로그인
            </div>
            <div className="auth-desc-box">
              <div className="auth-desc">신규 사용자이신가요?</div>
              {/* //element 회원가입 */}
              <span className="auth-desc-link" onClick={onSignUpClickHandler}>
                회원가입
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  //# sign-Up card 컴포넌트
  const SignUpCard = () => {
    //const 이메일 REF
    const emailRef = useRef<HTMLInputElement | null>(null);
    //const 패스워드 REF
    const passwordRef = useRef<HTMLInputElement | null>(null);
    //const 패스워드 체크 REF
    const passwordCheckRef = useRef<HTMLInputElement | null>(null);
    //const 닉네임 REF
    const nicknameRef = useRef<HTMLInputElement | null>(null);
    //const 휴대전화 REF
    const telNumberRef = useRef<HTMLInputElement | null>(null);
    //const 주소 REF
    const addressRef = useRef<HTMLInputElement | null>(null);
    //const 상세주소 REF
    const addressDescRef = useRef<HTMLInputElement | null>(null);

    //const 페이지 상태 관리
    const [page, setPage] = useState<1 | 2>(2);
    //const 이메일 상태 관리
    const [email, setEmail] = useState<string>("");
    //const 패스워드 상태 관리
    const [password, setPassword] = useState<string>("");
    //const 패스워드 체크 상태 관리
    const [passwordCheck, setPasswordCheck] = useState<string>("");
    //const 패스워드 타입 상태
    const [passwordType, setPasswordType] = useState<"text" | "password">(
      "password"
    );
    //const 패스워드 체크 타입 상태
    const [passwordCheckType, setPasswordCheckType] = useState<
      "text" | "password"
    >("password");
    //const 닉네임 상태
    const [nickname, setNickname] = useState<string>("");
    //const 휴대폰 상태
    const [telNumber, setTelNumber] = useState<string>("");
    //const 주소 상태
    const [address, setAddress] = useState<string>("");
    //const 상세 주소 상태
    const [addressDesc, setAddressDesc] = useState<string>("");
    //const 개인 정보 동의 상태
    const [agreedPersonal, setAgreedPersonal] = useState<boolean>(false);
    //const 이메일 에러 상태
    const [isEmailError, setEmailError] = useState<boolean>(false);
    //const 이메일 에러 상태
    const [isPasswordError, setPasswordError] = useState<boolean>(false);
    //const 이메일 에러 상태
    const [isPasswordCheckError, setPasswordCheckError] =
      useState<boolean>(false);
    //const 이메일 에러 메세지 상태
    const [emailErrorMessage, setEmailErrorMessage] = useState<string>("");
    //const 패스워드 에러 메세지 상태
    const [passwordErrorMessage, setPasswordErrorMessage] =
      useState<string>("");
    //const 패스워드 체크 에러 메세지 상태
    const [passwordCheckErrorMessage, setPasswordCheckErrorMessage] =
      useState<string>("");
    //const 패스워드 버튼 아이콘 상태
    const [passwordButtonIcon, setPasswordButtonIcon] = useState<
      "eye-light-off-icon" | "eye-light-on-icon"
    >("eye-light-off-icon");
    //const 패스워드 확인 버튼 아이콘 상태
    const [passwordCheckButtonIcon, setPasswordCheckButtonIcon] = useState<
      "eye-light-off-icon" | "eye-light-on-icon"
    >("eye-light-off-icon");
    //const 닉네임 에러 상태
    const [isNicknameError, setNicknameError] = useState<boolean>(false);
    //const 휴대폰 번호 에러 상태
    const [isTelNumberError, setTelNumberError] = useState<boolean>(false);
    //const 주소 에러 상태
    const [isAddressError, setAddressError] = useState<boolean>(false);
    //const 개 인정보 동의 에러 상태
    const [isAgreedPersonalError, setAgreedPersonalError] =
      useState<boolean>(false);
    //const 닉네임 에러 메세지 상태
    const [nicknameErrorMessage, setNicknameErrorMessage] =
      useState<string>("");
    //const 휴대폰 번호 에러 메세지 상태
    const [telNumberErrorMessage, setTelNumberErrorMessage] =
      useState<string>("");
    //const 주소 에러 메세지 상태
    const [addressErrorMessage, setAddressErrorMessage] = useState<string>("");

    //function 다음 주소 검색 팝업 오픈 함수
    const open = useDaumPostcodePopup();

    //handler 다음 주소 검색 완료 이벤트
    const onComplete = (data: Address) => {
      const { address } = data;
      setAddress(address);
      if (!addressDescRef.current) return;
      addressDescRef.current.focus();
    };

    //handler "로그인" 클릭 이벤트 핸들러
    const onSignInClickHandler = () => {
      setView("sign-in");
    };
    //handler 이메일 변경 이벤트 처리
    const onEmailChangeHandelr = (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setEmail(value);
      setEmailError(false);
      setEmailErrorMessage("");
    };
    //handler 패스워드 변경 이벤트 처리
    const onPasswordChangeHandelr = (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setPassword(value);
      setPasswordError(false);
      setPasswordErrorMessage("");
    };
    //handler 패스워드 체크 변경 이벤트 처리
    const onPasswordCheckChangeHandelr = (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setPasswordCheck(value);
      setPasswordCheckError(false);
      setPasswordCheckErrorMessage("");
    };
    //handler 패스워드 아이콘 클릭 이벤트 처리
    const onPasswordButtonClickHandler = () => {
      if (passwordButtonIcon === "eye-light-off-icon") {
        setPasswordButtonIcon("eye-light-on-icon");
        setPasswordType("text");
      } else {
        setPasswordButtonIcon("eye-light-off-icon");
        setPasswordType("password");
      }
    };
    //handler 패스워드 확인 아이콘 클릭 이벤트 처리
    const onPasswordCheckButtonClickHandler = () => {
      if (passwordCheckButtonIcon === "eye-light-off-icon") {
        setPasswordCheckButtonIcon("eye-light-on-icon");
        setPasswordCheckType("text");
      } else {
        setPasswordCheckButtonIcon("eye-light-off-icon");
        setPasswordCheckType("password");
      }
    };
    //handler 다음 단계 버튼 이벤트 처리
    const onNextButtonClickHandler = () => {
      const emailPattern =
        /^[a-zA-Z0-9]*@([-.]?[a-zA-Z0-9])*\.[a-zA-Z0-9]{2,4}$/;
      const isEmailPattern = emailPattern.test(email);
      if (!isEmailPattern) {
        setEmailError(true);
        setEmailErrorMessage("이메일 주소 포멧이 맞지 않습니다.");
      }
      const isCheckedPassword = password.trim().length > 8;
      if (!isCheckedPassword) {
        setPasswordError(true);
        setPasswordErrorMessage("비밀번호는 8자 이상 입력해주세요.");
      }
      const isEqualPassword = password === passwordCheck;
      if (!isEqualPassword) {
        setPasswordCheckError(true);
        setPasswordCheckErrorMessage("비밀번호가 일치하지 않습니다.");
      }
      if (!isEmailPattern || !isCheckedPassword || !isEqualPassword) return;

      setPage(2);
    };
    //handler 이메일 키 다운 이벤트 처리
    const onEmailKeydownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Enter") return;
      if (!passwordRef.current) return;
      passwordRef.current.focus();
    };
    //handler 패스워드 키 다운 이벤트 처리
    const onPasswordKeydownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Enter") return;
      if (!passwordCheckRef.current) return;
      passwordCheckRef.current.focus();
    };
    //handler 패스워크 확인 키 다운 이벤트 처리
    const onPasswordCheckKeydownHandler = (
      e: KeyboardEvent<HTMLInputElement>
    ) => {
      if (e.key !== "Enter") return;
      if (!nicknameRef.current) return;
      onNextButtonClickHandler();
      nicknameRef.current.focus();
    };
    //handler 닉네임 변경 이벤트
    const onNicknameChangeHandelr = (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setNickname(value);
      setNicknameError(false);
      setNicknameErrorMessage("");
    };
    //handler 휴대폰 변경 이벤트
    const onTelNumberChangeHandelr = (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setTelNumber(value);
      setTelNumberError(false);
      setTelNumberErrorMessage("");
    };
    //handler 주소 변경 이벤트
    const onAddressChangeHandelr = (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setAddress(value);
      setAddressError(false);
      setAddressErrorMessage("");
    };
    //handler 상세 주소 변경 이벤트
    const onAddressDescChangeHandelr = (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setAddressDesc(value);
    };
    //handler 닉네임 키다운 이벤트
    const onNicknameKeydownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Enter") return;
      if (!telNumberRef.current) return;
      telNumberRef.current.focus();
    };
    //handler 휴대폰 번호 키다운 이벤트
    const onTelNumberKeydownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Enter") return;
      onAddressButtonClickHandler();
    };
    //handler 주소 키다운 이벤트
    const onAddressKeydownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Enter") return;
      if (!addressDescRef.current) return;
      addressDescRef.current.focus();
    };
    //handler 상세주소 키다운 이벤트
    const onAddressDescKeydownHandler = (
      e: KeyboardEvent<HTMLInputElement>
    ) => {
      if (e.key !== "Enter") return;
      onSignUpButtonClickHandler();
    };
    //handler 주소 버튼 클릭 이벤트
    const onAddressButtonClickHandler = () => {
      open({ onComplete });
    };
    //handler 회원가입 버튼 클릭 이벤트
    const onSignUpButtonClickHandler = () => {
      alert("회원 가입 버튼 클립!");
    };
    //handler 개인정보동의 클릭 이벤트
    const onAgreedPersonalClickHandler = () => {
      setAgreedPersonal(!agreedPersonal);
      setAgreedPersonalError(false);
    };

    return (
      <div className="auth-card">
        <div className="auth-card-box">
          {/* //div 상단 부분 */}
          <div className="auth-card-top">
            <div className="auth-card-title-box">
              <div className="auth-card-title">회원가입</div>
              <div className="auth-card-page">{page}/2</div>
            </div>
            {/* //element 페이지가 1일 경우 */}
            {page === 1 && (
              <>
                <InputBox
                  ref={emailRef}
                  label="이메일 주소*"
                  value={email}
                  type="text"
                  placeholder="이메일 주소를 입력해주세요."
                  error={isEmailError}
                  message={emailErrorMessage}
                  onChange={onEmailChangeHandelr}
                  onKeyDown={onEmailKeydownHandler}
                />
                <InputBox
                  ref={passwordRef}
                  label="비밀번호*"
                  value={password}
                  type={passwordType}
                  placeholder="비밀번호를 입력해주세요."
                  onChange={onPasswordChangeHandelr}
                  error={isPasswordError}
                  message={passwordErrorMessage}
                  icon={passwordButtonIcon}
                  onButtonClick={onPasswordButtonClickHandler}
                  onKeyDown={onPasswordKeydownHandler}
                />
                <InputBox
                  ref={passwordCheckRef}
                  label="비밀번호 확인*"
                  value={passwordCheck}
                  type={passwordCheckType}
                  placeholder="비밀번호를 다시 입력해주세요."
                  onChange={onPasswordCheckChangeHandelr}
                  error={isPasswordCheckError}
                  message={passwordCheckErrorMessage}
                  icon={passwordCheckButtonIcon}
                  onButtonClick={onPasswordCheckButtonClickHandler}
                  onKeyDown={onPasswordCheckKeydownHandler}
                />
              </>
            )}
            {/* //element 페이지가 2일 경우 */}
            {page === 2 && (
              <>
                <InputBox
                  ref={nicknameRef}
                  label="닉네임*"
                  type="text"
                  value={nickname}
                  placeholder="닉네임을 입력해주세요."
                  error={isNicknameError}
                  message={nicknameErrorMessage}
                  onChange={onNicknameChangeHandelr}
                  onKeyDown={onNicknameKeydownHandler}
                />
                <InputBox
                  ref={telNumberRef}
                  label="휴대폰*"
                  type="text"
                  value={telNumber}
                  placeholder="휴대폰 번호를 입력해주세요."
                  error={isTelNumberError}
                  message={telNumberErrorMessage}
                  onChange={onTelNumberChangeHandelr}
                  onKeyDown={onTelNumberKeydownHandler}
                />
                <InputBox
                  ref={addressRef}
                  label="주소*"
                  type="text"
                  value={address}
                  placeholder="주소를 입력해주세요."
                  onChange={onAddressChangeHandelr}
                  icon="expand-right-light-icon"
                  error={isAddressError}
                  message={addressErrorMessage}
                  onButtonClick={onAddressButtonClickHandler}
                  onKeyDown={onAddressKeydownHandler}
                />
                <InputBox
                  ref={addressDescRef}
                  label="상세 주소"
                  value={addressDesc}
                  type="text"
                  placeholder="상세 주소를 입력해주세요."
                  error={false}
                  onChange={onAddressDescChangeHandelr}
                  onKeyDown={onAddressDescKeydownHandler}
                />
              </>
            )}
          </div>
          {/* //div 하단 부분 */}
          <div className="auth-card-bottom">
            {/* //element 페이지가 1일 경우 */}
            {page === 1 && (
              <div
                className="black-large-full-button"
                onClick={onNextButtonClickHandler}
              >
                다음 단계
              </div>
            )}
            {/* //element 페이지가 2일 경우 */}
            {page === 2 && (
              <>
                <div className="auth-consent-box">
                  <div
                    className="auth-check-box"
                    onClick={onAgreedPersonalClickHandler}
                  >
                    <div
                      className={`icon ${
                        agreedPersonal
                          ? "check-round-fill-icon"
                          : "check-ring-light-icon"
                      }`}
                    ></div>
                  </div>
                  <div
                    className={
                      isAgreedPersonalError
                        ? "auth-consent-title-error"
                        : "auth-consent-title"
                    }
                  >
                    개인정보동의
                  </div>
                  <div className="auth-consent-link">{"더보기 >"}</div>
                </div>
                <div
                  className="black-large-full-button"
                  onClick={onSignUpButtonClickHandler}
                >
                  회원가입
                </div>
              </>
            )}
            <div className="auth-desc-box">
              <div className="auth-desc">
                이미 계정이 있으신가요?{" "}
                <span className="auth-desc-link" onClick={onSignInClickHandler}>
                  로그인
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div id="auth-wrapper">
        {/* //comment 그리드 레이아웃 */}
        <div className="auth-container">
          <div className="auth-jumbotron-box">
            <div className="auth-jumbotron-content">
              <div className="auth-logo-icon"></div>
              <div className="auth-jumbotron-text-box">
                <div className="auth-jumbotron-text">환영합니다.</div>
                <div className="auth-jumbotron-text">
                  NOMAD-CODING 보드입니다.
                </div>
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
