import { PamelloEntityDto } from "./Base/PamelloEntityDto";

export class PamelloPlaylistDto extends PamelloEntityDto {
    Owner!: number;
    IsProtected!: boolean;
    Songs!: number[];
    FavoriteByIds!: number[];
}
