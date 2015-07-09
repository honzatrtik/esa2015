import Promise from '../Promise.js';


export default function promiseMiddleWare(next) {
    return action => {
        if (action.promise && action.types) {
            var types = action.types;
            var promise = action.promise;

            delete action.types;
            delete action.promise;

            action.type = types[0];
            next(action);

            return promise.then(
                payload => {
                    action.type = types[1];
                    action.payload = payload;
                    next(action);
                },
                error => {
                    action.type = types[2];
                    action.error = error;
                    next(action);
                }
            );

        } else {
            return Promise.resolve(next(action));
        }
    }
}