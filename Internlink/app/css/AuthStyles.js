// css/AuthStyles.js
import {
    StyleSheet
} from 'react-native';

const AuthStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        
        padding: 16,
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#444',
        backgroundColor: '#333',
        color: '#fff',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    imagePicker: {
        backgroundColor: '#333',
        marginVertical: 10,
        padding: 20,
        borderRadius: 5,
        alignItems: 'center',
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 5,
    },
    imagePickerText: {
        color: '#bbb',
    },
    label: {
        marginTop: 20,
        fontSize: 16,
        color: '#fff',
    },
    sectorPicker: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 10,
    },
    sectorButton: {
        padding: 10,
        margin: 5,
        backgroundColor: '#444',
        borderRadius: 5,
    },
    selectedSectorButton: {
        backgroundColor: '#007bff',
    },
    sectorText: {
        fontSize: 16,
        color: '#bbb',
    },
    selectedSector: {
        fontSize: 16,
        color: '#fff',
    },
    picker: {
        height: 50,
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        marginVertical: 10,
        borderRadius: 5,
    },
    dateInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    dateInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        marginVertical: 5,
        borderRadius: 5,
        width: '30%',
        backgroundColor: '#fff',
    },
    buttonsContainer: {
        marginTop: 120,
        justifyContent: 'center',
        alignItems: 'center', // Zorgt ervoor dat de knoppen gecentreerd zijn
    },
});

export default AuthStyles;