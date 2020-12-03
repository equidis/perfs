import { RefinedResponse, ResponseType } from 'k6/http';
import { check, Checkers, sleep } from 'k6';
import { body } from './assertions';

export function checkInterval<T>(delay: number, val: T, sets: Checkers<T>, tags: any = {}): boolean {
    const response = check(val, sets, tags);
    sleep(delay);
    return response;
}

export function queryParamBuilder(params: Record<string, string>): string {
    return Object.keys(params)
        .filter(k => params[k] != null)
        .map((k, i) => `${i === 0 ? '?' : ''}${k}=${params[k]}`)
        .join('&');
}

export function bodyId(response: RefinedResponse<ResponseType>): string {
    return body(response)?.id?.toString();
}

export function rangeVuIterSuffix() {
    return `_VU_${__VU}_ITER${__ITER}_${random(10000)}`;
}

function random(max): string {
    return Math.floor(Math.random() * Math.floor(max)).toString();
}

