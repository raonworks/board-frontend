import { BoardListItem } from "types/interface";
import ResponseDTO from "../response.dto";

export default interface GetUserBoardListResponseDTO extends ResponseDTO {
  userBoardList: BoardListItem[];
}
