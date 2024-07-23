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
import { fileUploadRequest, postBoardRequest } from "apis";
import { PostBoardRequestDTO } from "apis/request/board";
import { PostBoardResponseDTO } from "apis/response/board";
import { ResponseDTO } from "apis/response";

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

  // console.log(pathname);

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

    useEffect(() => {}, []);

    useEffect(() => {
      setLogin(loginUser !== null);
    }, []);

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
      setCookie("accessToken", "", { path: MAIN_PATH(), expires: new Date() });
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

  //#업로드 버튼
  const UploadButton = () => {
    const { title, content, boardImageFileList, resetBoard } = useBoardStore();

    //function
    const postBoardResponse = (
      res: PostBoardResponseDTO | ResponseDTO | null
    ) => {
      if (!res) return;

      const { code } = res;
      if (code === "AF" || code === "NU") navigator(AUTH_PATH());
      if (code === "VF") alert("제목과 내용은 필수입니다.");
      if (code === "DBE") alert("데이터베이스 오류입니다.");
      if (code !== "SU") return;

      resetBoard();
      if (!loginUser) return;
      const { email } = loginUser;
      navigator(USER_PATH(email));
    };

    //function 업로드 버튼 클릭 이벤트
    const onUploadButtonClickHandler = async () => {
      const accessToken = cookie.accessToken;
      if (!accessToken) return;

      //comment 파일 업로드
      const boardImageList: string[] = [];
      for (const file of boardImageFileList) {
        const data = new FormData();
        data.append("file", file);
        const url = await fileUploadRequest(data);
        if (url) boardImageList.push(url);
      }

      //게시물 정보 등록
      const req: PostBoardRequestDTO = {
        title,
        content,
        boardImageList,
      };
      postBoardRequest(req, accessToken).then(postBoardResponse);
    };

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
