// Esse arquivo vai ser responsável por ler e escrever os livros em uma lista
// Substituindo o Async-Storage que está com um bug, que faz os livros serem apagados

import * as FileSystem from 'expo-file-system'
//import * as MediaLibrary from 'expo-media-library'

const booksDir = FileSystem.documentDirectory + 'WaList/'
const booksFile = booksDir + 'books.txt'
const readBooksFile = booksDir + 'readBooks.txt'

async function clearAllFiles(lock) {
    if (lock) return

    const readBooksFileExists = (await FileSystem.getInfoAsync(readBooksFile)).exists
    const booksFileExists = (await FileSystem.getInfoAsync(booksFile)).exists

    if (readBooksFileExists) await FileSystem.deleteAsync(readBooksFile)
    if (booksFileExists) await FileSystem.deleteAsync(booksFile)

    console.log('[apagado] tudo')
}

async function writeFile(book, read) {
    async function ensureExistsDir() {
        const dirExists = (await FileSystem.getInfoAsync(booksDir)).exists

        if (!dirExists) {
            // folder does not exist
            await FileSystem.makeDirectoryAsync(booksDir, { intermediates: true })
        }
    }

    async function writeStringOnFile() {
        // const booksFileExists = (await FileSystem.getInfoAsync(booksFile)).exists

        if (read) {
            // Arquivo de livros lidos
            await FileSystem.writeAsStringAsync(readBooksFile, JSON.stringify(book)).then(console.log(`[escrito] ${book}`)) // encode utf8
        }
        else {
            await FileSystem.writeAsStringAsync(booksFile, JSON.stringify(book)).then(console.log(`[escrito] ${book}`)) // encode utf8
        }
    }

    async function main() {
        await ensureExistsDir()
        await writeStringOnFile()
    }

    main()
}

async function readFile(read) {
    if (read) {
        const readBooksFileExists = (await FileSystem.getInfoAsync(readBooksFile)).exists
        
        if (readBooksFileExists) {
            const content = await FileSystem.readAsStringAsync(readBooksFile).then(console.log('[lido]'))
            return JSON.parse(content)
        } else return []
    }

    const booksFileExists = (await FileSystem.getInfoAsync(booksFile)).exists

    if (booksFileExists) {
        const content = await FileSystem.readAsStringAsync(booksFile).then(console.log('[lido]'))
        return JSON.parse(content)
    } else return []
}

export { writeFile, readFile, clearAllFiles }