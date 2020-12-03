import { group } from 'k6';
import { profileConfig } from './config/profile-config';
import { UsersApi } from './apis/users-api';
import { checkInterval, rangeVuIterSuffix } from './helpers/utils';
import { conflictResponseChecks, createResponseChecks, notFoundResponseChecks, okResponseChecks } from './helpers/checks';
import { isOk } from './helpers/assertions';
import { UsersGrpcApi } from './apis/users-grpc-api';
import { UsersRestApi } from './apis/users-rest-api';

export const options = profileConfig();

const userTemplate = {
    username: 'k6test',
    email: 'k6test@mail.com',
    first_name: 'K6',
    last_name: 'Test',
    phone_number: '123456789',
    country_code: 'FR'
}

export default () => {
    userLifecycle(contextualizeUser(userTemplate));
}

function userLifecycle(user) {
    const interval = options.callInterval;
    const userApi = options.rest ? new UsersRestApi() : new UsersGrpcApi();
    return group(`User lifecycle`, () => {
        const createdUser = userCreation(userApi, user, interval);
        if (createdUser) {
            userRetrieval(userApi, createdUser, options.findIterations, interval);
            missingUser(userApi, options.findIterations);
            return createdUser.id;
        }
    });
}

function userCreation(userApi: UsersApi, user, interval: number) {
    return group('User creation', () => {
        const created = group('New user creation', () => {
            const response = userApi.create(user);
            checkInterval(interval, response, createResponseChecks);
            if (isOk(response)) {
                const body = response.message || response.json();
                return body.id && body;
            }
        });
        if (created) {
            group('Already existing user creation', () => {
                checkInterval(interval, userApi.create(user), conflictResponseChecks);
            });
        }
        return created;
    });
}

function missingUser(userApi: UsersApi, interval: number) {
    group('Error when user id does not exists', () => {
        checkInterval(interval, userApi.findById('123456789012345678901234'), notFoundResponseChecks);
    });
}

function userRetrieval(userApi: UsersApi, user, iterations: number, interval: number) {
    [...Array(iterations).keys()].map(_ => {
        group('User retrieval', () => {
            group('Find user by id', () => {
                checkInterval(interval, userApi.findById(user.id), okResponseChecks(user.id));
            });
            group('Find user by username', () => {
                checkInterval(interval, userApi.findByUsername(user.username), okResponseChecks(user.id));
            });
        });
    });
}

function contextualizeUser(user, suffix = rangeVuIterSuffix()) {
    const username = `${user.username}${suffix}`
    return {...user, username, email: `${username}@mail.com`}
}
