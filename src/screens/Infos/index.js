import React, { useLayoutEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'
import { readFile } from '../../utils/writeAndReadBooks'

const Infos = (props) => {

    const [countBooks, setCountBooks] = useState(0)
    const [countReadBooks, setCountReadBooks] = useState(0)
    const nav = props.navigation

    const Separator = () => <View style={{ marginBottom: 15 }}></View>
    
    const elements = {
        'data': [
            { id: '0', texto: 'Você tem:', value: countBooks },
            { id: '1', texto: 'Você leu:', value: countReadBooks },
        ]
    }

    useLayoutEffect(() => {
        async function getItem() {
            const rbooks = await readFile(read=true)
            const books = await readFile()
            
            if (rbooks) {
                setCountReadBooks(rbooks.length)
            } else {
                setCountReadBooks(0)
            }

            if (books) {
                setCountBooks(books.length)
            } else {
                setCountBooks(0)
            }
        }
        nav.addListener('focus', () => getItem())
    }, [])

    return (
        <View style={styles.view}>
            <FlatList
                data={elements.data}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View style={styles.line}>
                        <Text style={styles.textTitle}>{item.texto}</Text>
                        <Text style={styles.textTitle}>{item.value}</Text>
                    </View>
                )}
                ItemSeparatorComponent={() => <Separator />}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: '#282a36',
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginTop: 20
    },

    line: {
        padding: 15,
        borderRadius: 4,
        backgroundColor: '#44475a',
    
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#44475a'
    },

    textTitle: {
        color: '#f8f8f2',
        fontSize: 14,
        fontWeight: 'normal',
        marginTop: 4,
        textAlign: 'center'
    }
})

export default Infos
