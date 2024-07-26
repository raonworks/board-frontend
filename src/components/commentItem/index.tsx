import "./style.css";
import CommentListItem from "../../types/interface/comment-list-item.interface";
import EmptyProfileImage from "assets/images/empty_profile.jpg";
import dayjs from "dayjs";
import { useMemo } from "react";

interface PropsType {
  commentItemList: CommentListItem;
}

export default function CommentItem({ commentItemList }: PropsType) {
  const { nickname, profileImage, writeDatetime, content } = commentItemList;

  //function 작성일 경과시간 함수
  const elapsedTime = useMemo(() => {
    // const//  now = dayjs().add(9, "hour");
    const now = dayjs();
    const writeTime = dayjs(writeDatetime);
    const diff = now.diff(writeTime, "s");

    if (diff < 60) return `${diff}초 전`;
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    return `${Math.floor(diff / 86400)}일 전`;
  }, []);

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
          <div className="comment-item-list-time">{elapsedTime}</div>
        </div>
        <div className="co,ment-item-list-main">
          <div className="comment-item-list-content">{content}</div>
        </div>
      </div>
    </>
  );
}
