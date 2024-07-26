import styles from "./style.module.css";
import FavoriteItem from "components/favoriteItem";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Board, CommentListItem, FavoriteLiteItem } from "types/interface";
import CommentItem from "components/commentItem";
import Pagination from "components/pagination";
import EmptyProfileImage from "assets/images/empty_profile.jpg";
import { useLoginUserStore } from "stores";
import { useNavigate, useParams } from "react-router-dom";
import { BOARD_PATH, BOARD_UPDATE_PATH, MAIN_PATH, USER_PATH } from "contants";
import classNames from "classnames/bind";
import {
  deleteBoardRequest,
  getBoardRequest,
  getCommentListRequest,
  getFavoriteListRequest,
  increaseViewCountRequst,
  postCommentRequest,
  putFavoriteRequest,
} from "apis";
import GetBoardResponseDTO from "apis/response/board/get-board.response.dto";
import { ResponseDTO } from "apis/response";
import {
  DeleteBoardResponseDTO,
  GetCommentListResponseDTO,
  GetFavoriteListResponseDTO,
  IncreaseViewCountResponseDTO,
  PostCommentResponseDTO,
  PutFavoriteResponseDTO,
} from "apis/response/board";
import dayjs from "dayjs";
import _ from "lodash";
//// import { useCookies } from "react-cookie";
import { CookieKey, getCookie } from "utils/cookie";
import { PostCommentRequestDTO } from "apis/request/board";

export default function BoardDetail() {
  const cx = classNames.bind(styles);

  //const 게시물 번호
  const { boardNumber } = useParams();
  //const 로그인 유저 상태
  const { loginUser } = useLoginUserStore();
  // const// 쿠키 상태
  // const// [cookies, setCookie, removeCookie] = useCookies();

  //hook 네비게이터
  const navigator = useNavigate();

  //function 조회 응답 함수
  const increaseViewCountResponse = (
    res: IncreaseViewCountResponseDTO | ResponseDTO | null | undefined
  ) => {
    if (!res) return;
    const { code } = res;
    if (code === "NB") alert("존재하지 않는 게시물입니다.");
    if (code === "DBE") alert("데이터베이스 오류입니다.");
  };

  //# 게시물 상세 상단 컴포넌트
  const BoardDetailTop = () => {
    //const "게시물" 상태 정보
    const [board, setBoard] = useState<Board | null>(null);
    //const "더보기" 버튼 상태
    const [showMore, setShowMore] = useState<boolean>(false);
    //const 작성자 상태
    const [isWriter, setWriter] = useState<boolean>(false);

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
      if (
        !boardNumber ||
        !board ||
        !loginUser ||
        !getCookie(CookieKey.ACCESS_TOKEN)
      )
        return;
      if (loginUser.email !== board.writerEmail) return;

      deleteBoardRequest(boardNumber, getCookie(CookieKey.ACCESS_TOKEN)).then(
        deleteBoardResponseFunc
      );
    };

    //function 게시물 API로 부터 응답처리
    const getBoardResponse = (
      resBody: GetBoardResponseDTO | ResponseDTO | undefined
    ) => {
      if (!resBody) return;
      const { code } = resBody;
      if (code === "NB") alert("존재하지 않는 게시물입니다.");
      if (code === "DBE") alert("데이터베이스 오류입니다.");
      if (code !== "SU") {
        navigator(MAIN_PATH());
        return;
      }

      const board: Board = { ...(resBody as GetBoardResponseDTO) };
      setBoard(board);

      if (!loginUser) {
        setWriter(false);
        return;
      }

      setWriter(loginUser.email === board.writerEmail);
    };
    //function 작성일 변경 포멧 함수
    const getWriteDatetimeFormat = () => {
      if (!board) return null;
      const date = dayjs(board.writeDatetime);
      return date.format("YYYY. MM. DD");
    };
    //function '게시물' 삭제 응답 함수
    const deleteBoardResponseFunc = (
      res: DeleteBoardResponseDTO | ResponseDTO | null
    ) => {
      if (!res) return;

      const { code } = res;
      if (code === "VF") alert("잘못된 접근입니다.");
      if (code === "NU") alert("존재하지 않는 유저입니다.");
      if (code === "NB") alert("존재하지 않는 게시물입니다.");
      if (code === "AF") alert("인증에 실패했습니다.");
      if (code === "NP") alert("권한이 없습니다.");
      if (code === "DBE") alert("데이터베이스 오류입니다.");
      if (code !== "SU") return;

      navigator(MAIN_PATH());
    };

    //comment 게시물 정보가 없으면 빈화면 출력
    // if (null === board) return <></>;

    useEffect(() => {
      if (!boardNumber) {
        navigator(MAIN_PATH());
        return;
      }
      getBoardRequest(boardNumber).then(getBoardResponse);
    }, []);

    return (
      <div className={cx("top")}>
        {/* //div 타이틀 및 작성자 정보 */}
        <div className={cx("top-header")}>
          {/* //div 타이틀 */}
          <div className={cx("title")}>{board?.title}</div>
          {/* //div comment 작성자 정보 */}
          <div className={cx("top-sub-box")}>
            <div className={cx("write-info-box")}>
              <div
                className={cx("writer-profile-image")}
                style={{
                  backgroundImage: `url(${
                    board?.writerProfileImage
                      ? board.writerProfileImage
                      : EmptyProfileImage
                  })`,
                }}
              ></div>
              <div
                className={cx("writer-nickname")}
                onClick={onNicknameClickHandler}
              >
                {/* //comment 닉네임 */}
                {board?.writerNickname}
              </div>
              <div className={cx("divider")}>|</div>
              <div className={cx("write-date")}>
                {/* //comment 글쓴날짜 */}
                {getWriteDatetimeFormat()}
              </div>
            </div>
            {isWriter && (
              <div className="icon-button" onClick={onMoreButtonClickHandler}>
                <div className="icon more-icon"></div>
              </div>
            )}
            {showMore && (
              <>
                {/* //div 더보기 박스 */}
                <div className={cx("more-box")}>
                  <div
                    className={cx("update-button")}
                    onClick={onUpdateButtonClickHandler}
                  >
                    수정
                  </div>
                  <div className="divider"></div>
                  <div
                    className={cx("delete-button")}
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
        <div className={cx("top-main")}>
          <div className={cx("top-main-text")}>{board?.content}</div>
          {board?.boardImageList.map((item, idx) => (
            <img key={idx} className={cx("main-image")} alt="" src={item} />
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
      if (
        !boardNumber ||
        null === loginUser ||
        !getCookie(CookieKey.ACCESS_TOKEN)
      )
        return;
      putFavoriteRequest(boardNumber, getCookie(CookieKey.ACCESS_TOKEN)).then(
        putFavoriteResponse
      );
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
      if (
        !boardNumber ||
        comment.length === 0 ||
        !loginUser ||
        !getCookie(CookieKey.ACCESS_TOKEN)
      )
        return;

      const req: PostCommentRequestDTO = { content: comment };
      postCommentRequest(
        boardNumber,
        req,
        getCookie(CookieKey.ACCESS_TOKEN)
      ).then(postCommentResponseFunc);
    };

    //function "좋아요" 응답 함수
    const getFavoriteResponse = (
      res: GetFavoriteListResponseDTO | ResponseDTO | null
    ) => {
      if (!res) return null;

      const { code } = res;
      if (code === "NB") alert("존재하지 않는 게시물입니다.");
      if (code === "DBE") alert("데이터베이스 입니다.");
      if (code !== "SU") return;

      const { favoriteList } = res as GetFavoriteListResponseDTO;
      setFavoriteList(favoriteList);

      if (!loginUser) {
        setFavorite(false);
        return;
      }

      const hitedFavorite =
        _.findIndex(favoriteList, { email: loginUser.email }) !== -1;
      setFavorite(hitedFavorite);
    };
    //function "댓글" 응답 함수
    const getCommentListResponse = (
      res: GetCommentListResponseDTO | ResponseDTO | null
    ) => {
      if (!res) return;

      const { code } = res;
      if (code === "NB") alert("존재하지 않는 게시물입니다.");
      if (code === "DBE") alert("데이터베이스 입니다.");
      if (code !== "SU") return;

      const { commentList } = res as GetCommentListResponseDTO;
      setCommentList(commentList);
    };
    //function "좋아요" 히팅 응답 합수
    const putFavoriteResponse = (
      res: PutFavoriteResponseDTO | ResponseDTO | null
    ) => {
      if (!res) return;

      const { code } = res;
      if (code === "VF") alert("잘못된 접근입니다.");
      if (code === "NU") alert("존재하지 않는 유저입니다.");
      if (code === "NB") alert("존재하지 않는 게시물입니다.");
      if (code === "AF") alert("인증에 실패했습니다.");
      if (code === "DBE") alert("데이터베이스 오류입니다.");
      if (code !== "SU") return;

      if (!boardNumber) return;
      getFavoriteListRequest(boardNumber).then(getFavoriteResponse);
    };
    //function "댓글달기" 응답 함수
    const postCommentResponseFunc = (
      res: PostCommentResponseDTO | ResponseDTO | null
    ) => {
      if (!res) return;

      const { code } = res;
      if (code === "VF") alert("잘못된 접근입니다.");
      if (code === "NU") alert("존재하지 않는 유저입니다.");
      if (code === "NB") alert("존재하지 않는 게시물입니다.");
      if (code === "AF") alert("인증에 실패했습니다.");
      if (code === "DBE") alert("데이터베이스 오류입니다.");
      if (code !== "SU") return;

      setComment("");

      if (!boardNumber) return;
      getCommentListRequest(boardNumber).then(getCommentListResponse);
    };

    //hook 댓글 textarea 참조
    const commentRef = useRef<HTMLTextAreaElement | null>(null);

    //hook 초기화 작업
    useEffect(() => {
      if (!boardNumber) return;
      getFavoriteListRequest(boardNumber).then(getFavoriteResponse);
      getCommentListRequest(boardNumber).then(getCommentListResponse);
    }, []);

    //"좋아요" 펼치기 아이콘
    const favoriteIcon = cx("icon", {
      "up-light-icon": showFavorite,
      "down-light-icon": !showFavorite,
    });
    //"좋아요" 선택 아이콘
    const hitFavorite = cx("icon", {
      "favorite-fill-icon": isFavorite,
      "favorite-light-icon": !isFavorite,
    });

    //"댓글" 펼치기 아이콘
    const commentIcon = cx("icon", {
      "up-light-icon": showComment,
      "down-light-icon": !showComment,
    });
    //"댓글달기" 아이콘
    const commentButton = cx({
      "disable-button": comment.length === 0,
      "black-button": comment.length >= 0,
    });

    return (
      <div id="bottom" className={cx("bottom")}>
        {/* //div 버튼 모음 박스 */}
        <div className={cx("bottom-button-box")}>
          <div className={cx("bottom-button-group")}>
            <div className="icon-button" onClick={onFavoriteClickHandler}>
              <div className={hitFavorite} />
            </div>
            <div className={cx("bottom-button-text")}>
              좋아요 {favoriteList.length}
            </div>
            <div className="icon-button" onClick={onShowFavoriteClickHandler}>
              <div className={favoriteIcon}></div>
            </div>
          </div>
          <div className={cx("bottom-button-group")}>
            <div className="icon-button">
              <div className="icon comment-icon"></div>
            </div>
            <div className={cx("bottom-button-text")}>
              댓글 {commentList.length}
            </div>
            <div className="icon-button" onClick={onShowCommentClickHandler}>
              <div className={commentIcon}></div>
            </div>
          </div>
        </div>
        {/* //div "좋아요" 박스 */}
        {showFavorite && (
          <div className={cx("bottom-favorite-box")}>
            <div className={cx("bottom-favorite-container")}>
              <div className={cx("bottom-favorite-title")}>
                좋아요 <span className="emphasis">{favoriteList.length}</span>
              </div>
              <div className={cx("bottom-favorite-contents")}>
                {favoriteList.map((item, idx) => (
                  <FavoriteItem key={idx} favoriteListItem={item} />
                ))}
              </div>
            </div>
          </div>
        )}
        {/* //div 댓글 박스 */}
        {showComment && (
          <div className={cx("bottom-comment-box")}>
            <div className={cx("bottom-comment-container")}>
              <div className={cx("bottom-comment-title")}>
                댓글 <span className="emphasis">{commentList.length}</span>
              </div>
              <div className={cx("bottom-comment-list-container")}>
                {commentList.map((item, idx) => (
                  <CommentItem key={idx} commentItemList={item} />
                ))}
              </div>
            </div>
            <div className="divider"></div>
            {/* //div 페이지 네이션 박스 */}
            <div className={cx("bottom-comment-pagination-box")}>
              <Pagination />
            </div>
            {/* //div 댓글 입력 폼 */}
            {null != loginUser && (
              <div className={cx("bottom-comment-input-box")}>
                <div className={cx("bottom-comment-input-container")}>
                  <textarea
                    ref={commentRef}
                    className={cx("bottom-comment-textarea")}
                    value={comment}
                    placeholder="댓글을 작성해주세요."
                    onChange={onChangeCommentClickHandler}
                  />
                  <div className={cx("bottom-comment-button-box")}>
                    <div
                      className={commentButton}
                      onClick={onCommentSubmitClickHandler}
                    >
                      댓글달기
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  //hook 게시물 조회 수 증가
  //comment strict 모드에서는 effect가 2번 호출되기 때문에 한 번 걸러주기 위해서
  //comment 다만, 배포모드에서는 strict가 제거된다.
  let effectFlag = true;
  useEffect(() => {
    if (!boardNumber) return;

    if (effectFlag) {
      effectFlag = false;
      return;
    }

    increaseViewCountRequst(boardNumber).then(increaseViewCountResponse);
  }, []);

  return (
    <>
      <div id="wrapper" className={cx("wrapper")}>
        <div className={cx("container")}>
          <BoardDetailTop />
          <BoardDetailBottom />
        </div>
      </div>
    </>
  );
}
