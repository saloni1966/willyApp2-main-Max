import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet,TextInput,Image ,Alert} from 'react-native';
import * as Permissions from 'expo-permissions';

import { BarCodeScanner } from 'expo-barcode-scanner';
import * as firebase from 'firebase';
import db from '../config.js';

export default class TransactionScreen extends React.Component {
    constructor(){
      super();
      this.state = {
        hasCameraPermissions: null,
        scanned: false,
        scannedData: '',
        scannedBookId: '',
        scannedStudentId: '',
        buttonState: 'normal',
        transactionMessage : ''
      }
    }

    getCameraPermissions = async (id) =>{
      const {status} = await Permissions.askAsync(Permissions.CAMERA);
      
      this.setState({
        /*status === "granted" is true when user has granted permission
          status === "granted" is false when user has not granted the permission
        */
        hasCameraPermissions: status === "granted",
        buttonState: id,
        scanned: false
      });
    }

  handleBarCodeScanned = async ({ type, data }) => {
    const { buttonState } = this.state
    if (buttonState === "BookId") { 
      this.setState({
        scanned: true,
        scannedBookId: data,
        buttonState: 'normal'
      });
    }
    else if (buttonState === "StudentId") {
      this.setState({
        scanned: true,
        scannedStudentId: data,
        buttonState: 'normal'
      });
    }
      
    }

  
  initiateBookIssue=async()=>{
      //add a transaction
    db.collection('transactions').add({
      'studentId': this.state.scannedStudentId,
      'bookID': this.state.scannedBookId,
      'date': firebase.firestore.Timestamp.now().toDate(),
      'transactionType' : 'Issue'
    })
    //change book status to false
    db.collection("books").doc(this.state.scannedBookId).update({
  'bookAvailability' : false
    })
    //change the number of book issued to the student
    db.collection("students").doc(this.state.scannedStudentId).update({
      'numIssued' : firebase.firestore.FieldValue.increment(1)
    })
    Alert.alert("Book issued")
    this.setState({
      scannedBookId: '',
        scannedStudentId: '',
    })
  }

  initiateBookReturn=async()=>{
    //add a transaction
  db.collection('transactions').add({
    'studentId': this.state.scannedStudentId,
    'bookID': this.state.scannedBookId,
    //error
    'date': firebase.firestore.Timestamp.now().toDate(),
    'transactionType' : 'Return'
  })
  //change book status to false
    //error
  db.collection("books").doc(this.state.scannedBookId).update({
'bookAvailability' : true
  })
  //change the number of book issued to the student
    //error
  db.collection("students").doc(this.state.scannedStudentId).update({
    'numIssued' : firebase.firestore.FieldValue.increment(-1)
  })
  Alert.alert("Book Returned");
  this.setState({
    scannedBookId: '',
    scannedStudentId: '',
  })
  }

  handleTransaction = () => { 
    var transactionMessage
      db.collection("books").doc(this.state.scannedBookId).get()
        .then((doc) => {
          var book = doc.data()
          if(book.bookAvailability){
            this.initiateBookIssue();
            transactionMessage = "Book Issued"
          }
          else{
            this.initiateBookReturn();
            transactionMessage = "Book Return"
          }
  
      })
      
      this.setState({
        transactionMessage :  transactionMessage 
      })
    }
  
    render() {
      const hasCameraPermissions = this.state.hasCameraPermissions;
      const scanned = this.state.scanned;
      const buttonState = this.state.buttonState;

      if (buttonState !== "normal" && hasCameraPermissions){
        return(
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        );
      }

      else if (buttonState === "normal"){
        return(
          <View style={styles.container}>
            <View>

            <Image source={ require('../assets/booklogo.jpg')}
              style={{width: 400, height: 400}} />
              <Text style={{textAlign: 'center'}}> Willy App </Text>
              
            </View>
            



             
            <View  style={styles.InputView}>
              <TextInput
              style = { styles.InputBox}
              placeholder = "Book ID"
              value={this.state.scannedBookId}
                />
              <TouchableOpacity style={styles.scanButton}
                onPress={() => { 
                this.getCameraPermissions("BookId")
              }}
              >
                <Text style={styles.buttonText}>SCAN</Text>
              </TouchableOpacity>
            
               </View>

               <View  style={styles.InputView}>
              <TextInput
              style = { styles.InputBox}
              placeholder = "Student ID"
              value={this.state.scannedStudentId}
                />
              <TouchableOpacity style={styles.scanButton}
               onPress={() => { 
                this.getCameraPermissions("StudentId")
              }}
              >
                <Text style={styles.buttonText}>SCAN</Text>
              </TouchableOpacity>
            
            </View>
            <TouchableOpacity style={styles.submitButton}
            onPress={async()=>{
            this.handleTransaction()}}>
            <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>


        
         
        </View>
        );
      }
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    displayText:{
      fontSize: 15,
      textDecorationLine: 'underline'
    },
    scanButton:{
      backgroundColor: '#2196F3',
      padding: 10,
      margin: 10,
      borderRadius: 15,
    },
    buttonText:{
      fontSize: 20,
    },
    InputView: {
      flexDirection : 'row'
    },
    InputBox: {
      borderWidth: 1.5,
      width: 200,
      height: 40,
fontSize: 20
    },

    submitButton:{
      backgroundColor: '#2196F3',
      padding: 10,
      margin: 10,
     borderRadius: 15,
    },
  });