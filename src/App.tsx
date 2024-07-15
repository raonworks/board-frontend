import "./App.css";
import { Route, Routes } from "react-router-dom";
import Main from "views/main";
import Authentication from "views/authentication";
import Search from "views/search";
import User from "views/user";
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
} from "contants";

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
  return (
    <>
      <Routes>
        <Route element={<Container />}>
          <Route path={MAIN_PATH()} element={<Main />} />
          <Route path={AUTH_PATH()} element={<Authentication />} />
          <Route path={SEARCH_PATH(":word")} element={<Search />} />
          <Route path={USER_PATH(":email")} element={<User />} />
          <Route path={BOARD_PATH()}>
            <Route path={BOARD_WRITE_PATH()} element={<BoardWrite />} />
            <Route
              path={BOARD_UPDATE_PATH(":boardNumber")}
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
