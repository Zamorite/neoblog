export interface Question {
    id?: any;
    author?: any;
    title: string;
    text: string;
    exam?: string;
    date?: Date;
    tags?: any[];
    image?: string;
    answers?: any[];
    answerers?: any[];
    heartCount: number;
    hearts?: any;
}
