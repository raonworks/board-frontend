import ResponseDTO from "../response.dto";

export default interface SignInResponseDTO extends ResponseDTO {
  token: string;
  expirationTime: number;
}
