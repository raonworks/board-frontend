import { useNavigate, useParams } from "react-router-dom";
import styles from "./style.module.css";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { BoardListItem } from "types/interface";
import { latestBoardListMock } from "mocks";
import BoardListItemFoo from "components/boardListItem";
import { SEARCH_PATH } from "contants";
import Pagination from "components/pagination";
import { getRelationListRequest, getSearchBoardListRequest } from "apis";
import { GetSearchBoardListResponseDTO } from "apis/response/board";
import { ResponseDTO } from "apis/response";
import { usePagination } from "hooks";
import { GetRelationListResponseDTO } from "apis/response/search";

export default function Search() {
  const cx = classNames.bind(styles);

  //hook Navigate 함수
  const navigator = useNavigate();

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

  //const 검색어 상태 관리
  const { searchWord } = useParams();
  //const 이전 검색어 상태 관리
  const [preSearchWord, setPreSearchWord] = useState<string | undefined>(
    undefined
  );
  //const 검색 게시물 갯수 상태 관리
  const [count, setCount] = useState<number>(0);
  //const 연관 검색어 리스트 상태 관리
  const [relativeWordList, setRelativeWordList] = useState<string[]>([]);

  //handler 연관검색어 클릭 이벤트 처리
  const onRelationWordClickHandler = (word: string) => {
    navigator(SEARCH_PATH(word));
  };

  //function
  const getSearchBoardListResponse = (
    res: GetSearchBoardListResponseDTO | ResponseDTO | null
  ) => {
    if (!res) return;

    const { code } = res;
    if (code === "DBE") alert("데이터베이스 오류입니다");
    if (code !== "SU") return;

    if (!searchWord) return;

    const { searchList } = res as GetSearchBoardListResponseDTO;
    setTotalList(searchList);
    setCount(searchList.length);
    setPreSearchWord(searchWord);
  };
  //function
  const getRelationListResponse = (
    res: GetRelationListResponseDTO | ResponseDTO | null
  ) => {
    if (!res) return;

    const { code } = res;
    if (code === "DBE") alert("데이터베이스 오류입니다");
    if (code !== "SU") return;

    if (!searchWord) return;

    const { relativeWordList } = res as GetRelationListResponseDTO;
    setRelativeWordList(relativeWordList);
  };

  //hook 마운트 초기화
  useEffect(() => {
    if (!searchWord) return;
    getSearchBoardListRequest(searchWord, preSearchWord).then(
      getSearchBoardListResponse
    );
    getRelationListRequest(searchWord).then(getRelationListResponse);
  }, []);

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
              {viewList.map((item, idx) => (
                <BoardListItemFoo key={idx} boardListItem={item} />
              ))}
            </div>
          )}
          {/* //div 검색어 */}
          <div className={cx("relation-box")}>
            <div className={cx("relation-card")}>
              <div className={cx("relation-card-container")}>
                <div className={cx("relation-card-title")}>관련 검색어</div>
                {relativeWordList.length === 0 ? (
                  //comment 관련 검색어 없음
                  <div className={cx("relation-card-contents-nothing")}>
                    관련 검색어가 없습니다.
                  </div>
                ) : (
                  //comment 관련 검색어 출력
                  <div className={cx("relation-card-contents")}>
                    {relativeWordList.map((item, idx) => (
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
          <div className={cx("pagination-box")}>
            <Pagination
              currentPage={currentPage}
              currentSection={currentSection}
              totalSection={totalSection}
              viewPageList={viewPageList}
              setCurentSection={setCurrentSection}
              setCurrentPage={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
