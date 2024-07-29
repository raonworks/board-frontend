import Top3Item from "components/Top3Item";
import styles from "./style.module.css";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { BoardListItem } from "types/interface";
import { latestBoardListMock, top3BoardListMock } from "mocks";
import BoardListItemFoo from "components/boardListItem";
import Pagination from "components/pagination";
import { useNavigate } from "react-router-dom";
import { SEARCH_PATH } from "contants";

export default function Main() {
  const cx = classNames.bind(styles);

  //hook 네이게이터
  const navigator = useNavigate();

  //#메인 화면 상단
  const MainTop = () => {
    //const 주간 top-3 리스트 상태 관리
    const [top3BoardList, setTop3BoardList] = useState<BoardListItem[]>([]);

    //hook 마운트 초기화
    useEffect(() => {
      setTop3BoardList(top3BoardListMock);
    }, []);

    //comment 렌더링
    return (
      <div>
        <div id="top-wrapper" className={cx("top-wrapper")}>
          <div className={cx("top-container")}>
            <div className={cx("top-title")}>
              {"Nomad Board에서\n다양한 이야기를 나눠보세요"}
            </div>
            <div className={cx("top-contents-box")}>
              <div className={cx("top-contents-title")}>주간 TOP 3 게시글</div>
              <div className={cx("top-contents")}>
                {top3BoardList.map((item, idx) => (
                  <Top3Item key={idx} props={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  //#메인 화면 하단
  const MainBottom = () => {
    //const 최근 게시물 리스트 상태 관리
    const [currentBoardList, setCurrentBoardList] = useState<BoardListItem[]>(
      []
    );
    //const 인기 검색어 리스트 상태
    const [popularWordList, setPopularWordList] = useState<string[]>([]);

    //handler 인기검색어 클릭 이벤트
    const onPopularWordClickHandler = (word: string) => {
      navigator(SEARCH_PATH(word));
    };

    //hook 마운트 초기화
    useEffect(() => {
      setCurrentBoardList(latestBoardListMock);
      setPopularWordList(["안녕", "잘가", "또봐"]);
    }, []);

    //comment 렌더링
    return (
      <div id="bottom-wrapper" className={cx("bottom-wrapper")}>
        <div className={cx("bottom-container")}>
          <div className={cx("bottom-title")}>최신 게시물</div>
          <div className={cx("bottom-contents-box")}>
            {/* //div 컨텐츠 부분 */}
            <div className={cx("bottom-current-contents")}>
              {currentBoardList.map((item, idx) => (
                <BoardListItemFoo key={idx} boardListItem={item} />
              ))}
            </div>
            {/* //div 인기 검색어 부분 */}
            <div className={cx("bottom-popular-box")}>
              <div className={cx("bottom-popular-card")}>
                <div className={cx("bottom-popular-card-conatainer")}>
                  <div className={cx("bottom-popular-card-title")}>
                    인기 검색어
                  </div>
                  <div className={cx("bottom-popular-card-contents")}>
                    {popularWordList.map((word, idx) => (
                      <div
                        onClick={() => onPopularWordClickHandler(word)}
                        key={idx}
                        className={cx("word-badge")}
                      >
                        {word}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={cx("bottom-pagination-box")}>
            {/* <Pagination /> */}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <MainTop />
      <MainBottom />
    </>
  );
}
