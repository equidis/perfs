import { UsersAvailabilityApi } from './users-availability-api';
import { baseUrl, paths, protos } from '../url-constants';
// @ts-ignore
import * as grpc from 'k6/net/grpc';

const client = new grpc.Client();
client.load(
    [`${protos.availability.dir}/src/main/proto`, `${protos.availability.dir}/build/extracted-include-protos/main`],
    protos.availability.file
)

export class UsersAvailabilityGrpcApi implements UsersAvailabilityApi {

    constructor() {
        client.connect(baseUrl.grpc, {plaintext: true})
    }

    declareAvailability(availability) {
        return client.invoke(`${paths.availabilities.grpc}/DeclareAvailability`, availability, {tags: {name: 'Declare availability'}});
    }

    findById(id: string) {
        return client.invoke(`${paths.availabilities.grpc}/FindById`, {id}, {tags: {name: 'Find availability by id'}});
    }

    findByUser(userId?: string, username?: string) {
        return client.invoke(`${paths.availabilities.grpc}/FindByUser`, {userId, username}, {tags: {name: 'Find user'}});
    }
}
