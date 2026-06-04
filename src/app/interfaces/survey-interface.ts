export interface Survey {
    id:number;
    title:string;
    description:string;
    expires_at: string;
    category_id: number;
    is_published: boolean;
    created_at: string;
}