import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';

import * as orderActions from '../../store/actions/order';

const OrdersScreen = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const orders = useSelector(state => state.orders.orders);

    const dispatch = useDispatch();

    useEffect(() => {
        setIsLoading(true);
        const loadProducts = async () => {
            await dispatch(orderActions.fetchOrders());
            setIsLoading(false);
        }
        loadProducts();
    }, [dispatch]);

    if (isLoading) {
        return <View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors.primary} />
        </View>
    }

    return (
        <FlatList data={orders}
            keyExtractor={item => item.id}
            renderItem={itemData =>
                <OrderItem amount={itemData.item.totalAmount}
                    date={itemData.item.readableDate}
                    items={itemData.item.items} />
            }> </ FlatList >
    )
}

OrdersScreen.navigationOptions = (navData) => {
    return {
        headerTitle: 'Your Orders',
        headerLeft: () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item title='Menu' iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                onPress={() => {
                    navData.navigation.toggleDrawer();
                }}></Item>
        </HeaderButtons>
    }
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default OrdersScreen
