import { PamelloEntityDto } from "./Base/PamelloEntityDto";

export class PamelloSongDto extends PamelloEntityDto {
    CoverUrl!: string;
    AddedById!: number;
    AddedAt!: string;
    Associations!: string[];
    FavoriteByIds!: number[];
    EpisodesIds!: number[];
    PlaylistsIds!: number[];
    SelectedSourceIndex!: number;
    SourcesPlatformKeys!: string[];
}
