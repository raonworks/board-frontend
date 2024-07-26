import { Board } from "types/interface";
import ResponseDTO from "../response.dto";

export default interface GetBoardResponseDTO extends ResponseDTO, Board {}
