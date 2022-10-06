import React, { useCallback, useEffect, useRef, useState } from 'react'
import { View, ScrollView, Text, StyleSheet, Animated, ActivityIndicator, TouchableOpacity, Image } from 'react-native'
import SearchBar from 'react-native-platform-searchbar';
import * as Animatible from 'react-native-animatable'
import { COLORS } from '../../constants';
import { ArrowBack, Delete, Edit, Add } from '../../assets/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../actions/productActions';
import { formatNumber } from '../../utils/formatNumber';

// Search animasi
const headerHeight = 120;
let scrollValue = 0;
let headerVisible = true;
let focused = false;
// end search animasi

const ProductPage = ({ navigation }) => {

    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false)

    const [create, setCreate] = useState(false)

    const onChangeText = useCallback((value) => {
        if (value != '') {
            setLoading(true)
        } else {
            setLoading(false)
        }
        setSearchQuery(value);
    }, [searchQuery])

    // Search Animation
    const animation = useRef(new Animated.Value(1)).current;
    const translateY = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, headerHeight / 2 - 2],
    });
    const inputTranslateY = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [headerHeight / 4, 0],
    });
    const opacity = animation;
    const onScroll = e => {
        if (focused) return;
        const y = e.nativeEvent.contentOffset.y;
        if (y > scrollValue && headerVisible && y > headerHeight / 2) {
            Animated.spring(animation, {
                toValue: 0,
                useNativeDriver: true,
                bounciness: 0,
            }).start();
            headerVisible = false;
        }
        if (y < scrollValue && !headerVisible) {
            Animated.spring(animation, {
                toValue: 1,
                useNativeDriver: true,
                bounciness: 0
            }).start();
            headerVisible = true
        }
        scrollValue = y;
    };
    // end search animation

    // get Data Firebase
    const dispatch = useDispatch();
    const LoadingReducer = useSelector(state => state.ProductReducer.createProductLoading)
    const GetProductReducer = useSelector(state => state.ProductReducer.getProductResult)

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // do something
            dispatch(getProducts());
        });

        return unsubscribe;
    }, [navigation]);

    return (
        <View style={styles.container}>
            {
                LoadingReducer ?
                    (
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <ActivityIndicator size="large" color={COLORS.primary}  />
                        </View>
                    )
                    :
                    (
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingTop: headerHeight, backgroundColor: COLORS.white }}
                            onScroll={onScroll}>
                            {Object.keys(GetProductReducer).map((key, index) => (
                                <Animatible.View style={styles.item} key={index} animation="fadeInUp" delay={index * 100} useNativeDriver>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View>
                                            <Text style={styles.textItemTitle}>{GetProductReducer[key].nameProduct}</Text>
                                            <Text style={{ fontWeight: '300', opacity: 0.5 }}>{GetProductReducer[key].id}</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.textItemTitle}>{GetProductReducer[key].category}</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.textItemTitle}>Rp. {formatNumber(GetProductReducer[key].price)}</Text>
                                        </View>
                                    </View>
                                    <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={{ fontWeight: '300', opacity: 0.5 }}>Stock: {formatNumber(GetProductReducer[key].stock)}</Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            <TouchableOpacity>
                                                <Image source={Edit} style={{ width: 30, height: 30, tintColor: COLORS.green, marginRight: 10 }} />
                                            </TouchableOpacity>
                                            <TouchableOpacity>
                                                <Image source={Delete} style={{ width: 30, height: 30, tintColor: COLORS.red }} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </Animatible.View>
                            ))}
                        </ScrollView>
                    )
            }
            <View style={[styles.header]}>
                <Animated.View
                    style={[styles.searchContainer, { transform: [{ translateY }] }]}>
                    <Animated.View
                        style={[
                            styles.inputContainer,
                            { opacity, transform: [{ translateY: inputTranslateY }] },
                        ]}>
                        <SearchBar
                            value={searchQuery}
                            onChangeText={onChangeText}
                            placeholder="Search"
                            theme="light"
                            style={{ flex: 8 }}
                        >
                            {loading ? (
                                <ActivityIndicator color={COLORS.black} style={{ marginRight: 10 }} />
                            ) : <></>}
                        </SearchBar>

                        <TouchableOpacity style={{ flex: 1, marginLeft: 10 }} onPress={() => navigation.navigate("CreateProductPage")} >
                            <Image source={Add} style={{ width: 30, height: 30, tintColor: COLORS.primary }} />
                        </TouchableOpacity>

                    </Animated.View>
                </Animated.View>
                <Animated.View style={[styles.firstContainer]}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBack}>
                        <Image source={ArrowBack} style={{ tintColor: 'black', height: 30, width: 30 }} />
                    </TouchableOpacity>
                    <Text style={styles.name}>Produk</Text>
                </Animated.View>
            </View>
        </View>
    )
}

export default ProductPage

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        padding: 10,
        marginVertical: 7,
        marginHorizontal: 10,
        backgroundColor: COLORS.white,
        shadowColor: COLORS.black,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,

        elevation: 10,
        borderRadius: 10
    },
    header: {
        height: headerHeight / 2,
        width: '100%',
        position: 'absolute',
    },
    firstContainer: {
        height: headerHeight / 2,
        backgroundColor: '#fff',
        elevation: 2,
        paddingHorizontal: 15,
        justifyContent: 'center',
    },
    searchContainer: {
        height: headerHeight / 2,
        backgroundColor: '#fff',
        width: '100%',
        position: 'absolute',
        elevation: 2,
        padding: 10,
        paddingHorizontal: 15,
        overflow: 'hidden',
    },
    name: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        color: COLORS.black
    },
    inputContainer: {
        flex: 1,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    input: {
        flex: 1,
        padding: 0,
        paddingHorizontal: 15,
        fontSize: 15,
    },
    iconBack: {
        position: 'absolute',
        left: 10,
        padding: 10,
        zIndex: 100
    },
    textItemTitle: {
        color: COLORS.black,
        fontSize: 20,
        fontWeight: '500'
    },
    txt: {
        color: '#fff',
        letterSpacing: 1
    },
});