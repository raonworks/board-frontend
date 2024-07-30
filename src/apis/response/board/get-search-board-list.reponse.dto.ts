import { BoardListItem } from "types/interface";
import ResponseDTO from "../response.dto";

export default interface GetSearchBoardListResponseDTO extends ResponseDTO {
  searchList: BoardListItem[];
}
