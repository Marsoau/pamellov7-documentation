import { PamelloEntityDto } from "./Base/PamelloEntityDto";
import { PamelloQueueDto } from "./Other/PamelloQueueDto";

export class PamelloPlayerDto extends PamelloEntityDto {
    OwnerId!: number;
    IsProtected!: boolean;
    IsPaused!: boolean;
    Queue!: PamelloQueueDto;
}
