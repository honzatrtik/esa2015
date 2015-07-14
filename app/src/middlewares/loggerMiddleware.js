export default function loggerMiddleWare(next) {
    return action => {
        const { payload, ...rest} = action;
        console.log({...rest});
        next(action);
    }
}