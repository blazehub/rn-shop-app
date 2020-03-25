import React, { useState, useEffect, useCallback } from 'react';
import { Platform, View, Text, FlatList, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import { useSelector, useDispatch } from 'react-redux';
import ProductItem from '../../components/shop/ProductItem';
import HeaderButton from '../../components/UI/HeaderButton';

import * as cartActions from '../../store/actions/cart';
import * as productActions from '../../store/actions/products';
import Colors from '../../constants/Colors';


const ProductOverviewScreen = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();
    const products = useSelector(state => state.products.availableProducts);

    const dispatch = useDispatch();

    const loadedProducts = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try {
            await dispatch(productActions.fetchProduct());
            setIsRefreshing(false);
        } catch (err) {
            setError(err.message);
        }
    }, [dispatch, setError, setIsLoading]);


    useEffect(() => {
        const willFocusSub = props.navigation.addListener('willFocus', loadedProducts);

        return () => {
            willFocusSub.remove();
        }
    }, [loadedProducts]);

    useEffect(() => {
        setIsLoading(true);
        loadedProducts()
            .finally(() => {
                setIsLoading(false);
            });

    }, [loadedProducts])

    const selectItemHandler = (id, title) => {
        props.navigation.navigate('ProductDetail', {
            productId: id,
            title: title
        });
    }

    if (error) {
        return <View style={styles.centered}>
            <Text>An error occurred!</Text>
            <Button title="Try again" onPress={loadedProducts} color={Colors.primary}></Button>
        </View>
    }

    if (isLoading) {
        return <View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors.primary} />
        </View>
    }

    if (!isLoading && products.length === 0) {
        return (
            <View style={styles.centered}>
                <Text>No products found. Maybe start adding some!</Text>
            </View>
        )
    }

    return (
        <FlatList data={products}
            refreshing={isRefreshing}
            onRefresh={loadedProducts}
            keyExtractor={item => item.id}
            renderItem={itemData => <ProductItem
                image={itemData.item.imageUrl}
                title={itemData.item.title}
                price={itemData.item.price}
                onSelect={() => {
                    selectItemHandler(itemData.item.id, itemData.item.title)
                }}>
                <Button color={Colors.primary} title="View Details" onPress={() => {
                    selectItemHandler(itemData.item.id, itemData.item.title)
                }} />
                <Button color={Colors.primary} title="To Cart" onPress={() => dispatch(cartActions.addToCart(itemData.item))} />
            </ProductItem>} />
    )
}

ProductOverviewScreen.navigationOptions = navData => ({
    headerTitle: 'All Products',
    headerRight: () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item title='Cart' iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
            onPress={() => {
                navData.navigation.navigate('Cart');
            }}></Item>
    </HeaderButtons>,
    headerLeft: () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item title='Menu' iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
            onPress={() => {
                navData.navigation.toggleDrawer();
            }}></Item>
    </HeaderButtons>
})

const styles = StyleSheet.create({
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default ProductOverviewScreen;