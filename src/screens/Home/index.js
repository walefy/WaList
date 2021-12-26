import { StatusBar } from 'expo-status-bar'
import React, {useState, useEffect} from 'react'
import { Accelerometer } from 'expo-sensors'
import { Ionicons } from '@expo/vector-icons'
import { MaterialIcons } from '@expo/vector-icons'
import { FlatList,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Alert
} from 'react-native'
import { writeFile, readFile, clearAllFiles } from '../../utils/writeAndReadBooks'

const Home = () => {

  const [books, setBook] = useState([])
  const [newBooks, setNewBooks] = useState('')
  const [data, setData] = useState({
    x: 0,
    y: 0,
    z: 0
  })
  const [sub, setSub] = useState(null)
  const [readBooks, setReadBooks] = useState('')
  
  const _sub = () => {
    setSub(
      Accelerometer.addListener(AccelerometerData => { setData(AccelerometerData) })
    )
    Accelerometer.setUpdateInterval(500)
  }

  const unsub = () => {
    sub && sub.remove()
    setSub(null)
  }

  useEffect(() => {
    _sub()
    return () => unsub()
  }, [])

  useEffect(() => {
    // APENAS PARA DESENVOLVIMENTO
    clearAllFiles(lock=true)
  }, [])

  /*
  useEffect(() => {
    async function remove(){
      await AsyncStorage.removeItem('readBooks')
    }
    remove()
  }, [])

  */
  const { x, y, z} = data

  async function addTask() {
    let trimNewBooks = newBooks.trim()
    const arrNewBooks = trimNewBooks.split('')
    arrNewBooks.splice(0, 1, arrNewBooks[0].toUpperCase())
    trimNewBooks = arrNewBooks.join('')

    if (trimNewBooks === ''){
      return
    }

    const search = books.filter(book => book === trimNewBooks)

    if (search.length !== 0) {
      Alert.alert('Atenção', `"${search}"\nLivro já existe!`)
      return
    }
    setBook((prevState) => ([... prevState, trimNewBooks]))
    setNewBooks('')

    Keyboard.dismiss()
  }

  async function addBook(item) {
    if (!item) {
      return
    }
    //let temp = await AsyncStorage.getItem('readBooks')
    let temp = await readFile(read=true)
    
    //temp = JSON.parse(temp)
    
    if (temp !== null) {
      const search = temp.filter(books => books === item)
      
      if (search.length === 0) {
        temp.push(item)
      }

    } else {
      temp = [item]
    }
    
    //await AsyncStorage.removeItem('readBooks')
    //await AsyncStorage.setItem('readBooks', JSON.stringify(temp))
    await writeFile(temp, read=true)
    setReadBooks('')
  }

  async function removeTask(item) {
    Alert.alert(
      'Deletar livro',
      'Tem certeza que deseja deletar este livro?',
      [
        {
          text: 'Não',
          onPress: () => { return },
          style: 'cancel'
        },
        {
          text: 'Sim',
          onPress: () => { setBook(books.filter(tasks => tasks !== item)) }
        }
      ],
      { cancelable: false }
    )
  }

  useEffect(() => {
    async function loadData() {
      //const task = await AsyncStorage.getItem('books')
      const content = await readFile()
      console.log(content)

      if (content) {
        //setBook(JSON.parse(task))
        setBook(content)
      }
    }
    loadData()
  }, [])


  useEffect(() => {
    async function saveData() {
      // Salva os livros na memoria
      //await AsyncStorage.setItem('books', JSON.stringify(books))
      await writeFile(books)
    }
    saveData()
  }, [books])

  useEffect(() => {
    async function addTaskByGry() {
      setBook(books.sort())
      //await AsyncStorage.removeItem('books')
      //await AsyncStorage.setItem('books', JSON.stringify(books))
      await writeFile(books)
    }
    addTaskByGry()
    //console.log('ouvindo...')
    //console.log(`x: ${x}\ny: ${y}`)
  }, [x <= -0.5 && y <= -0.5 || x >= 0.5 && y > 0.5])


  const Separator = () => <View style={{ marginBottom: 15 }}></View>

  async function checkItem(item) {

    Alert.alert(
      'Livro lido',
      'Você leu este livro?',
      [
        {
          text: 'Não',
          onPress: () => { return },
          style: 'cancel'
        },
        {
          text: 'Sim',
          onPress: () => {
            setBook(books.filter(tasks => tasks !== item))
            addBook(item)
          }
        }
      ],
      { cancelable: false }
    )
  }


  return (
    <>
      <View style={styles.container}>
        <View style={styles.body}>
          <FlatList
            style={styles.flatList}
            data={books} // Indica com que dados a lista vai trabalhar, neste caso os dados do array task
            keyExtractor={item => item.toString()} // cria uma Key para cada item, para que ele possa ser identificado
            showsVerticalScrollIndicator={false} // Oculta o scroll vertical
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.containerView} onLongPress={() => checkItem(item)}>
                <Text style={styles.texto}>{item}</Text>
                <TouchableOpacity onPress={() => removeTask(item)}>
                  <MaterialIcons name="delete-forever" size={24} color="#ff5555" />
                </TouchableOpacity>
              </TouchableOpacity>
            )} // renderiza os itens na tela
            ItemSeparatorComponent={() => <Separator />}
          />
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input} // Adiciona uma folha de estilo, parecido com CSS
            placeholderTextColor='#999' // Cor da letra de fundo (cinza)
            autoCorrect={true} // Corretor automático ativado
            placeholder='Nome do livro...' // Texto que aparece no background da caixa de input
            maxLength={30} // Quantidade máxima de characters
            onChangeText={text => setNewBooks(text)} // sempre que o texto do input mudar, seta newBooks com o texto do input
            value={newBooks}
          />
          <TouchableOpacity style={styles.button} onPress={() => addTask()}>
            <Ionicons name='ios-add' size={24} color='#f8f8f2' />
          </TouchableOpacity>
        </View>

        <StatusBar style="light" backgroundColor='#282a36' />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282a36',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 20
  },

  body: {
    flex: 1, // Ocupa o máximo de espaço
  },

  form: {
    padding: 0, // Não tenha espaçamento
    height: 60, // Altura da View 60px
    justifyContent: 'center', // justifique os elementos no centro
    alignSelf: 'stretch', // Ocupar toda a largura disponível
    flexDirection: 'row', // Alinhe os itens na horizontal
    paddingTop: 13, // Criar uma distância de 13px da parte de cima da View
    borderTopWidth: 1, // Crie uma borda em cima com a largura de 1px (Basicamente uma linha)
    borderColor: '#44475a', // Deixa a borda num tom de cinza
    backgroundColor: '#282a36' // Cor de fundo
  },

  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#44475a',
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#44475a',
    color: '#f8f8f2'
  },

  button: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    backgroundColor: '#44475a',
    alignItems: 'center',
    borderRadius: 4,
    marginLeft: 10
  },

  flatList: {
    flex: 1,
    marginTop: 5,
    
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

  leftActions: {
    flex: 1,
    backgroundColor: '#50fa7b',
    justifyContent: 'center',
    borderRadius: 4
  },

  rightActions: {
    width: 30,
    height: 30,
    alignItems: 'center',
    backgroundColor: '#ff5555',
    justifyContent: 'center',
    borderRadius: 4  
  },

  actionsIcon: {
    padding: 10
  },
});

export default Home
