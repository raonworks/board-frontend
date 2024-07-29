import { BoardListItem } from "types/interface";
import ResponseDTO from "../response.dto";

export default interface GetTop3BoardListResponseDTO extends ResponseDTO {
  top3BoardList: BoardListItem[];
}
