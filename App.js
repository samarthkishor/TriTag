import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  PickerIOS,
  ScrollView
} from "react-native";
import ModalSelector from "react-native-modal-selector";
import firebase from "firebase";
import hash from "object-hash";

export default class App extends React.Component {
  componentWillMount() {
    firebase.initializeApp({
      apiKey: "AIzaSyDJsGaN0_TqcQEpCSj3Yo8Pg02OAk1Bc7A",
      authDomain: "medhacks2018.firebaseapp.com",
      databaseURL: "https://medhacks2018.firebaseio.com",
      projectId: "medhacks2018",
      storageBucket: "medhacks2018.appspot.com",
      messagingSenderId: "819533736164"
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      age: "",
      sex: "",
      primaryImpression: "",
      primarySymptom: "",
      rr: 0,
      pulse: 0,
      capRefill: 0,
      followCommand: "",
      name: "",
      score: 0.0,
      ambulance: ""
    };
  }

  /**
   * Generates an ID 10 characters long given a patient object
   */
  generateID(patient) {
    return hash(patient).substring(0, 10);
  }

  /**
   * Add patient data to the database
   */
  setData(patient) {
    return new Promise((resolve, reject) => {
      firebase
        .database()
        .ref("patients/" + generateID(patient))
        .set({
          age: patient.age,
          sex: patient.sex,
          primaryImpression: patient.primaryImpression,
          primarySymptom: patient.primarySymptom,
          rr: patient.rr,
          pulse: patient.pulse,
          capRefill: patient.capRefill,
          followCommand: patient.followCommand,
          name: patient.name,
          score: patient.score,
          ambulance: patient.ambulance
        })
        .then(resolve(patient))
        .catch(err => reject(err));
    });
  }

  render() {
    console.log(this.state);
    const ages = [
      { key: 0, label: "Toddler" },
      { key: 1, label: "School" },
      { key: 2, label: "Adolescent" },
      { key: 3, label: "Early" },
      { key: 4, label: "Mid" },
      { key: 5, label: "Late" }
    ];
    const sexes = [
      { key: 0, label: "Male" },
      { key: 1, label: "Female" },
      { key: 2, label: "Other" }
    ];
    const commands = [{ key: 0, label: "Yes" }, { key: 1, label: "No" }];

    return (
      <ScrollView>
        <View style={styles.container}>
          <ModalSelector
            data={ages}
            initValue="Age"
            onChange={option =>
              this.setState({ age: option.label.toLowerCase() })}
          />

          <ModalSelector
            data={sexes}
            initValue="Sex"
            onChange={option =>
              this.setState({ sex: option.label.toLowerCase() })}
          />

          <TextInput
            placeholder="Primary impression"
            onChangeText={text => this.setState({ primaryImpression: text })}
          />

          <TextInput
            placeholder="Primary symptom"
            onChangeText={text => this.setState({ primarySymptom: text })}
          />

          <TextInput
            keyboardType="number-pad"
            placeholder="RR"
            onChangeText={text => this.setState({ rr: text })}
          />

          <TextInput
            keyboardType="number-pad"
            placeholder="Pulse"
            onChangeText={text => this.setState({ pulse: text })}
          />

          <TextInput
            keyboardType="number-pad"
            placeholder="Capillary refill"
            onChangeText={text => this.setState({ capRefill: text })}
          />

          <ModalSelector
            data={commands}
            initValue="Follows commands?"
            onChange={option =>
              this.setState({ followCommand: option.label.toLowerCase() })}
          />

          <TextInput
            placeholder="Patient Name"
            onChangeText={text => this.setState({ name: text })}
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center"
  }
});
