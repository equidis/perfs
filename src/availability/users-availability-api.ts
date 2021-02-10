export interface UsersAvailabilityApi {

    declareAvailability(availability)

    findById(id: string)

    findByUser(userId?: string, username?: string)
}
