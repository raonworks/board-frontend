import "./style.css";
import FavoriteItem from "components/favoriteItem";
import { useEffect, useState } from "react";
import { CommentListItem, FavoriteLiteItem } from "types/interface";
import { commentItemListMock, favoriteListMock } from "mocks";
import CommentItem from "components/commentItem";
import Pagination from "components/pagination";
import EmptyProfileImage from "assets/images/empty_profile.jpg";

export default function BoardDetail() {
  //# 게시물 상세 상단 컴포넌트
  const BoardDetailTop = () => {
    //const more 버튼 상태
    const [showMore, setShowMore] = useState<boolean>(false);

    //handler "더보기" 버튼 클릭 이벤트
    const onMoreButtonClickHandler = () => {
      setShowMore(!showMore);
      console.log("Foo");
    };

    return (
      <div className="board-detail-top">
        {/* //div 타이틀 및 작성자 정보 */}
        <div className="board-detail-top-header">
          {/* //div 타이틀 */}
          <div className="board-detail-title">타이틀</div>
          {/* //div comment 작성자 정보 */}
          <div className="board-detail-top-sub-box">
            <div className="board-detail-write-info-box">
              <div
                className="board-detail-writer-profile-image"
                style={{ backgroundImage: `url(${EmptyProfileImage})` }}
              ></div>
              <div className="board-detail-writer-nickname">포포아빠</div>
              <div className="board-detail-info-divider">|</div>
              <div className="board-detail-write-date">2024.05.06</div>
            </div>
            <div className="icon-button" onClick={onMoreButtonClickHandler}>
              <div className="icon more-icon"></div>
            </div>
            {showMore && (
              <>
                {/* //div 더보기 박스 */}
                <div className="board-detail-more-box">
                  <div className="board-detail-update-button">수정</div>
                  <div className="divider"></div>
                  <div className="board-detail-delete-button">삭제</div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="divider"></div>
        {/* //div 본문 및 이미지 */}
        <div className="board-detail-top-main">
          <div className="board-detail-main-text">본문내용</div>
          <img
            className="board-detail-main-image"
            alt=""
            src="https://marketplace.canva.com/EAD2xI0GoM0/1/0/1600w/canva-%ED%95%98%EB%8A%98-%EC%95%BC%EC%99%B8-%EC%9E%90%EC%97%B0-%EC%98%81%EA%B0%90-%EC%9D%B8%EC%9A%A9%EB%AC%B8-%EB%8D%B0%EC%8A%A4%ED%81%AC%ED%86%B1-%EB%B0%B0%EA%B2%BD%ED%99%94%EB%A9%B4-rssvAb9JL4I.jpg"
          />
        </div>
      </div>
    );
  };

  //# 게시물 상세 하단 컴포넌트
  const BoardDetailBottom = () => {
    //const
    const [favoriteList, setFavoriteList] = useState<FavoriteLiteItem[]>([]);
    //const
    const [commentList, setCommentList] = useState<CommentListItem[]>([]);

    useEffect(() => {
      setFavoriteList(favoriteListMock);
      setCommentList(commentItemListMock);
    }, []);

    return (
      <div id="board-detail-bottom">
        {/* //div 버튼 모음 박스 */}
        <div className="board-detail-bottom-button-box">
          <div className="board-detail-bottom-button-group">
            <div className="icon-button">
              <div className="icon favorite-fill-icon"></div>
            </div>
            <div className="board-detail-bottom-button-text">좋아요 {12}</div>
            <div className="icon-button">
              <div className="icon up-light-icon"></div>
            </div>
          </div>
          <div className="board-detail-bottom-button-group">
            <div className="icon-button">
              <div className="icon comment-icon"></div>
            </div>
            <div className="board-detail-bottom-button-text">댓글 {12}</div>
            <div className="icon-button">
              <div className="icon up-light-icon"></div>
            </div>
          </div>
        </div>
        {/* //div "좋아요" 박스 */}
        <div className="board-detail-bottom-favorite-box">
          <div className="board-detail-bottom-favorite-container">
            <div className="board-detail-bottom-favorite-title">
              좋아요 <span className="emphasis">{12}</span>
            </div>
            <div className="board-detail-bottom-favorite-contents">
              {favoriteList.map((item) => (
                <FavoriteItem favoriteListItem={item} />
              ))}
            </div>
          </div>
        </div>
        {/* //div 댓글 박스 */}
        <div className="board-detail-bottom-comment-box">
          <div className="board-detail-bottom-comment-container">
            <div className="board-detail-bottom-comment-title">
              댓글 <span className="emphasis">{12}</span>
            </div>
            <div className="board-detail-bottom-comment-list-container">
              {commentList.map((item) => (
                <CommentItem commentItemList={item} />
              ))}
            </div>
          </div>
          <div className="divider"></div>
          {/* //div 페이지 네이션 박스 */}
          <div className="board-detail-bottom-comment-pagination-box">
            <Pagination />
          </div>
          {/* //div 댓글 입력 폼 */}
          <div className="board-detail-bottom-comment-input-box">
            <div className="board-detail-bottom-comment-input-container">
              <textarea
                className="board-detail-bottom-comment-textarea"
                placeholder="댓글을 작성해주세요."
              />
              <div className="board-detail-bottom-comment-button-box">
                <div className="disable-button">댓글달기</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div id="board-detail-wrapper">
        <div className="board-detail-container">
          <BoardDetailTop />
          <BoardDetailBottom />
        </div>
      </div>
    </>
  );
}
