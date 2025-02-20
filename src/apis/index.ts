import axios from "axios";
import { SignInRequestDTO, SignUpRequestDTO } from "./request/auth";
import { SignInResponseDTO, SignUpResponseDTO } from "./response/auth";
import { ResponseDTO } from "./response";
import {
  GetSignInUserResponseDTO,
  GetUserResponseDTO,
  PatchNicknameResponseDTO,
  PatchProfileImageResponseDTO,
} from "./response/user";
import {
  PatchBoardRequestDTO,
  PostBoardRequestDTO,
  PostCommentRequestDTO,
} from "./request/board";
import {
  DeleteBoardResponseDTO,
  GetBoardResponseDTO,
  GetCommentListResponseDTO,
  GetFavoriteListResponseDTO,
  GetLatestBoardListResponseDTO,
  GetPopularListResponseDTO,
  GetSearchBoardListResponseDTO,
  GetTop3BoardListResponseDTO,
  GetUserBoardListResponseDTO,
  IncreaseViewCountResponseDTO,
  PatchBoardResponseDTO,
  PostBoardResponseDTO,
  PostCommentResponseDTO,
  PutFavoriteResponseDTO,
} from "./response/board";
import { GetRelationListResponseDTO } from "./response/search";
import {
  PatchNicknameRequestDTO,
  PatchProfileImageRequestDTO,
} from "./request/user";

const DOMAIN = "http://localhost:8080";
const API_DOMAIN = `${DOMAIN}/api/v1`;
const SIGN_IN_URL = () => `${API_DOMAIN}/auth/sign-in`;
const SIGN_UP_URL = () => `${API_DOMAIN}/auth/sign-up`;
const GET_SIGN_IN_USER_URL = () => `${API_DOMAIN}/user`;
const GET_USER_URL = (email: string) => `${API_DOMAIN}/user/${email}`;
const PATCH_NICKNAME_URL = () => `${API_DOMAIN}/user/nickname`;
const PATCH_PROFILE_IMAGE_URL = () => `${API_DOMAIN}/user/profile-image`;

export const getUserRequest = async (email: string) => {
  const result = await axios(GET_USER_URL(email))
    .then((res) => {
      const body: GetUserResponseDTO = res.data;
      return body;
    })
    .catch((error) => {
      if (!error.response) return null;
      return error.response.data as ResponseDTO;
    });

  return result;
};

export const patchNicknameRequest = async (
  req: PatchNicknameRequestDTO,
  accessToken: string
) => {
  const result = await axios
    .patch(PATCH_NICKNAME_URL(), req, authorization(accessToken))
    .then((res) => {
      const body: PatchNicknameResponseDTO = res.data;
      return body;
    })
    .catch((error) => {
      if (!error.response) return null;
      return error.response.data as ResponseDTO;
    });

  return result;
};

export const patchProfileImageRequest = async (
  req: PatchProfileImageRequestDTO,
  accessToken: string
) => {
  const result = await axios
    .patch(PATCH_PROFILE_IMAGE_URL(), req, authorization(accessToken))
    .then((res) => {
      const body: PatchProfileImageResponseDTO = res.data;
      return body;
    })
    .catch((error) => {
      if (!error.response) return null;
      return error.response.data as ResponseDTO;
    });

  return result;
};

//function 로그인 요청
export const signInRequest = async (req: SignInRequestDTO) => {
  const result = await axios
    .post(SIGN_IN_URL(), req)
    .then((res) => {
      const body: SignInResponseDTO = res.data;
      return body;
    })
    .catch((error) => {
      if (!error.response.data) return null;
      const body: ResponseDTO = error.response.data;
      return body;
    });

  return result;
};

//function 회원가입 요청
export const signUpRequest = async (req: SignUpRequestDTO) => {
  const result = await axios
    .post(SIGN_UP_URL(), req)
    .then((res) => {
      const body: SignUpResponseDTO = res.data;
      return body;
    })
    .catch((error) => {
      if (!error.response.data) return null;
      const body: ResponseDTO = error.response.data;
      return body;
    });

  return result;
};

const authorization = (accessToken: string) => {
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
};

export const getSignInUserRequest = async (accessToken: string) => {
  const result = await axios
    .get(GET_SIGN_IN_USER_URL(), authorization(accessToken))
    .then((res) => {
      const resBody: GetSignInUserResponseDTO = res.data;
      return resBody;
    })
    .catch((error) => {
      if (!error.response) return null;
      const resBody: ResponseDTO = error.response.data;
      return resBody;
    });
  return result;
};

const FILE_DOMAIN = `${DOMAIN}/file`;
const FILE_UPLOAD_URL = () => `${FILE_DOMAIN}/upload`;
const multipartFormData = {
  headers: { "Content-Type": "multipart/form-data" },
};
export const fileUploadRequest = async (data: FormData) => {
  const result = await axios
    .post(FILE_UPLOAD_URL(), data, multipartFormData)
    .then((res) => {
      const resBody: string = res.data;
      return resBody;
    })
    .catch((Error) => {
      return null;
    });
  return result;
};

const GET_BOARD_URL = (boardNum: number | string) =>
  `${API_DOMAIN}/board/${boardNum}`;
const POST_BOARD_URL = () => `${API_DOMAIN}/board`;
const INCREASE_VIEW_COUNT = (boardNumber: number | string) =>
  `${API_DOMAIN}/board/${boardNumber}/increase-view-count`;
const GET_FAVORITE_LIST_URL = (boardNumber: number | string) =>
  `${API_DOMAIN}/board/${boardNumber}/favorite-list`;
const GET_COMMENT_LIST_URL = (boardNumber: number | string) =>
  `${API_DOMAIN}/board/${boardNumber}/comment-list`;
const PUT_FAVFORITE_URL = (boardNumber: number | string) =>
  `${API_DOMAIN}/board/${boardNumber}/favorite`;
const POST_COMMENT_URL = (boardNumber: number | string) =>
  `${API_DOMAIN}/board/${boardNumber}/comment`;
const DELETE_BOARD_URL = (boardNumber: number | string) =>
  `${API_DOMAIN}/board/${boardNumber}`;
const PATCH_BOARD_URL = (boardNumber: number | string) =>
  `${API_DOMAIN}/board/${boardNumber}`;
const GET_LATEST_BOARD_LIST_URL = () => `${API_DOMAIN}/board/latest-list`;
const GET_TOP_3_BOARD_LIST_URL = () => `${API_DOMAIN}/board/top-3`;
const GET_SEARCH_BOARD_LIST_URL = (
  searchWord: string,
  preSearchWord: string | undefined
) =>
  `${API_DOMAIN}/board/search-list/${searchWord}${
    preSearchWord ? "/" + preSearchWord : ""
  }`;
const GET_USER_BOARD_LIST_URL = (email: string) =>
  `${API_DOMAIN}/board/user-board-list/${email}`;

export const postBoardRequest = async (
  req: PostBoardRequestDTO,
  accessToken: string
) => {
  const result = await axios
    .post(POST_BOARD_URL(), req, authorization(accessToken))
    .then((res) => {
      const resBody: PostBoardResponseDTO = res.data;
      return resBody;
    })
    .catch((error) => {
      if (!error.response) return null;
      const resBody: ResponseDTO = error.response.data;
      return resBody;
    });
  return result;
};

export const getBoardRequest = async (boardNum: number | string) => {
  const result = await axios
    .get(GET_BOARD_URL(boardNum))
    .then((res) => {
      const resBody: GetBoardResponseDTO = res.data;
      return resBody;
    })
    .catch((error) => {
      if (!error.response) return null;
      return error.response.data as ResponseDTO;
    });

  return result;
};

export const increaseViewCountRequst = async (boardNumber: number | string) => {
  const result = await axios
    .get(INCREASE_VIEW_COUNT(boardNumber))
    .then((res) => {
      const body: IncreaseViewCountResponseDTO = res.data;
      return body;
    })
    .catch((error) => {
      if (!error.response) return null;
      return error.response.data as ResponseDTO;
    });

  return result;
};

export const getFavoriteListRequest = async (boardNumber: number | string) => {
  const result = await axios
    .get(GET_FAVORITE_LIST_URL(boardNumber))
    .then((res) => {
      const body: GetFavoriteListResponseDTO = res.data;
      return body;
    })
    .catch((error) => {
      if (!error.response) return null;
      return error.response.data as ResponseDTO;
    });

  return result;
};

export const getCommentListRequest = async (boardNumber: number | string) => {
  const result = await axios
    .get(GET_COMMENT_LIST_URL(boardNumber))
    .then((res) => {
      const body: GetCommentListResponseDTO = res.data;
      return body;
    })
    .catch((error) => {
      if (!error.response) return null;
      return error.response.data as ResponseDTO;
    });
  return result;
};

//* "좋아요" 히팅
export const putFavoriteRequest = async (
  boardNumber: number | string,
  accessToken: string
) => {
  const result = await axios
    .put(PUT_FAVFORITE_URL(boardNumber), {}, authorization(accessToken))
    .then((res) => {
      const body: PutFavoriteResponseDTO = res.data;
      return body;
    })
    .catch((error) => {
      if (!error.response) return null;
      return error.response.data as ResponseDTO;
    });

  return result;
};

//* "댓글" 달기
export const postCommentRequest = async (
  boardNumber: number | string,
  req: PostCommentRequestDTO,
  accessToken: string
) => {
  const result = await axios
    .post(POST_COMMENT_URL(boardNumber), req, authorization(accessToken))
    .then((res) => {
      const body: PostCommentResponseDTO = res.data;
      return body;
    })
    .catch((error) => {
      if (!error.response) return null;
      return error.response.data as ResponseDTO;
    });

  return result;
};

//* "게시물" 삭제
export const deleteBoardRequest = async (
  boardNumber: number | string,
  accessToken: string
) => {
  const result = await axios
    .delete(DELETE_BOARD_URL(boardNumber), authorization(accessToken))
    .then((res) => {
      const body: DeleteBoardResponseDTO = res.data;
      return body;
    })
    .catch((error) => {
      if (!error.response) return null;
      return error.response.data as ResponseDTO;
    });

  return result;
};

//* "게시물" 수정
export const patchBoardRequest = async (
  boardNumber: number | string,
  req: PatchBoardRequestDTO,
  accessToken: string
) => {
  const result = await axios
    .patch(PATCH_BOARD_URL(boardNumber), req, authorization(accessToken))
    .then((res) => {
      const body: PatchBoardResponseDTO = res.data;
      return body;
    })
    .catch((error) => {
      if (!error.response) return null;
      return error.response.data as ResponseDTO;
    });

  return result;
};

export const getLatestBoardListRequest = async () => {
  const result = await axios(GET_LATEST_BOARD_LIST_URL())
    .then((res) => {
      const body: GetLatestBoardListResponseDTO = res.data;
      return body;
    })
    .catch((error) => {
      if (!error.response) return null;
      return error.response.data as ResponseDTO;
    });

  return result;
};

export const getTop3BoardListRequest = async () => {
  const result = await axios(GET_TOP_3_BOARD_LIST_URL())
    .then((res) => {
      const body: GetTop3BoardListResponseDTO = res.data;
      return body;
    })
    .catch((error) => {
      if (!error.response) return null;
      return error.response.data as ResponseDTO;
    });

  return result;
};

export const getSearchBoardListRequest = async (
  searchWord: string,
  preSearchWord: string | undefined
) => {
  const result = await axios(
    GET_SEARCH_BOARD_LIST_URL(searchWord, preSearchWord)
  )
    .then((res) => {
      const body: GetSearchBoardListResponseDTO = res.data;
      return body;
    })
    .catch((error) => {
      if (!error.response) return null;
      return error.response.data as ResponseDTO;
    });

  return result;
};

const GET_POPULAR_LIST_URL = () => `${API_DOMAIN}/search/popular-list`;
const GET_RELATION_LIST_URL = (searchWord: string) =>
  `${API_DOMAIN}/search/${searchWord}/relation-list`;

export const getPopularListRequest = async () => {
  const result = await axios(GET_POPULAR_LIST_URL())
    .then((res) => {
      const body: GetPopularListResponseDTO = res.data;
      return body;
    })
    .catch((error) => {
      if (!error.response) return null;
      return error.response.data as ResponseDTO;
    });

  return result;
};

export const getRelationListRequest = async (searchWord: string) => {
  const result = await axios(GET_RELATION_LIST_URL(searchWord))
    .then((res) => {
      const body: GetRelationListResponseDTO = res.data;
      return body;
    })
    .catch((error) => {
      if (!error.response) return null;
      return error.response.data as ResponseDTO;
    });

  return result;
};

export const getUserBoardListRequest = async (email: string) => {
  const result = await axios(GET_USER_BOARD_LIST_URL(email))
    .then((res) => {
      const body: GetUserBoardListResponseDTO = res.data;
      return body;
    })
    .catch((error) => {
      if (!error.response) return null;
      return error.response.data as ResponseDTO;
    });

  return result;
};
