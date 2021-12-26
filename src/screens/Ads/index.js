import React, { useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
// import AdMobInterstitial from 'expo-ads-admob'

import { AdMobInterstitial, AdMobBanner } from 'expo-ads-admob'

const Ads = () => {

    useEffect(() => {
        async function setId(){
            await AdMobInterstitial.setAdUnitID('ca-app-pub-5306623391612157/7447648244')
        }
        setId()
    }, [])
    
    async function renderAd() {
        try {
            await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true})
            await AdMobInterstitial.showAdAsync()
        }
        catch (e) {
            Alert.alert('Nenhum anúncio no inventário', `${e}\n\n\nEstamos sem anúncio, tente mais tarde`)
        }
    }

    return (
        <>
            <View style={styles.container}>
                <View style={styles.containerView}>
                    <Text style={styles.text}>Você pode ver um anúncio para ajudar o desenvolvedor</Text>
                </View>
                <View style={{ marginBottom: 15 }}/>
                <TouchableOpacity style={[styles.containerView, styles.buttonAd]} onPress={() => renderAd()}>
                    <Text style={styles.text}>Clique aqui</Text>
                </TouchableOpacity>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <AdMobBanner
                    style={{ backgroundColor: '#282a36' }}
                    bannerSize="fullBanner"
                    adUnitID="ca-app-pub-5306623391612157/2214792426"
                    servePersonalizedAds
                    onDidFailToReceiveAdWithError={this.bannerError} />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#282a36',
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginTop: 20
      },

    text: {
        color: '#f8f8f2',
        fontSize: 14,
        fontWeight: 'normal',
        marginTop: 4,
    },

    buttonAd: {
        textAlign: 'center',
        justifyContent: 'center'
    },

    containerView: {
        //marginBottom: 15,
        padding: 15,
        borderRadius: 4,
        backgroundColor: '#44475a',
    
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#44475a'
      },
})

export default Ads
