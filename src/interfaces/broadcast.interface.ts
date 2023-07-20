import { PaginatedDocument } from "./apiResponse.interface";


export interface BroadcastRo {
    _id: string;
  tag: string;
  title: string;
  content: string;
  metadata: any;
  is_admin: boolean;
  is_broadcast: boolean;
  delivered: boolean;
  status: string;
    createdAt: string;
  updatedAt: string;
}

export interface AddNewBroadcastDto {
    tag: string;
    title: string;
    content: string;

    /// options
    customer_ids?: string[];
    roles?: string[]
}


export type GetBroadcasts = PaginatedDocument<BroadcastRo[]>;