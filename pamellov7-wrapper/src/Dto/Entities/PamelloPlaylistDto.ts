import { PamelloEntityDto } from "./Base/PamelloEntityDto";

export class PamelloPlaylistDto extends PamelloEntityDto {
    OwnerId!: number;
    IsProtected!: boolean;
    SongsIds!: number[];
    FavoriteByIds!: number[];
}
