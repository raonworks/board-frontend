import BoardListItemFoo from "components/boardListItem";
import "./App.css";
import {
  commentItemListMock,
  favoriteListMock,
  latestBoardListMock,
} from "mocks";
import { top3BoardListMock } from "mocks";
import Top3Item from "components/Top3Item";
import CommentItem from "components/commentItem";
import FavoriteItem from "components/favoriteItem";
import InputBox from "components/inputbox";
import { useState } from "react";

function App() {
  const [value, setValue] = useState<string>("");

  return (
    <>
      <InputBox
        label="이메일"
        type="text"
        placeholder="이메일 주소를 입력해주세요."
        value={value}
        error={false}
        setValue={setValue}
      />
    </>
  );
}

export default App;
