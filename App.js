import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  PickerIOS,
  ScrollView,
  Button,
  Alert
} from "react-native";
import ModalSelector from "react-native-modal-selector";
import firebase from "firebase";
import hash from "object-hash";
import {
  API_KEY,
  AUTH_DOMAIN,
  DATABASE_URL,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID
} from "react-native-dotenv";

export default class App extends React.Component {
  componentWillMount() {
    firebase.initializeApp({
      apiKey: API_KEY,
      authDomain: AUTH_DOMAIN,
      databaseURL: DATABASE_URL,
      projectId: PROJECT_ID,
      storageBucket: STORAGE_BUCKET,
      messagingSenderId: MESSAGING_SENDER_ID
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
    console.log("patient:", patient);
    this.setState({
      score: this.calcSeverity(
        patient.age,
        Number(patient.pulse),
        Number(patient.rr),
        Number(patient.capRefill),
        patient.primaryImpression
      )
    });

    return new Promise((resolve, reject) => {
      console.log("score:", this.state.score);
      firebase
        .database()
        .ref("patients/" + this.generateID(patient))
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
          score: this.calcSeverity(
            patient.age,
            Number(patient.pulse),
            Number(patient.rr),
            Number(patient.capRefill),
            patient.primaryImpression
          ),
          ambulance: patient.ambulance
        })
        .then(resolve(patient))
        .catch(err => reject(err));
    });
  }

  /**
   * Calculate a severity score between 0.00 and 1.00 for a patient
   */
  calcSeverity(ageGroup, pulse, respRate, capRefill, primaryImpression) {
    const dataframe = [
      { pulse: 0.35, respRate: 0.5, capRefill: 0.15 },
      { pulse: 0.4, respRate: 0.5, capRefill: 0.1 },
      { pulse: 0.45, respRate: 0.5, capRefill: 0.05 },
      { pulse: 0.45, respRate: 0.5, capRefill: 0.05 },
      { pulse: 0.45, respRate: 0.5, capRefill: 0.05 },
      { pulse: 0.45, respRate: 0.5, capRefill: 0.05 }
    ];
    const expected_vals_df = [
      { pulse: 105, respRate: 25, capRefill: 2 },
      { pulse: 90, respRate: 25, capRefill: 2 },
      { pulse: 80, respRate: 16, capRefill: 2 },
      { pulse: 70, respRate: 18, capRefill: 2 },
      { pulse: 70, respRate: 18, capRefill: 2 },
      { pulse: 70, respRate: 18, capRefill: 2 }
    ];

    var severity;
    var weights;
    var expected_vals;

    switch (ageGroup) {
      case "toddler":
        weights = dataframe[0];
        expected_vals = expected_vals_df[0];
        break;
      case "school":
        weights = dataframe[1];
        expected_vals = expected_vals_df[1];
        break;
      case "adolescent":
        weights = dataframe[2];
        expected_vals = expected_vals_df[2];
        break;
      case "early":
        weights = dataframe[3];
        expected_vals = expected_vals_df[3];
        break;
      case "mid":
        weights = dataframe[4];
        expected_vals = expected_vals_df[4];
        break;
      case "late":
        weights = dataframe[5];
        expected_vals = expected_vals_df[5];
        break;
      default:
        return 0.0;
    }

    // initial severity
    severity =
      Math.abs(
        (respRate - expected_vals.respRate) /
          ((respRate + expected_vals.respRate) / 2)
      ) *
        weights.respRate +
      Math.abs(
        (pulse - expected_vals.pulse) / ((pulse + expected_vals.pulse) / 2)
      ) *
        weights.pulse +
      Math.abs(
        (capRefill - expected_vals.capRefill) /
          ((capRefill + expected_vals.capRefill) / 2)
      ) *
        weights.capRefill;

    switch (primaryImpression) {
      case "Abdominal pain/problems":
        severity += 0.01;
        break;
      case "Airway Issues":
        severity += 0.15;
        break;
      case "Altered level of consciousness":
        severity += 0.2;
        break;
      case "Behavioral/psychiatric disorder":
        severity += 0.01;
        break;
      case "Cardiac Issues":
        severity += 0.15;
        break;
      case "Obvious death":
        severity = 1;
        break;
      case "Poisoning/drug ingestion":
        severity += 0.01;
        break;
      case "Syncope/fainting":
        severity += 0.025;
        break;
      case "Traumatic injury":
        severity += 0.025;
        break;
      case "Not applicable":
        break;
      case "Not known":
        break;
      default:
        return 0.0;
    }
    // bound under 1

    if (severity > 1) severity = 1; // dead

    return Number.parseFloat(severity).toPrecision(2);
  }

  render() {
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
    const primaryImpressions = [
      { key: 0, label: "Abdominal pain/problems" },
      { key: 1, label: "Airway Issues" },
      { key: 2, label: "Altered level of consciousness" },
      { key: 3, label: "Behavioral/psychiatric disorder" },
      { key: 4, label: "Cardiac Issues" },
      { key: 5, label: "Obvious death" },
      { key: 6, label: "Poisoning/drug ingestion" },
      { key: 7, label: "Syncope/fainting" },
      { key: 8, label: "Traumatic injury" },
      { key: 9, label: "Not applicable" },
      { key: 11, label: "Not known" }
    ];
    const primarySymptoms = [
      { key: 0, label: "Bleeding" },
      { key: 1, label: "Breathing problem" },
      { key: 2, label: "Change in responsiveness" },
      { key: 3, label: "Death" },
      { key: 4, label: "Mental/psych" },
      { key: 5, label: "Nausea/vomiting" },
      { key: 6, label: "Pain" },
      { key: 7, label: "Swelling" },
      { key: 8, label: "Transport only" },
      { key: 9, label: "Weakness" },
      { key: 10, label: "Wound" },
      { key: 11, label: "None" },
      { key: 12, label: "Not applicable" },
      { key: 13, label: "Not known" }
    ];

    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.container}>
            <Text style={{ paddingBottom: 10 }}>Age</Text>
            <ModalSelector
              data={ages}
              initValue="select age"
              value={this.state.age.toString()}
              onChange={option =>
                this.setState({ age: option.label.toLowerCase() })}
            />
          </View>

          <View style={styles.container}>
            <Text style={{ paddingBottom: 10 }}>Sex</Text>
            <ModalSelector
              data={sexes}
              initValue="select sex"
              value={this.state.sex.toString()}
              onChange={option =>
                this.setState({ sex: option.label.toLowerCase() })}
            />
          </View>

          <View style={styles.container}>
            <Text style={{ paddingBottom: 10 }}>Primary Impression</Text>
            <ModalSelector
              data={primaryImpressions}
              initValue="select primary impression"
              value={this.state.primaryImpression.toString()}
              onChange={option =>
                this.setState({ primaryImpression: option.label })}
            />
          </View>

          <View style={styles.container}>
            <Text style={{ paddingBottom: 10 }}>Primary Symptom</Text>
            <ModalSelector
              data={primarySymptoms}
              initValue="select primary symptom"
              value={this.state.primarySymptom.toString()}
              onChange={option =>
                this.setState({ primarySymptom: option.label })}
            />
          </View>

          <View style={styles.container}>
            <Text style={{ paddingBottom: 10 }}>RR</Text>
            <TextInput
              keyboardType="number-pad"
              placeholder="RR"
              value={this.state.rr.toString()}
              onChangeText={text => this.setState({ rr: text })}
            />
          </View>

          <View style={styles.container}>
            <Text style={{ paddingBottom: 10 }}>Pulse</Text>
            <TextInput
              keyboardType="number-pad"
              placeholder="Pulse"
              value={this.state.pulse.toString()}
              onChangeText={text => this.setState({ pulse: text })}
            />
          </View>

          <View style={styles.container}>
            <Text style={{ paddingBottom: 10 }}>Capillary Refill</Text>
            <TextInput
              keyboardType="number-pad"
              placeholder="Capillary refill"
              value={this.state.capRefill.toString()}
              onChangeText={text => this.setState({ capRefill: text })}
            />
          </View>

          <View style={styles.container}>
            <Text style={{ paddingBottom: 10 }}>Follows commands?</Text>
            <ModalSelector
              data={commands}
              initValue="yes or no"
              value={this.state.followCommand.toString()}
              onChange={option =>
                this.setState({ followCommand: option.label.toLowerCase() })}
            />
          </View>

          <View style={styles.container}>
            <Text style={{ paddingBottom: 10 }}>Patient Name</Text>
            <TextInput
              placeholder="Patient Name"
              value={this.state.name.toString()}
              onChangeText={text => this.setState({ name: text })}
            />
          </View>

          <View style={styles.container}>
            <Text style={{ paddingBottom: 10 }}>Ambulance</Text>
            <TextInput
              placeholder="Ambulance"
              value={this.state.ambulance.toString()}
              onChangeText={text => this.setState({ ambulance: text })}
            />
          </View>

          <View style={styles.container}>
            <Button
              onPress={() => {
                this.setData(this.state).then(() => {
                  Alert.alert("Severity Score:", this.state.score.toString());
                  this.setState({
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
                  });
                });
              }}
              title="Submit"
              color="green"
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: "#fff",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 10,
    padding: 10
  }
});
