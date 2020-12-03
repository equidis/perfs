import { UsersAvailabilityApi } from './users-availability-api';
import http from 'k6/http';
import { baseUrl, paths } from './url-constants';
import { jsonContentType } from '../helpers/headers';

export const baseAvailabilitiesApi = `${baseUrl.rest}${paths.availabilities.rest}`;

export class UsersAvailabilityRestApi implements UsersAvailabilityApi {

    declareAvailability(availability) {
        return http.post(baseAvailabilitiesApi, JSON.stringify(availability), {
            headers: {...jsonContentType()},
            tags: {name: 'Declare availability'}
        });
    }

    findById(id: string) {
        return http.get(`${baseAvailabilitiesApi}/${id}`, {tags: {name: 'Find availability by id'}});
    }

    findByUser(userId?: string, username?: string) {
        return http.get(`${baseAvailabilitiesApi}?username=${username}&userId=${userId}`, {tags: {name: 'Find availability'}});
    }
}
