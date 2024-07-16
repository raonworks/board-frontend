import "./style.css";
import { useNavigate, useParams } from "react-router-dom";
import { MAIN_PATH, SEARCH_PATH } from "contants";
import { ChangeEvent, useEffect, useRef, useState } from "react";

export default function Header() {
  //로고를 클릭하면 메인으로 가도록 설정
  const navigator = useNavigate();
  const onClickLogoHandler = () => {
    navigator(MAIN_PATH());
  };
  const SearchButton = () => {
    const [status, setStatus] = useState<boolean>(false);
    const [searchWord, setSearchWord] = useState<string>("");
    const searchWordRef = useRef<HTMLDivElement | null>(null);
    const { word } = useParams();

    const onChangeSearchWordChangeHandler = (
      e: ChangeEvent<HTMLInputElement>
    ) => {
      const value = e.target.value;
      setSearchWord(value);
    };

    const onKeydownSearchWordHandler: React.KeyboardEventHandler<
      HTMLInputElement
    > = (e) => {
      if (e.key !== "Enter") return;
      searchWordRef.current?.click();
    };

    const onClickSearchButtonHandler = () => {
      if (!status) {
        setStatus(!status);
        return;
      }
      navigator(SEARCH_PATH(searchWord));
    };

    useEffect(() => {
      if (word) {
        setSearchWord(word);
        setStatus(true);
      }
    }, [word]);

    if (!status)
      return (
        <div className="icon-button" onClick={onClickSearchButtonHandler}>
          <div className="icon search-light-icon"></div>
        </div>
      );

    return (
      <div className="header-search-input-box">
        <input
          className="header-search-input"
          type="text"
          value={searchWord}
          onChange={onChangeSearchWordChangeHandler}
          onKeyDown={onKeydownSearchWordHandler}
          placeholder="검색어를 입력해주세요."
        />
        <div
          ref={searchWordRef}
          className="icon-button"
          onClick={onClickSearchButtonHandler}
        >
          <div className="icon search-light-icon"></div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div id="header">
        <div className="header-container">
          <div className="header-left-box" onClick={onClickLogoHandler}>
            <div className="icon-box">
              <div className="icon logo-light-icon" />
            </div>
            <div className="header-logo">SPRING&REACT</div>
          </div>
          <div className="header-right-box">
            <SearchButton />
          </div>
        </div>
      </div>
    </>
  );
}
