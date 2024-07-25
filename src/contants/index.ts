export const MAIN_PATH = () => "/";
export const AUTH_PATH = () => "/auth";
export const SEARCH_PATH = (word: string) => `/search/${word}`;
export const USER_PATH = (email: string) => `/user/${email}`;
export const BOARD_PATH = () => "/board";
export const BOARD_DETAIL_PATH = (boardNumber: string | number) =>
  `detail/${boardNumber}`;
export const BOARD_WRITE_PATH = () => "write";
export const BOARD_UPDATE_PATH = (boardNumber: string | number) =>
  `update/${boardNumber}`;
