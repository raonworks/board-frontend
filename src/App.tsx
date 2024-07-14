import BoardListItemFoo from "components/boardListItem";
import "./App.css";
import { latestBoardListMock } from "mocks";

function App() {
  return (
    <>
      {latestBoardListMock.map((item) => (
        <BoardListItemFoo key={item.boardNumber} boardListItem={item} />
      ))}
    </>
  );
}

export default App;
