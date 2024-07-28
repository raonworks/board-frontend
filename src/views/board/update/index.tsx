import styles from "./style.module.css";
import classNames from "classnames/bind";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useBoardStore, useLoginUserStore } from "stores";
import { useNavigate, useParams } from "react-router-dom";
import { MAIN_PATH } from "contants";
import { useCookies } from "react-cookie";
import { getBoardRequest } from "apis";
import { GetBoardResponseDTO } from "apis/response/board";
import { ResponseDTO } from "apis/response";
import { convertUrlsToFile } from "utils";

export default function BoardUpdate() {
  const cx = classNames.bind(styles);

  //hook 게시물 번호
  const { boardNumber } = useParams();
  //hook 로그인 유저 상태
  const { loginUser } = useLoginUserStore();

  //const 타이틀 영역 REF
  const titleRef = useRef<HTMLTextAreaElement | null>(null);
  //const 본문 영역 REF
  const contentRef = useRef<HTMLTextAreaElement | null>(null);
  //const 파일 REF
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  //const 쿠키 상태
  const [cookies, setCookie] = useCookies();
  //const 게시물 상태
  const { title, setTitle } = useBoardStore();
  const { content, setContent } = useBoardStore();
  const { boardImageFileList, setBoardImageFileList } = useBoardStore();
  //const 게시물 이미지 미리보기 상태
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  //handler 제목 변경 이벤트 처리
  const onTitleChangeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setTitle(value);
    if (!titleRef.current) return;
    titleRef.current.style.height = "auto";
    titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
  };
  //handler 본문 변경 이벤트 처리
  const onContentChangeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setContent(value);
    if (!contentRef.current) return;
    contentRef.current.style.height = "auto";
    contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
  };
  //handler 이미지 변경 이벤트 처리
  const onImageChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const imageUrl = URL.createObjectURL(file);

    //comment 미리보기용 이미지 리스트
    const newImageUrls = imageUrls.map((item) => item);
    newImageUrls.push(imageUrl);
    setImageUrls(newImageUrls);

    //comment 이미지 저장용 리스트
    const newBoardImageFileList = boardImageFileList.map((item) => item);
    newBoardImageFileList.push(file);
    setBoardImageFileList(newBoardImageFileList);

    //이미지 변경 감지를 위해서(같은 이름으로 같은 파일을 등록하면 반응안함)
    if (!imageInputRef.current) return;
    imageInputRef.current.value = "";
  };
  //handler 이미지 버튼 클릭 이벤트 처리
  const onImageUploadButtonClickHandler = () => {
    if (!imageInputRef.current) return;
    imageInputRef.current.click();
  };
  //handler 이미지 닫기 클릭 이벤트 처리
  const onImageCloseButtonClickHandler = (index: number) => {
    if (!imageInputRef.current) return;
    imageInputRef.current.value = "";

    //선택한 이미지만 제외하고 다시 등록
    const newImageUrls = imageUrls.filter((_, idx) => idx !== index);
    setImageUrls(newImageUrls);

    //선택한 이미지만 제외하고 다시 등록
    const newBoardImageFileList = boardImageFileList.filter(
      (_, idx) => idx !== index
    );
    setBoardImageFileList(newBoardImageFileList);

    //todo 제거한 이미지 blob은 URL.revokeObjectURL(url)을 이용해서 해제해야 함.
  };

  //function 네비게이션
  const navigator = useNavigate();
  //function 보드 정보 수신 함수
  const getBoardResponse = (
    resBody: GetBoardResponseDTO | ResponseDTO | null
  ) => {
    if (!resBody) return;
    const { code } = resBody;
    if (code === "NB") alert("존재하지 않는 게시물입니다.");
    if (code === "DBE") alert("데이터베이스 오류입니다.");
    if (code !== "SU") {
      navigator(MAIN_PATH());
      return;
    }

    const { title, content, boardImageList, writerEmail } =
      resBody as GetBoardResponseDTO;
    setTitle(title);
    setContent(content);
    setImageUrls(boardImageList);
    convertUrlsToFile(boardImageList).then((files) =>
      setBoardImageFileList(files)
    );

    if (!loginUser || loginUser.email !== writerEmail) {
      navigator(MAIN_PATH());
      return;
    }

    //comment 내용입력 창을 재조정해준다.
    if (!contentRef.current) return;
    contentRef.current.style.height = "auto";
    contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
  };

  //hook 초기화 부분
  useEffect(() => {
    const { accessToken } = cookies;
    if (!accessToken) {
      navigator(MAIN_PATH());
      return;
    }

    if (!boardNumber) return;
    getBoardRequest(boardNumber).then(getBoardResponse);
  }, []);

  return (
    <>
      <div className={cx("wrapper")}>
        <div className={cx("container")}>
          <div className={cx("box")}>
            <div className={cx("title-box")}>
              {/* //comment 제목 입력 */}
              <textarea
                ref={titleRef}
                className={cx("title-textarea")}
                value={title}
                rows={1}
                placeholder="제목을 작성해주세요."
                onChange={onTitleChangeHandler}
              />
            </div>
            <div className="divider"></div>
            <div className={cx("content-box")}>
              {/* //comment 본문 입력 */}
              <textarea
                ref={contentRef}
                className={cx("content-textarea")}
                value={content}
                placeholder="본문을 작성해 주세요."
                onChange={onContentChangeHandler}
              />
              <div
                className="icon-button"
                onClick={onImageUploadButtonClickHandler}
              >
                <div className="icon image-box-light-icon"></div>
              </div>
              {/* //comment 파일 입력 */}
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={onImageChangeHandler}
              />
            </div>
            <div className={cx("images-box")}>
              {/* //comment 이미지 미리보기 */}
              {imageUrls.map((url, idx) => (
                <div key={idx} className={cx("image-box")}>
                  <img className={cx("image")} alt="" src={url} />
                  <div
                    className="icon-button image-close"
                    onClick={() => {
                      onImageCloseButtonClickHandler(idx);
                    }}
                  >
                    <div className="icon close-icon"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
