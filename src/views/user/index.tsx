import { ChangeEvent, useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import classNames from "classnames/bind";
import { BoardListItem, User } from "types/interface";
import emptyProfileImage from "assets/images/empty_profile.jpg";
import { useNavigate, useParams } from "react-router-dom";
import { latestBoardListMock } from "mocks";
import BoardListItemFoo from "components/boardListItem";
import { BOARD_PATH, BOARD_WRITE_PATH, MAIN_PATH, USER_PATH } from "contants";
import { useLoginUserStore } from "stores";
import {
  fileUploadRequest,
  getUserBoardListRequest,
  getUserRequest,
  patchNicknameRequest,
  patchProfileImageRequest,
} from "apis";
import {
  GetUserResponseDTO,
  PatchNicknameResponseDTO,
  PatchProfileImageResponseDTO,
} from "apis/response/user";
import { ResponseDTO } from "apis/response";
import {
  PatchNicknameRequestDTO,
  PatchProfileImageRequestDTO,
} from "apis/request/user";
import { CookieKey, getCookie } from "utils/cookie";
import { usePagination } from "hooks";
import { GetUserBoardListResponseDTO } from "apis/response/board";
import Pagination from "components/pagination";

export default function UserPage() {
  const cx = classNames.bind(styles);

  //hook 네이게이터
  const navigator = useNavigate();
  //hook PARAMS
  const { email } = useParams();
  //hook 로그인 유저 상태
  const { loginUser } = useLoginUserStore();

  //state 내 페이지인지 체크 상태
  const [isMyPage, setIsMyPage] = useState<boolean>(true);

  //# 유저 상단 컴포넌트
  const UserTop = () => {
    //hook 이미지 파일 입력 참조
    const imageInputRef = useRef<HTMLInputElement | null>(null);

    //state 유저 닉네임 변경 상태
    const [isChangeNickname, setIsChangeNickname] = useState<boolean>(false);
    //state 닉네임 상태 관리
    const [nickname, setNickname] = useState<string>("");
    //state 닉네임 입력 상태 관리(수정 버튼 눌렀을 경우)
    const [changeNickname, setChangeNickname] = useState<string>("");
    //state 프로파일 이미지 상태 관리
    const [profileImage, setProfileImage] = useState<string | null>(null);
    //state 유저 정보 상태
    const [user, setUser] = useState<User | null>(null);

    //function 프로파일 등록 응답처리
    const patchProfileImageResponse = (
      res: PatchProfileImageResponseDTO | ResponseDTO | null
    ) => {
      if (!res) return;

      const { code } = res;
      if (code === "AF") alert("인증에 실패했습니다.");
      if (code === "NU") alert("존재하지 않는 유저입니다.");
      if (code === "DBE") alert("데이터베이스 오류입니다.");
      if (code !== "SU") return;

      //comment 사용자 정보를 다시 받아와서 화면을 갱신해준다.
      if (!email) return;
      getUserRequest(email).then(getUserResponse);
    };

    //function 파일 업로드 응답처리
    const fileUploadResponse = (profileImage: string | null) => {
      console.log(profileImage);
      if (!profileImage) return;
      if (!getCookie(CookieKey.ACCESS_TOKEN)) return;

      //comment 파일 등록 후 유저 정보를 업데이트 해준다.
      const req: PatchProfileImageRequestDTO = { profileImage };
      patchProfileImageRequest(req, getCookie(CookieKey.ACCESS_TOKEN)).then(
        patchProfileImageResponse
      );
    };

    //handler 프로파일 이미지 클릭 이벤트
    const onProfileBoxClickHandler = () => {
      if (!isMyPage) return;
      if (!imageInputRef.current) return;
      imageInputRef.current.click();
    };
    //handler 프로파일 이미지 변경 이벤트
    const onProfileImageChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || !e.target.files.length) return;

      const file = e.target.files[0];
      const data = new FormData();
      data.append("file", file);

      fileUploadRequest(data).then(fileUploadResponse);
    };
    //handler 닉네임 수정 버튼 클릭 이벤트
    const onEditNicknameButtonClickHandler = () => {
      if (!isChangeNickname) {
        setIsChangeNickname(!isChangeNickname);
        setChangeNickname(nickname);
        return;
      }

      if (!getCookie(CookieKey.ACCESS_TOKEN)) return;

      const req: PatchNicknameRequestDTO = {
        nickname: changeNickname,
      };

      patchNicknameRequest(req, getCookie(CookieKey.ACCESS_TOKEN)).then(
        patchNicknameResponse
      );
    };
    //handler 닉네임 변경 이벤트 처리
    const onNicknameChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setChangeNickname(value);
    };

    //function 닉네임 수정 요청 후 응답 처리
    const patchNicknameResponse = (
      res: PatchNicknameResponseDTO | ResponseDTO | null
    ) => {
      if (!res) return;

      const { code } = res;
      if (code === "VF") alert("닉네임은 필수입니다.");
      if (code === "NU") alert("존재하지 않는 유저입니다.");
      if (code === "DN") alert("중복되는 닉네임입니다.");
      if (code === "DBE") alert("데이터베이스 오류입니다.");
      if (code !== "SU") return;

      if (!email) return;
      //comment 사용자 정보를 다시 받아와서 화면을 갱신해준다.
      getUserRequest(email).then(getUserResponse);
      setIsChangeNickname(false);
    };

    //function 유저 정보 요청 후 응답 처리
    const getUserResponse = (res: GetUserResponseDTO | ResponseDTO | null) => {
      if (!res) return;

      const { code } = res;
      if (code === "NU") alert("존재하지 않는 유저입니다.");
      if (code === "DBE") alert("데이터베이스 오류입니다.");
      if (code !== "SU") {
        navigator(MAIN_PATH());
        return;
      }

      const { email, nickname, profileImage } = res as GetUserResponseDTO;
      setNickname(nickname);
      setProfileImage(profileImage);

      const isMyPage = email === loginUser?.email;
      setIsMyPage(isMyPage);
    };

    //hook 마운트 초기화
    useEffect(() => {
      if (!email) return;

      getUserRequest(email).then(getUserResponse);

      // setNickname("개발자");
      // setProfileImage(
      //   "https://cdn.pixabay.com/photo/2024/04/26/09/11/picture-8721442_640.jpg"
      // );
    }, []);

    //# UI 렌더링
    // if (!user) return <></>;

    return (
      <div id="top-wrapper" className={cx("top-wrapper")}>
        <div className={cx("top-container")}>
          {isMyPage ? (
            //comment 내 페이지일 경우
            <div
              className={cx("top-my-profile-image-box")}
              onClick={onProfileBoxClickHandler}
            >
              {/* //comment 프로파일 이미지가 있을 경우 */}
              {profileImage !== null ? (
                <div
                  className={cx("top-profile-image")}
                  style={{
                    backgroundImage: `url(${profileImage})`,
                  }}
                />
              ) : (
                //comment 프로파일 이미지가 없을 경우
                <div className={cx("icon-box-large")}>
                  <div className={cx("icon", "image-box-light-icon")}></div>
                </div>
              )}
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={onProfileImageChangeHandler}
              />
            </div>
          ) : (
            //comment 내 페이지가 아닐경우
            <div
              className={cx("top-profile-image-box")}
              style={{
                backgroundImage: `url(${
                  profileImage ? profileImage : emptyProfileImage
                })`,
              }}
            ></div>
          )}
          <div className={cx("top-info-box")}>
            <div className={cx("top-info-nickname-box")}>
              {isMyPage ? (
                <>
                  {isChangeNickname ? (
                    <input
                      className={cx("top-info-nickname-input")}
                      type="text"
                      size={changeNickname.length + 1}
                      value={changeNickname}
                      onChange={onNicknameChangeHandler}
                    />
                  ) : (
                    <div className={cx("top-info-nickname")}>{nickname}</div>
                  )}
                  <div
                    className={cx("icon-button")}
                    onClick={onEditNicknameButtonClickHandler}
                  >
                    <div className={cx("icon", "edit-icon")}></div>
                  </div>
                </>
              ) : (
                <div className={cx("top-info-nickname")}>{nickname}</div>
              )}
            </div>
            <div className={cx("top-info-email")}>{email}</div>
          </div>
        </div>
      </div>
    );
  };

  //# 유저 하단 컴포넌트
  const UserBottom = () => {
    //hook 페이지네이션 관리
    const {
      currentPage,
      currentSection,
      totalSection,
      viewList,
      viewPageList,
      setCurrentPage,
      setCurrentSection,
      setTotalList,
    } = usePagination<BoardListItem>(5);

    //state 게시물 갯수 상태
    const [count, setCount] = useState<number>(2);
    //state 게시물 상태(임시)
    const [boardList, setBoardList] = useState<BoardListItem[]>([]);

    //handler 사이드 카드 클릭 이벤트 처리
    const onClickSideCard = () => {
      if (isMyPage) navigator(BOARD_PATH() + "/" + BOARD_WRITE_PATH());
      else if (loginUser) navigator(USER_PATH(loginUser.email));
    };

    //function 유저의 게시물 정보를 가져오는 응답 함수
    const getUserBoardListResponse = (
      res: GetUserBoardListResponseDTO | ResponseDTO | null
    ) => {
      if (!res) return;

      const { code } = res;
      if (code === "NU") {
        alert("존재하지 않는 유저입니다.");
        navigator(MAIN_PATH());
        return;
      }
      if (code === "DBE") alert("데이터베이스 오류입니다.");
      if (code !== "SU") return;

      const { userBoardList } = res as GetUserBoardListResponseDTO;
      setTotalList(userBoardList);
      setCount(userBoardList.length);
    };

    //hook 마운트 초기화
    useEffect(() => {
      if (!email) return;

      getUserBoardListRequest(email).then(getUserBoardListResponse);
    }, []);

    return (
      <div id="bottom-wrapper" className={cx("bottom-wrapper")}>
        <div className={cx("bottom-container")}>
          <div className={cx("bottom-title")}>
            {isMyPage ? "내 게시물" : "게시물"}
            <span className={cx("emphasis")}>{count}</span>
          </div>
          <div className={cx("bottom-contents-box")}>
            {count === 0 ? (
              //comment 게시물이 없으면
              <div className={cx("bottom-content-nothing")}>
                게시물이 없습니다.
              </div>
            ) : (
              //comment 게시물이 있으면
              <div className={cx("bottom-content")}>
                {viewList.map((item, idx) => (
                  <BoardListItemFoo key={idx} boardListItem={item} />
                ))}
              </div>
            )}
            <div className={cx("bottom-side-box")}>
              <div className={cx("bottom-side-card")} onClick={onClickSideCard}>
                <div className={cx("bottom-side-container")}>
                  {isMyPage ? (
                    <>
                      <div className={cx("icon-box")}>
                        <div className={cx("icon", "edit-icon")}></div>
                      </div>
                      <div className={cx("bottom-side-text")}>글쓰기</div>
                    </>
                  ) : (
                    <>
                      <div className={cx("bottom-side-text")}>
                        내 게시물로 가기
                      </div>
                      <div className={cx("icon-box")}>
                        <div className={cx("icon", "arrow-right-icon")}></div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className={cx("bottom-pagination-box")}>
            {0 !== count && (
              <Pagination
                currentPage={currentPage}
                currentSection={currentSection}
                totalSection={totalSection}
                viewPageList={viewPageList}
                setCurentSection={setCurrentSection}
                setCurrentPage={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <UserTop />
      <UserBottom />
    </>
  );
}
