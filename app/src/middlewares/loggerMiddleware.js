export default function loggerMiddleWare(next) {
    return action => {
        console.log(action.type);
        next(action);
    }
}