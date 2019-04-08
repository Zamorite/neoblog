export interface Post {
    id?: any;
    author?: any;
    title: string;
    text: string;
    createdAt?: Date;
    tags?: any[];
    image?: string;
    heartCount: number;
    hearts?: any;
    field?: string;
    comments?: any[];
    commentators?: any[];
    
    date?: Date;
    exam?: string;
    answers?: any[];
    answerers?: any[];
}
