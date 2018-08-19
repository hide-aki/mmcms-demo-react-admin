export const loadState = () => {
    try {
        const serializedState = localStorage.getItem('state');
        // console.log('state loaded: ', serializedState);
        if(serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);

    } catch(err) {
        return undefined;
    }
}

export const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(sanitizeState(state));
        localStorage.setItem('state', serializedState);
        // console.log('state saved: ', serializedState);

    } catch(err) {
        console.log(err);
    }
}

export const sanitizeState = (state) => {
    return {
        auth: {
            token: state.auth.token,
            user: state.auth.user,
        }
    }
};
