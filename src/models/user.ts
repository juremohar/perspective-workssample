export interface CreateUser {
    email: string;
    name: string;
    countryId: number;
}

export interface GetUsersParams {
    sort?: string;
}
