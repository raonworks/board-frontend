import BoardListItemFoo from "components/boardListItem";
import "./App.css";
import { latestBoardListMock } from "mocks";
import { top3BoardListMock } from "mocks";
import Top3Item from "components/Top3Item";

function App() {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "center", gap: "24px" }}>
        {top3BoardListMock.map((item) => (
          <Top3Item key={item.boardNumber} props={item} />
        ))}
      </div>
    </>
  );
}

export default App;
