export interface Result<T = undefined> {
    code: number;
    message: string;
    data?: T;
}
