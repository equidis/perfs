import { UsersApi } from './users-api';
// @ts-ignore
import * as grpc from 'k6/net/grpc';
import { baseUrl, paths, protos } from '../url-constants';

const client = new grpc.Client();
client.load([`${protos.users.dir}/src/main/proto`, `${protos.users.dir}/build/extracted-include-protos/main`], protos.users.file)

export class UsersGrpcApi implements UsersApi {

    constructor() {
        client.connect(baseUrl.grpc, {plaintext: true})
    }

    create(user) {
        return client.invoke(`${paths.users.grpc}/Create`, user, {tags: {name: 'Create user'}});
    }

    findById(id: string) {
        return client.invoke(`${paths.users.grpc}/FindById`, {id}, {tags: {name: 'Find user by id'}});
    }

    findByUsername(username: string) {
        return client.invoke(`${paths.users.grpc}/FindByUsername`, {username}, {tags: {name: 'Find user by username'}});
    }
}
