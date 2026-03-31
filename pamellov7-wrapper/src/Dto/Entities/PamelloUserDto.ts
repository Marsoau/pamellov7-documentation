import { PamelloEntityDto } from "./Base/PamelloEntityDto";

export class PamelloUserDto extends PamelloEntityDto {
    AvatarUrl?: string | null;
    SelectedPlayer?: number | null;
    SelectedAuthorizationIndex?: number | null;
    JoinedAt!: string;
    AddedSongs!: number[];
    AddedPlaylists!: number[];
    FavoriteSongs!: number[];
    FavoritePlaylists!: number[];
    AuthorizationsPlatformKeys!: string[];
    IsAdministrator!: boolean;
}
