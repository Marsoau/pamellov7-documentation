import { PamelloEntityDto } from "./Base/PamelloEntityDto";

export class PamelloUserDto extends PamelloEntityDto {
    AvatarUrl?: string | null;
    SelectedPlayerId?: number | null;
    SelectedAuthorizationIndex?: number | null;
    JoinedAt!: string;
    AddedSongsIds!: number[];
    AddedPlaylistsIds!: number[];
    FavoriteSongsIds!: number[];
    FavoritePlaylistsIds!: number[];
    AuthorizationsPlatformKeys!: string[];
    IsAdministrator!: boolean;
}
