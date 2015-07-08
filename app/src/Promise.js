import Promise from 'bluebird';

Promise.longStackTraces();
Promise.onPossiblyUnhandledRejection(function(error){
    throw error;
});

export default Promise;