import { UsersApi } from './users-api';
import { baseUrl, paths } from './url-constants';
// @ts-ignore
import * as grpc from 'k6/net/grpc';

const client = new grpc.Client();
client.load(['../../build/extracted-protos/main', '../../build/extracted-include-protos/main'], 'users.proto')

export class UsersGrpcApi implements UsersApi {

    constructor() {
        client.connect(baseUrl.grpc, {plaintext: true})
    }

    create(user) {
        return client.invoke(`${paths.users.grpc}/Create`, user, {tags: {name: 'Create user'}});
    }
}
