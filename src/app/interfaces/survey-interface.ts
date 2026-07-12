export interface Survey {
    id:number;
    title:string;
    description:string | null;
    expires_at: string | null;
    category_id: number;
    is_published: boolean;
    created_at: string;
}