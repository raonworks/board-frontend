import { BoardListItem } from "types/interface";
import "./style.css";
import { useNavigate } from "react-router-dom";
import EmptyProfileImage from "assets/images/empty_profile.jpg";

interface PropsType {
  boardListItem: BoardListItem;
}

export default function BoardListItemFoo({ boardListItem }: PropsType) {
  const { boardNumber, title, content, boardTitleImage } = boardListItem;
  const { favoriteCount, commentCount, viewCount } = boardListItem;
  const { writeDatetime, writeNickname, writeProfileImage } = boardListItem;

  // const navigator = useNavigate();
  const onClickHandler = () => {
    // navigator(boardNumber);
  };

  return (
    <>
      <div className="board-list-item" onClick={onClickHandler}>
        <div className="board-list-item-main-box">
          {/* top section */}
          <div className="board-list-item-top">
            <div className="board-list-item-profile-box">
              <div
                className="board-list-item-profile-image"
                style={{
                  backgroundImage: `url(${
                    writeProfileImage ?? EmptyProfileImage
                  })`,
                }}
              ></div>
            </div>
            <div className="board-list-item-write-box">
              <div className="board-list-item-nickname">{writeNickname}</div>
              <div className="board-list-item-write-datetime">
                {writeDatetime}
              </div>
            </div>
          </div>
          {/* middle section */}
          <div className="board-list-item-middle">
            <div className="board-list-item-title">{title}</div>
            <div className="board-list-item-content">{content}</div>
          </div>
          {/* bottom section */}
          <div className="board-list-item-bottom">
            <div className="board-list-item-count">
              댓글 {commentCount}, 좋아요 {favoriteCount}, 조회수 {viewCount}
            </div>
          </div>
        </div>
        {boardTitleImage !== null && (
          <div className="board-list-item-image-box">
            <div
              className="board-list-item-image"
              style={{
                backgroundImage: `url(${boardTitleImage})`,
              }}
            ></div>
          </div>
        )}
      </div>
    </>
  );
}
