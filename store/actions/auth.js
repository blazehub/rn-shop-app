export const SIGN_UP = 'SIGN_UP';
export const LOGIN = 'LOGIN';

export const signup = (email, password) => {
    return async dispatch => {

        const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA9gKc6mWhsraDyTx6GrSAWqdwdhE6TDW0`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password, returnSecureToken: true })
        });

        if (!response.ok) {
            throw new Error('Something went wrong!')
        }


        const resData = await response.json();

        console.log(resData);

        dispatch({ type: SIGN_UP, token: resData.idToken, userId: resData.localId });
    }
}

export const signin = (email, password) => {
    return async dispatch => {

        const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA9gKc6mWhsraDyTx6GrSAWqdwdhE6TDW0`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password, returnSecureToken: true })
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            console.log(errorResponse);
            const errorId = errorResponse.error.message;
            const message = 'Something went wrong!';

            if (errorId === 'EMAIL_NOT_FOUND') {
                message = 'This email could not be found';
            } else if (errorId === 'INVALID_PASSWORD') {
                message = 'Password is invalid';
            }

            throw new Error(message);
        }


        const resData = await response.json();

        console.log(resData);

        dispatch({ type: LOGIN, token: resData.idToken, userId: resData.localId });
    }
}