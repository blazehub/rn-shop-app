import React, { useState, useEffect, useCallback, useReducer } from 'react';
import {
    ScrollView, StyleSheet, View, Platform, Alert,
    KeyboardAvoidingView,
    ActivityIndicator
} from 'react-native';

import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import { useSelector, useDispatch } from 'react-redux';
import * as productActions from '../../store/actions/products';

import HeaderButton from '../../components/UI/HeaderButton';
import Input from '../../components/UI/Input';
import Colors from '../../constants/Colors';

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

const EditProductScreen = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const prodId = props.navigation.getParam('productId');

    const editedProduct = useSelector(state => state.products.userProducts.find(prod => prod.id === prodId));

    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            title: editedProduct ? editedProduct.title : '',
            imageUrl: editedProduct ? editedProduct.imageUrl : '',
            description: editedProduct ? editedProduct.description : '',
            price: ''

        }, inputValidities: {
            title: editedProduct ? true : false,
            imageUrl: editedProduct ? true : false,
            description: editedProduct ? true : false,
            price: editedProduct ? true : false
        }, formIsValid: editedProduct ? true : false
    });

    useEffect(() => {
        if (error) {
            Alert.alert('An error occured', error.message, [{ text: 'Okay' }])
        }
    }, [error]);

    const submitHandler = useCallback(async () => {
        if (!formState.formIsValid) {
            Alert.alert('Wrong input!', 'Please check the errors in the form.', [{
                text: 'Okay'
            }])
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            if (editedProduct) {
                await dispatch(productActions.updateProduct(
                    prodId,
                    formState.inputValues.title,
                    formState.inputValues.description,
                    formState.inputValues.imageUrl));
            } else {
                await dispatch(productActions.createProduct(
                    formState.inputValues.title,
                    formState.inputValues.description,
                    formState.inputValues.imageUrl,
                    +formState.inputValues.price));
            }

            props.navigation.goBack();
        } catch (err) {
            setError(err.message);
        }

        setIsLoading(false)


    }, [dispatch, prodId, formState]);

    useEffect(() => {
        props.navigation.setParams({ submit: submitHandler });
    }, [submitHandler]);

    const inputChangeHandler = useCallback((inputIdentifer, inputValue, inputValidatity) => {
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: inputValue,
            isValid: inputValidatity,
            input: inputIdentifer
        })
    }, [dispatchFormState]);

    if (isLoading) {
        return <View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors.primary} />
        </View>
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={100}>

            <ScrollView>
                <View style={styles.form}>
                    <Input
                        id='title'
                        label='Title'
                        errorText='Please enter a valid title!'
                        keyboardType='default'
                        autoCapitalize='sentences'
                        autoCorrect
                        returnKeyType='next'
                        initialValue={editedProduct ? editedProduct.title : ""}
                        initiallyValid={!!editedProduct}
                        onInputChange={inputChangeHandler}
                        required />
                    <Input
                        id="imageUrl"
                        label='Image Url'
                        errorText='Please enter a valid image url!'
                        keyboardType='default'
                        returnKeyType='next'
                        initialValue={editedProduct ? editedProduct.imageUrl : ""}
                        initiallyValid={!!editedProduct}
                        onInputChange={inputChangeHandler}
                        required />
                    {editedProduct ? null : <Input
                        id="price"
                        label='Price'
                        errorText='Please enter a valid price!'
                        keyboardType='decimal-pad'
                        returnKeyType='next'
                        onInputChange={inputChangeHandler}
                        required
                        min={0} />
                    }
                    <Input
                        id="description"
                        label='Description'
                        errorText='Please enter a valid description!'
                        keyboardType='default'
                        autoCapitalize='sentences'
                        autoCorrect
                        returnKeyType='next'
                        numOfLines={3}
                        initialValue={editedProduct ? editedProduct.description : ""}
                        initiallyValid={!!editedProduct}
                        onInputChange={inputChangeHandler}
                        required
                        minLength={5} />
                </View>
            </ScrollView>

        </KeyboardAvoidingView>
    )
}

EditProductScreen.navigationOptions = navData => {
    const submitFn = navData.navigation.getParam('submit');
    return {
        headerTitle: navData.navigation.getParam('productId') ? 'Edit Product' : 'Add Product',
        headerRight: () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item title='Save' iconName={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'}
                onPress={submitFn}></Item>
        </HeaderButtons>
    }
}

const styles = StyleSheet.create({
    form: {
        margin: 20
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default EditProductScreen;
