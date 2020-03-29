import React, { useEffect, useState, useReducer, useCallback } from 'react';

import {
    ScrollView, Button, View, StyleSheet, KeyboardAvoidingView,
    ActivityIndicator,
    Alert
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { useDispatch } from 'react-redux';

import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import Colors from '../../constants/Colors';

import * as authActions from '../../store/actions/auth';

const FORM_INPUT_UPDATE = 'UPDATE';

const formReducer = (state, action) => {
    if (action.type === FORM_INPUT_UPDATE) {
        const updateValues = {
            ...state.inputValues,
            [action.input]: action.value
        }

        const updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        };

        let updatedFormIsValid = true;

        for (const key in updatedValidities) {
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
        }

        return {
            formIsValid: updatedFormIsValid,
            inputValidities: updatedValidities,
            inputValues: updateValues
        };
    }

    return state;
}

const AuthScreen = props => {

    const [isSignup, setIsSignup] = useState(false);
    const [errorMessage, setErrorMesssage] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            email: '',
            password: ''

        }, inputValidities: {
            email: false,
            password: false
        },
        formIsValid: false
    });

    useEffect(() => {

        if (errorMessage) Alert.alert('An Error Occured!', errorMessage, [{ text: 'Okay' }])
    }, [errorMessage]);

    const dispatch = useDispatch();

    const authHandler = async () => {
        setIsLoading(true);

        try {
            if (isSignup)
                await dispatch(authActions.signup(formState.inputValues.email, formState.inputValues.password));
            else
                await dispatch(authActions.signin(formState.inputValues.email, formState.inputValues.password));

        } catch (err) {
            setErrorMesssage(err.message);
            setIsLoading(false);
        }

        props.navigation.navigate('Shop');
    }

    const inputChangeHandler = useCallback((inputIdentifer, inputValue, inputValidatity) => {
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: inputValue,
            isValid: inputValidatity,
            input: inputIdentifer
        })
    }, [dispatchFormState]);



    return (
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={50} style={styles.screen}>
            <LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient}>
                <Card style={styles.authContainer}>
                    <ScrollView>
                        <Input id="email" label="E-mail"
                            keyboardType="email-address"
                            require
                            email
                            autoCapitalize="none"
                            errorText="Please enter a valid email address"
                            initialValue=""
                            onInputChange={inputChangeHandler} />
                        <Input id="password" label="Password"
                            keyboardType="default"
                            secureTextEntry
                            require
                            minLength={5}
                            autoCapitalize="none"
                            errorText="Please enter a valid password"
                            initialValue=""
                            onInputChange={inputChangeHandler} />

                        <View style={styles.buttonContainer}>
                            {isLoading ? (<ActivityIndicator size="small" color={Colors.primary} />) :
                                <Button title={isSignup ? 'Sign Up' : 'Login'} color={Colors.primary} onPress={authHandler} />}
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button title={`Switch to ${isSignup ? 'Login' : 'Sign Up'}`} color={Colors.accent} onPress={() => {
                                setIsSignup(prevState => !prevState);
                            }} />
                        </View>
                    </ScrollView>
                </Card>
            </LinearGradient>
        </KeyboardAvoidingView>
    )
}

AuthScreen.navigationOptions = {
    headerTitle: 'Authenticate'
}

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    authContainer: {
        width: '80%',
        maxWidth: 400,
        maxHeight: 400,
        padding: 20
    },
    buttonContainer: {
        marginTop: 10
    }
});

export default AuthScreen;
