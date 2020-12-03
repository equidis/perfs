import { UsersApi } from './users-api';
import http from 'k6/http';
import { baseUrl, paths } from './url-constants';
import { jsonContentType } from '../helpers/headers';

export const baseUsersApi = `${baseUrl.rest}${paths.users.rest}`;

export class UsersRestApi implements UsersApi {

    create(user) {
        return http.post(baseUsersApi, JSON.stringify(user), {headers: {...jsonContentType()}, tags: {name: 'Create user'}});
    }

    findById(id: string) {
        return http.get(`${baseUsersApi}/${id}`, {tags: {name: 'Find user by id'}});
    }

    findByUsername(username: string) {
        return http.get(`${baseUsersApi}?username=${username}`, {tags: {name: 'Find user by username'}});
    }
}
