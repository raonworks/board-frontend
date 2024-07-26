import { FavoriteLiteItem } from "types/interface";
import ResponseDTO from "../response.dto";

export default interface GetFavoriteListResponseDTO extends ResponseDTO {
  favoriteList: FavoriteLiteItem[];
}
