import { CommentListItem } from "types/interface";
import ResponseDTO from "../response.dto";

export default interface GetCommentListResponseDTO extends ResponseDTO {
  commentList: CommentListItem[];
}
