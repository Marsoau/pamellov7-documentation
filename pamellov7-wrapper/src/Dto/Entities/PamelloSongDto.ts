import { PamelloEntityDto } from "./Base/PamelloEntityDto";

export class PamelloSongDto extends PamelloEntityDto {
    CoverUrl!: string;
    AddedBy!: number;
    AddedAt!: string;
    Associations!: string[];
    FavoriteBy!: number[];
    Episodes!: number[];
    Playlists!: number[];
    SelectedSourceIndex!: number;
    SourcesPlatformKeys!: string[];
}
