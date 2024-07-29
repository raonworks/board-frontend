import { BoardListItem } from "types/interface";
import "./style.css";
import EmptyProfileImage from "assets/images/empty_profile.jpg";
import { useNavigate } from "react-router-dom";
import { BOARD_DETAIL_PATH, BOARD_PATH } from "contants";

interface PropsType {
  props: BoardListItem;
}

export default function Top3Item({ props }: PropsType) {
  const { boardNumber, title, content, boardTitleImage } = props;
  const { favoriteCount, commentCount, viewCount } = props;
  const { writeDatetime, writeNickname, writeProfileImage } = props;

  const navigator = useNavigate();
  const onClickHandler = () => {
    navigator(BOARD_PATH() + "/" + BOARD_DETAIL_PATH(boardNumber));
  };

  return (
    <>
      <div
        className="top-3-item-list"
        style={{ backgroundImage: `url(${boardTitleImage})` }}
        onClick={onClickHandler}
      >
        <div className="top-3-item-list-main-box">
          <div className="top-3-item-list-top">
            <div className="top-3-item-list-profile-box">
              <div
                className="top-3-item-list-profile-image"
                style={{
                  backgroundImage: `url(${
                    writeProfileImage ?? EmptyProfileImage
                  })`,
                }}
              ></div>
            </div>
            <div className="top-3-item-list-write-box">
              <div className="top-3-item-list-nickname">{writeNickname}</div>
              <div className="top-3-item-list-writedate">{writeDatetime}</div>
            </div>
          </div>
          <div className="top-3-list-item-middle">
            <div className="top-3-item-list-title">{title}</div>
            <div className="top-3-item-list-content">{content}</div>
          </div>
          <div className="top-3-item-list-bottom">
            <div className="top-3-item-list-count">
              댓글 {commentCount}, 좋아요 {favoriteCount}, 조회수 {viewCount}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
