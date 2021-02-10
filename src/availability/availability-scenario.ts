import { group } from 'k6';
import { profileConfig } from '../config/profile-config';
import { UsersGrpcApi } from '../users/users-grpc-api';
import { UsersRestApi } from '../users/users-rest-api';
import { body, hasAtLeastSize, isOk } from '../helpers/assertions';
import { UsersAvailabilityRestApi } from './users-availability-rest-api';
import { UsersAvailabilityApi } from './users-availability-api';
import { checkInterval } from '../helpers/utils';
import { conflictResponseChecks, createResponseChecks, notFoundResponseChecks, okResponseChecks } from '../helpers/checks';
import { UsersAvailabilityGrpcApi } from './users-availability-grpc-api';

type User = { username: string, id: string };

export const options = profileConfig();

export class AvailabilityScenario implements Scenario {
    setup(): User {
        const usersApi = options.rest ? new UsersRestApi() : new UsersGrpcApi();
        const response = usersApi.create({
            username: 'k6availabilitytest',
            email: 'k6availabilitytest@mail.com',
            first_name: 'K6',
            last_name: 'Test',
            phone_number: '123456789',
            country_code: 'FR'
        });
        if (!isOk(response)) throw new Error('Unable to create an initial user');
        return body(response);
    }

    run(user: User): any {
        const availability = declareAvailabilityRequest(user.id);
        const interval = options.callInterval;
        const availabilityApi = options.rest ? new UsersAvailabilityRestApi() : new UsersAvailabilityGrpcApi();
        return group(`Availability lifecycle`, () => {
            const createdAvailability = availabilityDeclaration(availabilityApi, availability, interval);
            if (createdAvailability) {
                availabilityRetrieval(availabilityApi, createdAvailability, user, options.findIterations, interval);
                missingAvailability(availabilityApi, options.findIterations);
                return createdAvailability.id;
            }
        });
    }

}

function availabilityDeclaration(availabilityApi: UsersAvailabilityApi, availability, interval: number) {
    return group('Availability declaration', () => {
        const created = group('Declare new availability', () => {
            const response = availabilityApi.declareAvailability(availability);
            checkInterval(interval, response, createResponseChecks);
            if (isOk(response)) {
                const body = response.message || response.json();
                return body.id && body;
            }
        });
        if (created) {
            group('Already existing user availability', () => {
                checkInterval(interval, availabilityApi.declareAvailability(availability), conflictResponseChecks);
            });
        }
        return created;
    });
}

function missingAvailability(availabilityApi: UsersAvailabilityApi, interval: number) {
    group('Error when availability id does not exists', () => {
        checkInterval(interval, availabilityApi.findById('123456789012345678901234'), notFoundResponseChecks);
    });
}

function availabilityRetrieval(availabilityApi: UsersAvailabilityApi, availability, user: User, iterations: number, interval: number) {
    [...Array(iterations).keys()].map(_ => {
        group('Availability retrieval', () => {
            group('Find availability by id', () => {
                checkInterval(interval, availabilityApi.findById(availability.id), okResponseChecks(availability.id));
            });
            group('Find availability by user id', () => {
                checkInterval(interval, availabilityApi.findByUser(user.id), {
                    'http code is ok': isOk,
                    'is not empty': r => hasAtLeastSize(r, b => body(b).usersAvailabilities, 1)
                });
            });
            group('Find availability by username', () => {
                checkInterval(interval, availabilityApi.findByUser(null, user.username), {
                    'http code is ok': isOk,
                    'is not empty': r => hasAtLeastSize(r, b => body(b).usersAvailabilities, 1)
                });
            });
        });
    });
}

function declareAvailabilityRequest(userId: string) {
    const date = new Date();
    const days = parseInt(__VU.toString() + __ITER.toString());
    date.setDate(date.getDate() + days);
    const day = date.toISOString().substring(0, 10);
    return {userId, day, arrangement: 0}
}
