import API_URL from "@/utils/api";
import { getUser } from "@/utils/auth";
import { isValidFutureDate } from "@/utils/dateTime";
import { updateDoctor } from "@/utils/doctor";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Alert,
  Image,
} from "react-native";
import { Switch } from "react-native-gesture-handler";
import deleteIcon from "@/assets/icons/delete.png";

const { width } = Dimensions.get("window");

export default function Availability() {
    const [toggleDayTriggered, setToggleDayTriggered] = useState(false);
    const daysList = ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"];

    const toggleDay = (day: string) => {
        setToggleDayTriggered(true);

        setUnavailableDays(prev =>
            prev.includes(day)
            ? prev.filter(d => d !== day)   // make it available
            : [...prev, day]                // make it unavailable
        );
    };

    const cancelAvailability = () => {
        setToggleDayTriggered(false);
        setUnavailableDays(initialUnavailable);
    };

    const saveUnavailableDates = async () => {
        try {
            const doctor = await getUser();
            const payload = {
                ...doctor,
                unavailableDays: unavailableDays.map(d => d.toUpperCase())
            };
            await updateDoctor(payload);
        } catch (error) {
            console.log(error);
        }
        setToggleDayTriggered(false);
        fetchDays();
    }

    const handleUnavailableDates = async () => {
        try {
            if(unavailableDates.length === 0) return;

            const formattedUnavailableDates = unavailableDates
              .split(",")
              .map(date => date.trim())
              .filter(date => date.length > 0);

            // 🔥 Check all dates
            const allValid = formattedUnavailableDates.every(date =>
              isValidFutureDate(date)
            );

            if (!allValid) {
              Alert.alert("Please enter only valid future dates in dd-mm-yyyy format");
              return;
            }

            const doctor = await getUser();

            const updatedDates = [
              ...new Set([
                ...(doctor.unavailableDates || []),
                ...formattedUnavailableDates
              ])
            ];

            const payload = {
              ...doctor,
              unavailableDates: updatedDates
            };

            await updateDoctor(payload);
            setSavedUnavailableDates(updatedDates);
            setUnavailableDates("");
        } catch (error) {
            console.log(error);
        }
    }


    const [unavailableDates, setUnavailableDates] = useState<string>("");
    const [savedUnavailableDates, setSavedUnavailableDates] = useState<string[]>([]);
    const [unavailableDays, setUnavailableDays] = useState<string[]>([]);
    const [initialUnavailable, setInitialUnavailable] = useState<string[]>([]);
    const [startTime, setStartTime] = useState("10:00 AM");
    const [endTime, setEndTime] = useState("06:00 PM");
    const [editing, setEditing] = useState(false);

    const fetchDays = async () => {
      const user = await getUser();

      setUnavailableDays(user.unavailableDays || []);
      setInitialUnavailable(user.unavailableDays || []);

      setSavedUnavailableDates(user.unavailableDates || []);
      setStartTime(user.startTime || "10:00 AM");
      setEndTime(user.endTime || "06:00 PM");
    };
    
    useEffect(() => {
        fetchDays();
    }, []);

    const deleteUnavailableDate = async (dateToDelete: string) => {
      try {
        const updatedDates = savedUnavailableDates.filter(
          date => date !== dateToDelete
        );

        setSavedUnavailableDates(updatedDates);

        const doctor = await getUser();

        const payload = {
          ...doctor,
          unavailableDates: updatedDates
        };

        await updateDoctor(payload);
      } catch (error) {
        console.log(error);
      }
    };

    const handleWorkHours = async () => {
        try {
            const doctor = await getUser();
            const payload = {
                ...doctor,
                startTime,
                endTime
            };
            await updateDoctor(payload);
            setEditing(false);
            fetchDays();
        } catch (error) {
            console.log(error);
        }
    }


  return (
    <ScrollView style={styles.root}>
      <View style={styles.bgBlob1} />
      <View style={styles.bgBlob2} />

        <Text style={styles.header}>Availability ⏳</Text>
        {daysList.map(day => (
            <View key={day} style={styles.row}>
            <Text style={styles.day}>{day}</Text>
            <Switch
                value={!unavailableDays.includes(day)}
                onValueChange={() => toggleDay(day)}
            />
            </View>
        ))}
        {toggleDayTriggered && (
            <View style={styles.togleButton}>
                <TouchableOpacity
                    style={styles.secondary}
                    onPress={() => cancelAvailability()}
                >
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => saveUnavailableDates(true)}
                >
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
            </View>
        )}
        
      {/* Unavailable Days Input */}
      <View style={styles.card}>
        <Text style={styles.label}>Unavailable Days</Text>
        <TextInput
          placeholder="e.g. dd-mm-yyyy, dd-mm-yyyy"
          value={unavailableDates}
          onChangeText={setUnavailableDates}
          style={styles.input}
        />
        <Text style={styles.helper}>
          Enter days separated by comma
        </Text>
        {unavailableDates.length > 0 && (
            <TouchableOpacity
                    style={{...styles.button, marginTop: 10}}
                    onPress={() => handleUnavailableDates()}
                >
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
        )}
        {savedUnavailableDates.length > 0 && (
          <View style={{ flexDirection: "row", padding: 10, flexWrap: "wrap", marginTop: 10 }}>
            {savedUnavailableDates.map((date, index) => (
              <View key={index} style={styles.dateChip}>
                <Text style={styles.chipText}>{date}</Text>
                <TouchableOpacity
                  onPress={() => deleteUnavailableDate(date)}
                >
                  <Image
                    source={deleteIcon}
                    style={{ width: 24, height: 24 }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Working Hours Section */}
      <View style={styles.card}>
        <Text style={styles.label}>Working Hours</Text>

        {!editing ? (
          <>
            <Text style={styles.time}>
              {startTime} — {endTime}
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setEditing(true)}
            >
              <Text style={styles.buttonText}>Change Time</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TextInput
              value={startTime}
              onChangeText={setStartTime}
              placeholder="Start Time"
              style={styles.input}
            />
            <TextInput
              value={endTime}
              onChangeText={setEndTime}
              placeholder="End Time"
              style={styles.input}
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => handleWorkHours()}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F5FBFF",
    padding: 20,
    paddingTop: 60,
  },

  bgBlob1: {
    position: "absolute",
    top: -120,
    left: -90,
    width,
    height: width,
    borderRadius: width,
    backgroundColor: "rgba(70,205,255,0.18)",
  },

  bgBlob2: {
    position: "absolute",
    bottom: -140,
    right: -90,
    width,
    height: width,
    borderRadius: width,
    backgroundColor: "rgba(55,208,109,0.14)",
  },

  header: {
    fontSize: 24,
    fontWeight: "900",
    color: "#102A43",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 20,
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: "900",
    color: "#102A43",
    marginBottom: 8,
  },
  row: { backgroundColor: "#fff", padding: 16, borderRadius: 16, marginBottom: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center", }, day: { fontSize: 14, fontWeight: "800", color: "#102A43" },

  input: {
    backgroundColor: "#F1F5F9",
    padding: 12,
    borderRadius: 12,
    fontSize: 14,
    marginBottom: 10,
  },

  helper: {
    fontSize: 12,
    color: "#64748b",
  },

  time: {
    fontSize: 15,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 12,
  },

  button: {
    backgroundColor: "#46CDFF",
    padding: 12,
    borderRadius: 12,
    flex: 1,
    alignItems: "center",
  },
  togleButton: {
    marginBottom: 10,
    display: "flex",
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  secondary: {
    flex: 1,
    backgroundColor: "#c2c2c2",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  saveButton: {
    backgroundColor: "#37D06D",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 5,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
  },
  dateChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#a2dff5",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginRight: 8,
    marginBottom: 8,
  },

  chipText: {
    padding: 9,
    fontSize: 15,
    fontWeight: "800",
    marginRight: 6,
    color: "#102A43",
  },

  deleteText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#EF4444",
  },
});