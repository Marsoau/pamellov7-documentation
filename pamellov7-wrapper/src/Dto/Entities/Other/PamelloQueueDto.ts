export class PamelloQueueDto {
    CurrentSongId?: number | null;
    CurrentSongTimePassed!: number;
    CurrentSongTimeTotal!: number;
    Entries!: PamelloQueueEntryDto[];
    Position!: number;
    NextPositionRequest?: number | null;
    CurrentEpisodePosition?: number | null;
    IsRandom!: boolean;
    IsReversed!: boolean;
    IsNoLeftovers!: boolean;
    IsFeedRandom!: boolean;
}

export class PamelloQueueEntryDto {
    Song!: number;
    Adder!: number;
}
