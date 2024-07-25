import { FavoriteLiteItem } from "types/interface";
import EmptyProfileImage from "assets/images/empty_profile.jpg";
import "./style.css";

interface propsType {
  favoriteListItem: FavoriteLiteItem;
}

export default function FavoriteItem({ favoriteListItem }: propsType) {
  const { email, nickname, profileImage } = favoriteListItem;
  return (
    <>
      <div className="favorite-item-list">
        <div className="favorite-item-list-profile-box">
          <div
            className="favorite-item-list-profile-image"
            style={{
              backgroundImage: `url(${profileImage ?? EmptyProfileImage})`,
            }}
          ></div>
        </div>
        <div className="favorite-item-list-nickname">{nickname}</div>
      </div>
    </>
  );
}
