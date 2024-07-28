import { Dispatch, SetStateAction } from "react";
import styles from "./style.module.css";
import classNames from "classnames/bind";

//# 프롭스 인터페이서
interface PropsType {
  currentPage: number;
  currentSection: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  setCurentSection: Dispatch<SetStateAction<number>>;
  viewPageList: number[];
  totalSection: number;
}

export default function Pagination(props: PropsType) {
  const { currentPage, currentSection, viewPageList, totalSection } = props;
  const { setCurentSection, setCurrentPage } = props;

  const cx = classNames.bind(styles);

  //handler 페이지 클릭 이벤트
  const onPageClickHandler = (page: number) => {
    setCurrentPage(page);
  };
  //handler 이전 클릭 이벤트
  const onPreviousClickHandler = () => {
    if (1 === currentSection) return;
    setCurrentPage((currentSection - 1) * 10);
    setCurentSection(currentSection - 1);
  };
  //handler 다음 클릭 이벤트
  const onNextClickHandler = () => {
    if (totalSection === currentSection) return;
    setCurrentPage(currentSection * 10 + 1);
    setCurentSection(currentSection + 1);
  };

  //# 렌더링
  return (
    <div id="wrapper" className={cx("wrapper")}>
      <div className={cx("change-link-box")}>
        <div className="icon-box-small">
          <div className="icon left-light-icon"></div>
        </div>
        <div
          className={cx("change-link-text")}
          onClick={onPreviousClickHandler}
        >
          이전
        </div>
      </div>
      <div className={cx("divider")}>|</div>
      {viewPageList.map((page, idx) =>
        page === currentPage ? (
          <div key={idx} className={cx("text-active")}>
            {page}
          </div>
        ) : (
          <div
            key={idx}
            className={cx("text")}
            onClick={() => onPageClickHandler(page)}
          >
            {page}
          </div>
        )
      )}
      <div className={cx("divider")}>|</div>
      <div className={cx("change-link-box")}>
        <div className={cx("change-link-text")} onClick={onNextClickHandler}>
          다음
        </div>
        <div className="icon-box-small">
          <div className="icon right-light-icon"></div>
        </div>
      </div>
    </div>
  );
}
