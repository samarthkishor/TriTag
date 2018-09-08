import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Picker,
  ScrollView
} from "react-native";
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
    return (
      <ScrollView>
        <View style={styles.container}>
          <Picker
            selectedValue={this.state.followCommand}
            style={{ height: 40, width: 100 }}
            prompt="Age"
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ age: itemValue })}
          >
            <Picker.Item label="Toddler" value="toddler" />
            <Picker.Item label="School" value="school" />
            <Picker.Item label="Adolescent" value="adolescent" />
            <Picker.Item label="Early Adult" value="early" />
            <Picker.Item label="Mid Adult" value="mid" />
            <Picker.Item label="Late Adult" value="late" />
          </Picker>

          <Picker
            selectedValue={this.state.followCommand}
            style={{ height: 40, width: 100 }}
            prompt="Sex"
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ sex: itemValue })}
          >
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Other" value="other" />
          </Picker>

          <TextInput
            style={{ height: 40 }}
            placeholder="Primary impression"
            onChangeText={text => this.setState({ primaryImpression: text })}
          />

          <TextInput
            style={{ height: 40 }}
            placeholder="Primary symptom"
            onChangeText={text => this.setState({ primarySymptom: text })}
          />

          <TextInput
            style={{ height: 40 }}
            keyboardType="number-pad"
            placeholder="RR"
            onChangeText={text => this.setState({ rr: text })}
          />

          <TextInput
            style={{ height: 40 }}
            keyboardType="number-pad"
            placeholder="Pulse"
            onChangeText={text => this.setState({ pulse: text })}
          />

          <TextInput
            style={{ height: 40 }}
            keyboardType="number-pad"
            placeholder="Capillary refill"
            onChangeText={text => this.setState({ capRefill: text })}
          />

          <Picker
            selectedValue={this.state.followCommand}
            style={{ height: 40, width: 100 }}
            prompt="Follows command?"
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ followCommand: itemValue })}
          >
            <Picker.Item label="Yes" value="true" />
            <Picker.Item label="No" value="false" />
          </Picker>

          <TextInput
            style={{ height: 40 }}
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
    alignItems: "center",
    justifyContent: "center"
  }
});
