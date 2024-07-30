import { useNavigate, useParams } from "react-router-dom";
import styles from "./style.module.css";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { BoardListItem } from "types/interface";
import { latestBoardListMock } from "mocks";
import BoardListItemFoo from "components/boardListItem";
import { SEARCH_PATH } from "contants";
import Pagination from "components/pagination";

export default function Search() {
  const cx = classNames.bind(styles);

  //hook Navigate 함수
  const navigator = useNavigate();

  //const 검색어 상태 관리
  const { searchWord } = useParams();
  //const 검색 게시물 리스트 상태 관리
  const [searchBoardList, setSearchBoardList] = useState<BoardListItem[]>([]);
  //const 검색 게시물 갯수 상태 관리
  const [count, setCount] = useState<number>(0);
  //const 연관 검색어 리스트 상태 관리
  const [relationList, setRelationList] = useState<string[]>([]);

  //handler 연관검색어 클릭 이벤트 처리
  const onRelationWordClickHandler = (word: string) => {
    navigator(SEARCH_PATH(word));
  };

  //hook 마운트 초기화
  useEffect(() => {
    setSearchBoardList(latestBoardListMock);
    // setRelationList(["안녕", "하시오"]);
  }, [searchWord]); //! <---- 필요한가???

  if (!searchWord) return <></>;

  return (
    <div id="wrapper" className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("title-box")}>
          <div className={cx("title")}>
            {searchWord}
            <span className={cx("title-emphasis")}>
              에 대한 검색결과 입니다.
            </span>
          </div>
          <div className={cx("count")}>{count}</div>
        </div>
        <div className={cx("contents-box")}>
          {/* //div 검색 컨텐츠 */}
          {count === 0 ? (
            <div className={cx("contents-nothing")}>검색결과 없습니다.</div>
          ) : (
            <div className={cx("contents")}>
              {searchBoardList.map((item, idx) => (
                <BoardListItemFoo key={idx} boardListItem={item} />
              ))}
            </div>
          )}
          {/* //div 검색어 */}
          <div className={cx("relation-box")}>
            <div className={cx("relation-card")}>
              <div className={cx("relation-card-container")}>
                <div className={cx("relation-card-title")}>관련 검색어</div>
                {relationList.length === 0 ? (
                  //comment 관련 검색어 없음
                  <div className={cx("relation-card-contents-nothing")}>
                    관련 검색어가 없습니다.
                  </div>
                ) : (
                  //comment 관련 검색어 출력
                  <div className={cx("relation-card-contents")}>
                    {relationList.map((item, idx) => (
                      <div
                        key={idx}
                        className={cx("word-badge")}
                        onClick={() => onRelationWordClickHandler(item)}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* //div 페이지네이션 */}
        {count !== 0 && (
          <div className={cx("pagination-box")}>{/* <Pagination /> */}</div>
        )}
      </div>
    </div>
  );
}
