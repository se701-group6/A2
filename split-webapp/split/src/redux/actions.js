import  INCREMENT  from './action-types';

export default function increment(count) {
    return {
        type: INCREMENT,
        count
    };
}
