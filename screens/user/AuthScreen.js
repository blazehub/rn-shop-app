import React from 'react';

import { ScrollView, Button, View, StyleSheet, KeyboardAvoidingView } from 'react-native';

import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import Colors from '../../constants/Colors';

const AuthScreen = props => {
    return (
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={50} style={styles.screen}>
            <Card>
                <ScrollView>
                    <Input id="email" label="E-mail"
                        keyboardType="email-address"
                        require
                        email
                        autoCapitalize="none"
                        errorMessage="Please enter a valid email address"
                        initialValue=""
                        onValueChange={() => { }} />
                    <Input id="password" label="Password"
                        keyboardType="default"
                        secureTextEntry
                        require
                        minLength={5}
                        autoCapitalize="none"
                        errorMessage="Please enter a valid password"
                        initialValue=""
                        onValueChange={() => { }} />

                    <Button title="Login" color={Colors.primary} onPress={() => { }} />
                    <Button title="Switch to sign up" color={Colors.accent} onPress={() => { }} />
                </ScrollView>
            </Card>
        </KeyboardAvoidingView>
    )
}


const styles = StyleSheet.create({});

export default AuthScreen;
