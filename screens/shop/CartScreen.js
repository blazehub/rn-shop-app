import React, { useState } from 'react'
import {
    View, Button, Text, StyleSheet, FlatList,
    ActivityIndicator
} from 'react-native';

import CardItem from '../../components/shop/CartItem';
import { useSelector, useDispatch } from 'react-redux';
import Colors from '../../constants/Colors';

import * as cartActions from '../../store/actions/cart';
import * as orderActions from '../../store/actions/order';
import Card from '../../components/UI/Card';

const CartScreen = (props) => {
    const [isLoading, setIsLoading] = useState(false);

    const cartTotalAmount = useSelector(state => state.cart.totalAmount);
    const cartItems = useSelector(state => {
        const transFormedCartItems = [];
        for (const key in state.cart.items) {
            transFormedCartItems.push({
                productId: key,
                productTitle: state.cart.items[key].productTitle,
                productPrice: state.cart.items[key].productPrice,
                quantity: state.cart.items[key].quantity,
                sum: state.cart.items[key].sum
            })
        }
        return transFormedCartItems.sort((a, b) => a.productId > b.productId ? 1 : -1);
    });

    const dispatch = useDispatch();

    const sendOrderHandler = async () => {
        setIsLoading(true);
        await dispatch(orderActions.addOrder(cartItems, cartTotalAmount));
        setIsLoading(false)
    }

    if (isLoading) {
        return <View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors.primary} />
        </View>
    }

    return (
        <View style={styles.screen}>
            <Card style={styles.summary}>
                <Text style={styles.summaryText}>
                    Total: <Text style={styles.amount}>${cartTotalAmount.toFixed(2)}</Text>
                </Text>
                <Button title="Order Now" color={Colors.accent} disabled={cartItems.length === 0}
                    onPress={sendOrderHandler}></Button>
            </Card>
            <FlatList data={cartItems}
                keyExtractor={(item) => item.productId}
                renderItem={itemData => <CardItem
                    quantity={itemData.item.quantity}
                    title={itemData.item.productTitle}
                    sum={itemData.item.sum}
                    deletable
                    onRemove={() => {
                        dispatch(cartActions.removeFromCart(itemData.item.productId))
                    }} />} />
        </View>
    )
}

CartScreen.navigationOptions = {
    headerTitle: 'Your Cart'
}


const styles = StyleSheet.create({
    screen: {
        margin: 20
    },
    summary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        padding: 10
    },
    summaryText: {
        fontFamily: 'open-sans-bold',
        fontSize: 18
    },
    amount: {
        color: Colors.primary
    },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default CartScreen;
