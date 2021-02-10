export const baseUrl = {
    rest: 'http://api.equidis.tk',
    grpc: 'grpc.equidis.tk:9090'
};
export const paths = {
    users: {
        rest: '/users',
        grpc: 'users.UsersService'
    },
    availabilities: {
        rest: '/availabilities',
        grpc: 'availabilities.UsersAvailabilityService'
    }
};
export const protos = {
    users: {
        dir: '../../micronaut-grpc-users-service',
        file: 'users.proto'
    },
    availability: {
        dir: '../../micronaut-grpc-availability-service',
        file: 'users_availability.proto'
    }
};
