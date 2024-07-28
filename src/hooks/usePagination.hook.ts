import { useCallback, useEffect, useState } from "react";

const usePagination = <T>(countPerPage: number) => {
  //const 전체 객체 리스트 상태
  const [totalList, setTotalList] = useState<T[]>([]);
  //const 보여줄 객체 리스트 상태
  const [viewList, setViewList] = useState<T[]>([]);
  //const 현재 페이지 번호 상태
  const [currentPage, setCurrentPage] = useState<number>(1);
  //const 전체 페이지 번호 리스트 상태
  const [totalPageList, setTotalPageList] = useState<number[]>([1]);
  //const 보여줄 페이지 번호 리스트 상태
  const [viewPageList, setViewPageList] = useState<number[]>([1]);
  //const 현재 섹션 상태
  const [currentSection, setCurrentSection] = useState<number>(1);
  //const 전체 섹션 상태
  const [totalSection, setTotalSection] = useState<number>(1);

  //function 보여줄 객체 리스트 추출 함수
  const setView = () => {
    const FIRST_INDEX = countPerPage * (currentPage - 1);
    let LAST_INDEX = countPerPage * currentPage;

    //comment 제한번위 조정
    LAST_INDEX = totalList.length > LAST_INDEX ? LAST_INDEX : totalList.length;

    const viewList = totalList.slice(FIRST_INDEX, LAST_INDEX);
    setViewList(viewList);
  };

  //function 보여줄 페이지 리스트 추출 함수
  const setViewPage = useCallback(() => {
    const FIRST_INDEX = 10 * (currentSection - 1);
    let LAST_INDEX = 10 * currentSection;

    //comment 제한범위 조정
    LAST_INDEX =
      totalPageList.length > LAST_INDEX ? LAST_INDEX : totalPageList.length;

    const viewPageList = totalPageList.slice(FIRST_INDEX, LAST_INDEX);
    setViewPageList(viewPageList);
  }, [totalPageList, currentSection]);

  //hook total list가 변경될 때마다
  useEffect(() => {
    const totalPage = Math.ceil(totalList.length / countPerPage);
    const newTotalPageList = Array.from({ length: totalPage }, (_, i) => i + 1);
    const newTotalSection = Math.ceil(totalList.length / (countPerPage * 10));

    setTotalPageList(newTotalPageList);
    setTotalSection(newTotalSection);
    setCurrentPage(1);
    setCurrentSection(1);
    setView();
    //setViewPage();
  }, [totalList]);

  //hook current page가 변경될 때마다
  useEffect(() => {
    setView();
  }, [currentPage]);

  //hook
  useEffect(() => {
    setViewPage();
  }, [setViewPage]);

  return {
    currentPage,
    currentSection,
    viewList,
    viewPageList,
    totalSection,
    setTotalList,
    setCurrentPage,
    setCurrentSection,
  };
};

export default usePagination;
