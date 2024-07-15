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

function App() {
  return (
    <>
      <div
        style={{
          padding: "0 20px",
          display: "flex",
          flexDirection: "row",
          columnGap: "30px",
          rowGap: "20px",
        }}
      >
        {/* {commentItemListMock.map((item) => (
          <CommentItem commentItemList={item} />
        ))} */}
        {favoriteListMock.map((item) => (
          <FavoriteItem favoriteListItem={item} />
        ))}
      </div>
    </>
  );
}

export default App;
