import { profileConfig } from './config/profile-config';
import { UsersScenario } from './users/users-scenario';
import { AvailabilityScenario } from './availability/availability-scenario';

export const options = profileConfig();

const scenario = options.scenario === 'availability' ? new AvailabilityScenario() : new UsersScenario();

export function setup(): any {
    return scenario.setup();
}

export default (data: any) => scenario.run(data);
