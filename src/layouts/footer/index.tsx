import "./style.css";

export default function Footer() {
  //todo: 인스타 홈페이지로 이동
  const onClickInstaIconHandler = () => {
    window.open("http://www.instagram.com");
  };

  //todo: 네이버 험페이지로 이동
  const onClickNaverIconHandler = () => {
    window.open("http://www.naver.com");
  };

  return (
    <>
      <div id="footer">
        <div className="footer-container">
          {/* 상단 영역 */}
          <div className="footer-top">
            <div className="footer-logo-box">
              <div className="icon-box">
                <div className="icon logo-light-icon"></div>
              </div>
              <div className="footer-logo-text">SPRING&REACT</div>
            </div>
            <div className="footer-link-box">
              <div className="footer-email-link">popodaddy@gmail.com</div>
              <div className="icon-button" onClick={onClickInstaIconHandler}>
                <div className="icon insta-icon"></div>
              </div>
              <div className="icon-button" onClick={onClickNaverIconHandler}>
                <div className="icon naver-blog-icon"></div>
              </div>
            </div>
          </div>
          {/* 하단 영역 */}
          <div className="footer-bottom">
            <div className="footer-copyright">
              Copyright ⓒ 2024 devhong. All Right Reserved.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
