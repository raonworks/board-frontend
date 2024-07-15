import "./style.css";
import CommentListItem from "../../types/interface/comment-list-item.interface";
import EmptyProfileImage from "assets/images/empty_profile.jpg";

interface PropsType {
  commentItemList: CommentListItem;
}

export default function CommentItem({ commentItemList }: PropsType) {
  const { nickname, profileImage, writeDatetime, content } = commentItemList;

  return (
    <>
      <div className="comment-item-list">
        <div className="comment-item-list-top">
          <div className="comment-item-list-profile-box">
            <div
              className="comment-item-list-profile-image"
              style={{
                backgroundImage: `url(${profileImage ?? EmptyProfileImage})`,
              }}
            ></div>
          </div>
          <div className="comment-item-list-nickname">{nickname}</div>
          <div className="comment-item-list-divider">|</div>
          <div className="comment-item-list-time">{writeDatetime}</div>
        </div>
        <div className="co,ment-item-list-main">
          <div className="comment-item-list-content">{content}</div>
        </div>
      </div>
    </>
  );
}
