import { Profile } from './profile';
import { Options } from 'k6/options';

export type ExtendedOptions = Partial<Options> & InitDataOptions;

interface InitDataOptions {
    callInterval: number;
    init: number,
    findIterations: number,
    rest: boolean
}

export function profileConfig(): ExtendedOptions {
    switch (profile()) {
        case Profile.SMOKE:
            return smokeConfiguration();
        case Profile.LOAD:
            return loadConfiguration();
        case Profile.STRESS:
            return stressConfiguration();
        case Profile.SOAK:
            return soakConfiguration();
    }
}

export function profile(): Profile {
    const envProfile = __ENV.profile?.toUpperCase() || Profile[Profile.SMOKE];
    return Profile[envProfile];
}

function apiTypeConfig(): { rest: boolean } {
    return {rest: (__ENV.rest !== 'false' && !!__ENV.rest),}
}

function smokeConfiguration(): ExtendedOptions {
    return {
        ...apiTypeConfig(),
        callInterval: 0,
        init: envNumberVar('init_iter') || 0,
        findIterations: envNumberVar('find_iter') || 1,
    };
}

function loadConfiguration(): ExtendedOptions {
    const networkLatency = envNumberVar('network_latency') || 0;
    return {
        ...apiTypeConfig(),
        stages: [
            {duration: '30s', target: envNumberVar('plateau_target') || 200},
            {duration: __ENV.plateau_duration || '2m', target: envNumberVar('plateau_target') || 200},
            {duration: '30s', target: 0}
        ],
        thresholds: {
            http_req_duration: [`avg<${networkLatency + 20}`, `p(90)<${networkLatency + 50}`, `p(99)<${networkLatency + 500}`]
        },
        callInterval: envNumberVar('call_interval') || 1,
        teardownTimeout: '5m',
        init: envNumberVar('init_iter') || 100,
        findIterations: envNumberVar('find_iter') || 10,
    };
}

function stressConfiguration(): ExtendedOptions {
    return {
        ...apiTypeConfig(),
        stages: [
            {duration: '30s', target: envNumberVar('plateau_target') || 20},
            {duration: __ENV.plateau_duration || '2m', target: envNumberVar('plateau_target') || 20},
            {duration: '30s', target: 0}
        ],
        callInterval: 0,
        teardownTimeout: '5m',
        init: envNumberVar('init_iter') || 100,
        findIterations: envNumberVar('find_iter') || 10,
    };
}

function soakConfiguration(): ExtendedOptions {
    return {
        ...apiTypeConfig(),
        stages: [
            {duration: '30m', target: envNumberVar('plateau_target') || 200},
            {duration: __ENV.plateau_duration || '4h', target: envNumberVar('plateau_target') || 200},
            {duration: '30m', target: 0}
        ],
        callInterval: 1,
        teardownTimeout: '5m',
        init: envNumberVar('init_iter') || 10,
        findIterations: envNumberVar('find_iter') || 10,
    };
}

function envNumberVar(key: string): number {
    const value = __ENV[key];
    return value && parseInt(value, null)
}
