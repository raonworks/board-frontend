import "./style.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  AUTH_PATH,
  BOARD_DETAIL_PATH,
  BOARD_UPDATE_PATH,
  BOARD_WRITE_PATH,
  MAIN_PATH,
  SEARCH_PATH,
  USER_PATH,
} from "contants";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useBoardStore, useLoginUserStore } from "stores";
import { BOARD_PATH } from "../../contants/index";

export default function Header() {
  //로고를 클릭하면 메인으로 가도록 설정
  const navigator = useNavigate();
  const onClickLogoHandler = () => {
    navigator(MAIN_PATH());
  };

  const [cookie, setCookie] = useCookies();
  const [isLogin, setLogin] = useState<boolean>(false);
  const { loginUser, setLoginUser, resetLoginUser } = useLoginUserStore();

  //path 상태
  const { pathname } = useLocation();
  const isMainPage = pathname === MAIN_PATH();
  const isAuthPage = pathname.startsWith(AUTH_PATH());
  const isSearchPage = pathname.startsWith(SEARCH_PATH(""));
  const isBoardDetailPage = pathname.startsWith(
    BOARD_PATH() + "/" + BOARD_DETAIL_PATH("")
  );
  const isBoardWritePage = pathname.startsWith(
    BOARD_PATH() + "/" + BOARD_WRITE_PATH()
  );
  const isBoardUpdatePage = pathname.startsWith(
    BOARD_PATH() + "/" + BOARD_UPDATE_PATH("")
  );
  const isUserPage = pathname.startsWith(USER_PATH(""));

  console.log(pathname);

  //검색 버튼
  const SearchButton = () => {
    const [status, setStatus] = useState<boolean>(false);
    const [searchWord, setSearchWord] = useState<string>("");
    const searchWordRef = useRef<HTMLDivElement | null>(null);
    const { word } = useParams();

    const onChangeSearchWordChangeHandler = (
      e: ChangeEvent<HTMLInputElement>
    ) => {
      const value = e.target.value;
      setSearchWord(value);
    };

    const onKeydownSearchWordHandler: React.KeyboardEventHandler<
      HTMLInputElement
    > = (e) => {
      if (e.key !== "Enter") return;
      searchWordRef.current?.click();
    };

    const onClickSearchButtonHandler = () => {
      if (!status) {
        setStatus(!status);
        return;
      }
      navigator(SEARCH_PATH(searchWord));
    };

    useEffect(() => {
      if (word) {
        setSearchWord(word);
        setStatus(true);
      }
    }, [word]);

    if (!status)
      return (
        <div className="icon-button" onClick={onClickSearchButtonHandler}>
          <div className="icon search-light-icon"></div>
        </div>
      );

    return (
      <div className="header-search-input-box">
        <input
          className="header-search-input"
          type="text"
          value={searchWord}
          onChange={onChangeSearchWordChangeHandler}
          onKeyDown={onKeydownSearchWordHandler}
          placeholder="검색어를 입력해주세요."
        />
        <div
          ref={searchWordRef}
          className="icon-button"
          onClick={onClickSearchButtonHandler}
        >
          <div className="icon search-light-icon"></div>
        </div>
      </div>
    );
  };

  //로그인 버튼
  const MyPageButton = () => {
    const { email } = useParams();

    //마이페이지 클릭 이벤트 핸들러
    const onClickMyPageHandler = () => {
      if (!loginUser) return;
      const { email } = loginUser;
      navigator(USER_PATH(email));
    };

    const onClickSignInHandler = () => {
      navigator(AUTH_PATH());
    };

    const onClickSignOutHandler = () => {
      resetLoginUser();
      navigator(MAIN_PATH());
    };

    if (isLogin && loginUser?.email === email)
      return (
        <div className="white-button" onClick={onClickSignOutHandler}>
          로그아웃
        </div>
      );

    if (isLogin)
      return (
        <div className="white-button" onClick={onClickMyPageHandler}>
          마이페이지
        </div>
      );

    return (
      <div className="black-button" onClick={onClickSignInHandler}>
        로그인
      </div>
    );
  };

  //업로드 버튼
  const UploadButton = () => {
    const { title, content, boardImageFileList, resetBoard } = useBoardStore();
    const onUploadButtonClickHandler = () => {};

    if (title && content)
      return (
        <div className="black-button" onClick={onUploadButtonClickHandler}>
          업로드
        </div>
      );
    return <div className="disable-button">업로드</div>;
  };

  return (
    <>
      <div id="header">
        <div className="header-container">
          <div className="header-left-box" onClick={onClickLogoHandler}>
            <div className="icon-box">
              <div className="icon logo-light-icon" />
            </div>
            <div className="header-logo">SPRING&REACT</div>
          </div>
          <div className="header-right-box">
            {(isAuthPage ||
              isMainPage ||
              isSearchPage ||
              isBoardDetailPage) && <SearchButton />}
            {(isMainPage ||
              isSearchPage ||
              isBoardDetailPage ||
              isUserPage) && <MyPageButton />}
            {(isBoardWritePage || isBoardUpdatePage) && <UploadButton />}
          </div>
        </div>
      </div>
    </>
  );
}
