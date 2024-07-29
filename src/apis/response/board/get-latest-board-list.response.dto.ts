import { BoardListItem } from "types/interface";
import ResponseDTO from "../response.dto";

export default interface GetLatestBoardListResponseDTO extends ResponseDTO {
  latestList: BoardListItem[];
}
