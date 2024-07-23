import { ChangeEvent, useEffect, useRef, useState } from "react";
import "./style.css";
import { useBoardStore } from "stores";

export default function BoardWrite() {
  //const 타이틀 영역 REF
  const titleRef = useRef<HTMLTextAreaElement | null>(null);
  //const 본문 영역 REF
  const contentRef = useRef<HTMLTextAreaElement | null>(null);
  //const 파일 REF
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  //const 게시물 상태
  const { title, setTitle } = useBoardStore();
  const { content, setContent } = useBoardStore();
  const { boardImageFileList, setBoardImageFileList } = useBoardStore();
  const { resetBoard } = useBoardStore();
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

    const newImageUrls = imageUrls.filter((url, idx) => idx !== index);
    setImageUrls(newImageUrls);

    const newBoardImageFileList = boardImageFileList.filter(
      (url, idx) => idx !== index
    );
    setBoardImageFileList(newBoardImageFileList);

    //todo 제거한 이미지 blob은 URL.revokeObjectURL(url)을 이용해서 해제해야 함.
  };

  useEffect(() => {
    resetBoard();
  }, []);

  return (
    <>
      <div className="board-write-wrapper">
        <div className="board-write-container">
          <div className="board-write-box">
            <div className="board-write-title-box">
              {/* //comment 제목 입력 */}
              <textarea
                ref={titleRef}
                className="board-write-title-textarea"
                value={title}
                rows={1}
                placeholder="제목을 작성해주세요."
                onChange={onTitleChangeHandler}
              />
            </div>
            <div className="divider"></div>
            <div className="board-write-content-box">
              {/* //comment 본문 입력 */}
              <textarea
                ref={contentRef}
                className="board-write-content-textarea"
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
            <div className="board-write-images-box">
              {/* //comment 이미지 미리보기 */}
              {imageUrls.map((url, idx) => (
                <div key={idx} className="board-write-image-box">
                  <img className="board-write-image" alt="" src={url} />
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
