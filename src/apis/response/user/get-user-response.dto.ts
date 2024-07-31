import { User } from "types/interface";
import ResponseDTO from "../response.dto";

export default interface GetUserResponseDTO extends ResponseDTO, User {}
