import "./App.css";
import { Route, Routes } from "react-router-dom";
import Main from "views/main";
import Authentication from "views/authentication";
import Search from "views/search";
import UserFoo from "views/user";
import BoardDetail from "views/board/detail";
import BoardWrite from "views/board/write";
import BoardUpdate from "views/board/update";
import Container from "container";
import {
  AUTH_PATH,
  BOARD_PATH,
  BOARD_WRITE_PATH,
  MAIN_PATH,
  SEARCH_PATH,
  USER_PATH,
  BOARD_UPDATE_PATH,
  BOARD_DETAIL_PATH,
} from "contants";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useLoginUserStore } from "stores";
import { getSignInUserRequest } from "apis";
import { GetSignInUserResponseDTO } from "apis/response/user";
import { ResponseDTO } from "apis/response";
import { User } from "types/interface";
import TestView from "views/test";

/*
  메인화면: /
  로그인 + 회원가입: /auth
  유저 페이지: /user/:email
  검색: /search/:word
  게시물 상세보기: /board/detail/:boardNumber
  게시물 작성하기: /board/write
  게시물 수정하기: /board/update/:boardNumber
*/

function App() {
  //const 쿠키 값
  const [cookies, setCookie] = useCookies();
  //const 로그인 유저(전역 상태 관리자)
  const { setLoginUser, resetLoginUser } = useLoginUserStore();
  //function 사용자 정보 받아오는 함수
  const getSignInUserResponse = (
    resBody: GetSignInUserResponseDTO | ResponseDTO | null
  ) => {
    if (!resBody) return;

    const { code } = resBody;
    if (code === "AF" || code === "NU" || code === "DBE") {
      resetLoginUser();
      return;
    }

    const loginUser: User = { ...(resBody as GetSignInUserResponseDTO) };
    setLoginUser(loginUser);
  };

  //# 엑세스 토큰 값이 바뀔 때마다 실행.
  useEffect(() => {
    if (!cookies.accessToken) {
      resetLoginUser();
      return;
    }
    getSignInUserRequest(cookies.accessToken).then(getSignInUserResponse);
  }, [cookies.accessToken]);

  return (
    <>
      <Routes>
        <Route path="/tmp" element={<TestView />} />
        <Route element={<Container />}>
          <Route path={MAIN_PATH()} element={<Main />} />
          <Route path={AUTH_PATH()} element={<Authentication />} />
          <Route path={SEARCH_PATH(":word")} element={<Search />} />
          <Route path={USER_PATH(":email")} element={<UserFoo />} />
          <Route path={BOARD_PATH()}>
            <Route path={BOARD_WRITE_PATH()} element={<BoardWrite />} />
            <Route
              path={BOARD_DETAIL_PATH(":boardNumber")}
              element={<BoardDetail />}
            />
            <Route
              path={BOARD_UPDATE_PATH(":boardNumber")}
              element={<BoardUpdate />}
            />
          </Route>
          <Route path="*" element={<h1>404 Not Found.</h1>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
