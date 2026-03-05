import { PamelloEntityDto } from "./Base/PamelloEntityDto";

export class PamelloEpisodeDto extends PamelloEntityDto {
    Start!: number;
    AutoSkip!: boolean;
    SongId!: number;
}
