import { EventTypeInfo } from "./EventTypeInfo";

export interface ReceivedEventJsonDto {
    Types: EventTypeInfo[];
    Data: any;
}
