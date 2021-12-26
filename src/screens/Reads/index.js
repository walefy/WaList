import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { readFile, writeFile } from '../../utils/writeAndReadBooks'

const Reads = (props) => {

    const [readBooks, setReadBooks] = useState([])
    const nav = props.navigation

    useEffect(() => {
        async function getBooks() {
            const books = await readFile(read=true)
            setReadBooks(books)
        }
        nav.addListener('focus', () => getBooks())
    }, [])

    async function removeBook(item) {

        
        if (readBooks.length === 1 && readBooks[readBooks.indexOf(item)]) {
            setReadBooks([])
            await writeFile([], read=true)
            return
        }

        function remove(value) {
            if (value !== item) {
                return value
            }
        }

        setReadBooks(readBooks.filter(remove))
        await writeFile(readBooks, read=true)
    }

    const Separator = () => <View style={{ marginBottom: 15 }}></View>
    
    return (
        <View style={styles.container}>
            <FlatList 
                data={readBooks}
                keyExtractor={item => item.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.containerView}>
                        <Text style={styles.texto}>{item}</Text>
                        <TouchableOpacity onPress={() => removeBook(item)}>
                            <MaterialIcons name="delete-forever" size={24} color="#ff5555" />
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <Separator />}
            />
        </View>
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

    texto: {
        color: '#f8f8f2',
        fontSize: 14,
        fontWeight: 'normal',
        marginTop: 4,
        textAlign: 'center'
      },
})

export default Reads
