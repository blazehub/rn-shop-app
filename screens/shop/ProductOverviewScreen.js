import React from 'react';
import { Platform } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import { useSelector, useDispatch } from 'react-redux';
import ProductItem from '../../components/shop/ProductItem';
import HeaderButton from '../../components/UI/HeaderButton';

import * as cartActions from '../../store/actions/cart';


const ProductOverviewScreen = (props) => {
    const products = useSelector(state => state.products.availableProducts);

    const dispatch = useDispatch();

    return (
        <FlatList data={products}
            keyExtractor={item => item.id}
            renderItem={itemData => <ProductItem
                image={itemData.item.imageUrl}
                title={itemData.item.title}
                price={itemData.item.price}
                onViewDetail={() => {
                    props.navigation.navigate('ProductDetail', {
                        productId: itemData.item.id,
                        title: itemData.item.title
                    })
                }}
                onAddToCart={() => {
                    dispatch(cartActions.addToCart(itemData.item))
                }} />} />
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


export default ProductOverviewScreen;