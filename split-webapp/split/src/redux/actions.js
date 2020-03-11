import { INCREMENT } from './action-types';

export function increment(count) {
    return {
        type: INCREMENT,
        count
    }
}
