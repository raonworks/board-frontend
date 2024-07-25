import "./style.css";
import styles from "./style.module.css";
import FavoriteItem from "components/favoriteItem";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Board, CommentListItem, FavoriteLiteItem } from "types/interface";
import { boardMock, commentItemListMock, favoriteListMock } from "mocks";
import CommentItem from "components/commentItem";
import Pagination from "components/pagination";
import EmptyProfileImage from "assets/images/empty_profile.jpg";
import { useLoginUserStore } from "stores";
import { useNavigate, useParams } from "react-router-dom";
import { BOARD_PATH, BOARD_UPDATE_PATH, USER_PATH } from "contants";
import classNames from "classnames";
import { v4 as uuidv4 } from "uuid";

export default function BoardDetail() {
  //const 게시물 번호
  const { boardNumner } = useParams();
  //const 로그인 유저 상태
  const { loginUser } = useLoginUserStore();

  //function 네비게이터
  const navigator = useNavigate();

  //# 게시물 상세 상단 컴포넌트
  const BoardDetailTop = () => {
    //const "게시물" 상태 정보
    const [board, setBoard] = useState<Board | null>(null);
    //const "더보기" 버튼 상태
    const [showMore, setShowMore] = useState<boolean>(false);

    //handler "닉네임" 버튼 클릭 이벤트
    const onNicknameClickHandler = () => {
      if (null === board) return;
      navigator(USER_PATH(board.writerEmail));
    };
    //handler "더보기" 버튼 클릭 이벤트
    const onMoreButtonClickHandler = () => {
      setShowMore(!showMore);
    };
    //handler "수정" 버튼 클릭 이벤트
    const onUpdateButtonClickHandler = () => {
      if (null === board || !loginUser) return;
      if (loginUser.email !== board.writerEmail) return;
      navigator(BOARD_PATH() + "/" + BOARD_UPDATE_PATH(board.boardNumber));
    };
    //handler "삭제" 버튼 클릭 이벤트
    const onDeleteButtonClickHandler = () => {
      if (null === board || !loginUser) return;
      if (loginUser.email !== board.writerEmail) return;
      navigator(BOARD_PATH());
    };

    //comment 게시물 정보가 없으면 빈화면 출력
    // if (null === board) return <></>;

    useEffect(() => {
      setBoard(boardMock);
    }, [boardNumner]);

    return (
      <div className="board-detail-top">
        {/* //div 타이틀 및 작성자 정보 */}
        <div className="board-detail-top-header">
          {/* //div 타이틀 */}
          <div className="board-detail-title">{board?.title}</div>
          {/* //div comment 작성자 정보 */}
          <div className="board-detail-top-sub-box">
            <div className="board-detail-write-info-box">
              <div
                className="board-detail-writer-profile-image"
                style={{
                  backgroundImage: `url(${
                    board?.writerProfileImage
                      ? board.writerProfileImage
                      : EmptyProfileImage
                  })`,
                }}
              ></div>
              <div
                className="board-detail-writer-nickname"
                onClick={onNicknameClickHandler}
              >
                {/* //comment 닉네임 */}
                {board?.writerNickname}
              </div>
              <div className="board-detail-info-divider">|</div>
              <div className="board-detail-write-date">
                {/* //comment 글쓴날짜 */}
                {board?.writeDatetime}
              </div>
            </div>
            <div className="icon-button" onClick={onMoreButtonClickHandler}>
              <div className="icon more-icon"></div>
            </div>
            {showMore && (
              <>
                {/* //div 더보기 박스 */}
                <div className="board-detail-more-box">
                  <div
                    className="board-detail-update-button"
                    onClick={onUpdateButtonClickHandler}
                  >
                    수정
                  </div>
                  <div className="divider"></div>
                  <div
                    className="board-detail-delete-button"
                    onClick={onDeleteButtonClickHandler}
                  >
                    삭제
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="divider"></div>
        {/* //div 본문 및 이미지 */}
        <div className="board-detail-top-main">
          <div className="board-detail-main-text">{board?.content}</div>
          {board?.boardImageList.map((item) => (
            <img
              key={uuidv4()}
              className="board-detail-main-image"
              alt=""
              src={item}
            />
          ))}
        </div>
      </div>
    );
  };

  //# 게시물 상세 하단 컴포넌트
  const BoardDetailBottom = () => {
    //const '좋아요' 리스트 상태 관리
    const [favoriteList, setFavoriteList] = useState<FavoriteLiteItem[]>([]);
    //const '댓글' 리스트 상태 관리
    const [commentList, setCommentList] = useState<CommentListItem[]>([]);
    //const '좋아요' 상태 관리
    const [isFavorite, setFavorite] = useState<boolean>(false);
    //const '좋아요' 보기 상태 관리
    const [showFavorite, setShowFavorite] = useState<boolean>(false);
    //const '댓글' 보기 상태 관리
    const [showComment, setShowComment] = useState<boolean>(false);
    //const '댓글' 상태 관리
    const [comment, setComment] = useState<string>("");

    //handler '좋아요' 클릭 이벤트
    const onFavoriteClickHandler = () => {
      setFavorite(!isFavorite);
    };
    //handler '좋아요' 보기 클릭 이벤트
    const onShowFavoriteClickHandler = () => {
      setShowFavorite(!showFavorite);
    };
    //handler '댓글' 보기 클릭 이벤트
    const onShowCommentClickHandler = () => {
      setShowComment(!showComment);
    };
    //handler '댓글' 입력 변경 이벤트
    const onChangeCommentClickHandler = (
      e: ChangeEvent<HTMLTextAreaElement>
    ) => {
      const { value } = e.target;
      setComment(value);
      if (!commentRef.current) return;
      commentRef.current.style.height = "auto";
      commentRef.current.style.height = `${commentRef.current.scrollHeight}px`;
    };
    //handler '댓글달기' 클릭 이벤트
    const onCommentSubmitClickHandler = () => {
      if (comment.length === 0) return;
      alert("!!");
    };

    //hook 댓글 textarea 참조
    const commentRef = useRef<HTMLTextAreaElement | null>(null);

    //hook 초기화 작업
    useEffect(() => {
      setFavoriteList(favoriteListMock);
      setCommentList(commentItemListMock);
    }, []);

    //동적 아이콘 클래스 정의
    const favoriteIcon = classNames("icon", {
      "up-light-icon": showFavorite,
      "down-light-icon": !showFavorite,
    });
    const commentIcon = classNames("icon", {
      "up-light-icon": showComment,
      "down-light-icon": !showComment,
    });
    const commentButton = classNames({
      "disable-button": comment.length === 0,
      "black-button": comment.length >= 0,
    });

    return (
      <div id="board-detail-bottom">
        {/* //div 버튼 모음 박스 */}
        <div className="board-detail-bottom-button-box">
          <div className="board-detail-bottom-button-group">
            <div className="icon-button" onClick={onFavoriteClickHandler}>
              {isFavorite ? (
                <div className="icon favorite-fill-icon" />
              ) : (
                <div className="icon favorite-light-icon" />
              )}
            </div>
            <div className="board-detail-bottom-button-text">
              좋아요 {favoriteList.length}
            </div>
            <div className="icon-button" onClick={onShowFavoriteClickHandler}>
              <div className={favoriteIcon}></div>
            </div>
          </div>
          <div className="board-detail-bottom-button-group">
            <div className="icon-button">
              <div className="icon comment-icon"></div>
            </div>
            <div className="board-detail-bottom-button-text">
              댓글 {commentList.length}
            </div>
            <div className="icon-button" onClick={onShowCommentClickHandler}>
              <div className={commentIcon}></div>
            </div>
          </div>
        </div>
        {/* //div "좋아요" 박스 */}
        {showFavorite && (
          <div className="board-detail-bottom-favorite-box">
            <div className="board-detail-bottom-favorite-container">
              <div className="board-detail-bottom-favorite-title">
                좋아요 <span className="emphasis">{favoriteList.length}</span>
              </div>
              <div className="board-detail-bottom-favorite-contents">
                {favoriteList.map((item) => (
                  <FavoriteItem key={uuidv4()} favoriteListItem={item} />
                ))}
              </div>
            </div>
          </div>
        )}
        {/* //div 댓글 박스 */}
        {showComment && (
          <div className="board-detail-bottom-comment-box">
            <div className="board-detail-bottom-comment-container">
              <div className="board-detail-bottom-comment-title">
                댓글 <span className="emphasis">{commentList.length}</span>
              </div>
              <div className="board-detail-bottom-comment-list-container">
                {commentList.map((item) => (
                  <CommentItem key={uuidv4()} commentItemList={item} />
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
                  ref={commentRef}
                  className="board-detail-bottom-comment-textarea"
                  value={comment}
                  placeholder="댓글을 작성해주세요."
                  onChange={onChangeCommentClickHandler}
                />
                <div className="board-detail-bottom-comment-button-box">
                  <div
                    className={commentButton}
                    onClick={onCommentSubmitClickHandler}
                  >
                    댓글달기
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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
