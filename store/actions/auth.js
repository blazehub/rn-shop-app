import { AsyncStorage } from 'react-native';

export const SIGN_UP = 'SIGN_UP';
export const LOGIN = 'LOGIN';
export const AUTHENTICATE = 'AUTHENTICATE';

export const authenticate = (userId, token) => {
    return { type: AUTHENTICATE, userId: userId, token: token }
}

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

        dispatch(dispatch(authenticate(resData.localId, resData.idToken)));
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

        dispatch(authenticate(resData.localId, resData.idToken));
        const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn * 1000))
        saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    }
}

const saveDataToStorage = (token, userId, expirationDate) => {
    AsyncStorage.setItem('userData', JSON.stringify({
        token: token,
        userId: userId,
        expiryDate: expirationDate.toISOString()
    }))
}