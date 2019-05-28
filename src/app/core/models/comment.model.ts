export interface Comment {
    id?: any;
    pid?: any;
    author?: any;
    content: string;
    heartCount: number;
    hearts?: any;
    createdAt?: Date;
    // reply id and reply author
    rid?: string;
    ra?: string;
}
  