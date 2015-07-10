import Promise from 'bluebird';

Promise.longStackTraces();
Promise.onPossiblyUnhandledRejection(function(error){
    console.log('Unhandled exception.');
    throw error;
});

export default Promise;