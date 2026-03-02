import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import { patients } from "@/mock/patients";
import { getAllPatients } from "@/utils/patients";
import { calculateAge, isCurrentWeek } from "@/utils/dateTime";
import { LayoutAnimation } from "react-native";
import API_URL from "@/utils/api";
import axios from "axios";
import { getAllAppointments } from "@/utils/appointments";

const { width } = Dimensions.get("window");

export default function Patients() {
    const [search, setSearch] = useState("");
    const [patients, setPatients] = useState<any[]>([]);
    const [expanded, setExpanded] = useState<number | null>(null);
    const [filter, setFilter] = useState<"ACTIVE" | "SUSPENDED">("ACTIVE");
    const [appointments, setAppointments] = useState<any[]>([]);

    const load = async () => {
        const res = await getAllPatients();
        const app = await getAllAppointments();
        setAppointments(app);
        setPatients(res);
        console.log(patients);
    }
    useEffect(() => {
        load();
    }, [])

    const patientsThisWeek = patients.filter(
      (p) => p.createdAt && isCurrentWeek(p?.createdAt)
    ).length;
    

    const toggleExpand = (id: number) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setExpanded(expanded === id ? null : id);
    };

    const updatePatientStatus = async (id: number, accountStatus: string) => {
      try {
        const payload = {
            id,
            accountStatus
        }
        await axios.put(`${API_URL}/patient/update/status`, payload);
        load();
      } catch (error) {
        console.log(error);
      }
    };

    const filtered = patients.filter((p) => {
      const searchMatch =
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.accountStatus?.toLowerCase().includes(search.toLowerCase());

      const statusMatch = p.accountStatus === filter;

      return searchMatch && statusMatch;
    });

    return (
      <ScrollView
        style={styles.root}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Background Glow */}
        <View style={styles.bg1} />
        <View style={styles.bg2} />

        {/* HEADER */}
        <Text style={styles.title}>Our Patients 👩‍⚕️</Text>
        <Text style={styles.subtitle}>
          Manage consultations & view recent visits
        </Text>

        {/* STATS */}
        <View style={styles.statsRow}>
          <StatCard label="Total" value={patients.length} />
          <StatCard label="This Week" value={patientsThisWeek} />
          <StatCard label="Appointments" value={appointments?.length} />
        </View>

        {/* SEARCH */}
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Search patient..."
            placeholderTextColor="rgba(16,42,67,0.5)"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <View style={styles.filterRow}>
          {["ACTIVE", "SUSPENDED"].map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
              onPress={() => setFilter(f as any)}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === f && styles.filterTextActive,
                ]}
              >
                {f.charAt(0) + f.toLowerCase().slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {filtered.map((p) => (
          <View key={p.id} style={styles.glassCard}>
            <TouchableOpacity
              style={styles.cardRow}
              onPress={() => toggleExpand(p.id)}
            >
              {/* Avatar */}
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{p?.name?.charAt(0)}</Text>
              </View>

              {/* Info */}
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{p?.name}</Text>
                <Text style={styles.meta}>{p?.email}</Text>
                <Text style={styles.meta}>Age: {calculateAge(p?.dob)} yrs</Text>
                <Text style={styles.issue}>{p.issue}</Text>
                <Text style={styles.visit}>📍 {p.location}</Text>
              </View>

              {/* Status Badge */}
              <View
                style={[
                  styles.badge,
                  p.accountStatus === "ACTIVE"
                    ? styles.badgeActive
                    : styles.badgeSuspended,
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    p.accountStatus === "ACTIVE"
                      ? styles.badgeTextActive
                      : styles.badgeTextSuspended,
                  ]}
                >
                  {p.accountStatus}
                </Text>
              </View>
            </TouchableOpacity>
            {expanded === p.id && (
              <View style={styles.expandSection}>
                {p.accountStatus === "ACTIVE" ? (
                  <TouchableOpacity
                    style={styles.suspendBtn}
                    onPress={() => updatePatientStatus(p.id, "SUSPENDED")}
                  >
                    <Text style={styles.btnText}>Suspend</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.activateBtn}
                    onPress={() => updatePatientStatus(p.id, "ACTIVE")}
                  >
                    <Text style={styles.btnText}>Activate</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    );
}

/* ---------- Components ---------- */

function StatCard({
                      label,
                      value,
                  }: {
    label: string;
    value: any;
}) {
    return (
        <View style={styles.statCard}>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F5FBFF",
    padding: 20,
    paddingTop: 60,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  bg1: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 999,
    backgroundColor: "rgba(55,208,109,0.18)",
    top: -120,
    right: -100,
  },

  bg2: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: "rgba(16,42,67,0.05)",
    bottom: -100,
    left: -100,
  },

  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#102A43",
  },

  subtitle: {
    fontSize: 13,
    marginTop: 6,
    marginBottom: 20,
    color: "rgba(16,42,67,0.6)",
  },

  searchBox: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(16,42,67,0.06)",
    marginBottom: 20,
  },

  searchInput: {
    fontSize: 14,
    color: "#102A43",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },

  statCard: {
    width: "31%",
    backgroundColor: "rgba(55,208,109,0.12)",
    borderRadius: 20,
    padding: 14,
    alignItems: "center",
  },

  statValue: {
    fontSize: 18,
    fontWeight: "900",
    color: "#37d06d",
  },

  statLabel: {
    fontSize: 11,
    marginTop: 4,
    color: "#102A43",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#102A43",
    marginBottom: 14,
  },

  glassCard: {
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    flexDirection: "column",
    borderWidth: 1,
    borderColor: "rgba(16,42,67,0.05)",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 6,
  },

  avatar: {
    width: 54,
    height: 54,
    borderRadius: 20,
    backgroundColor: "#37d06d",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  avatarText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 18,
  },

  name: {
    fontSize: 15,
    fontWeight: "900",
    color: "#102A43",
  },

  meta: {
    fontSize: 12,
    color: "rgba(16,42,67,0.6)",
    marginTop: 2,
  },

  issue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#37d06d",
    marginTop: 6,
  },

  visit: {
    fontSize: 11,
    color: "rgba(16,42,67,0.6)",
    marginTop: 4,
  },

  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    minWidth: 90,
    alignItems: "center",
  },

  badgeActive: {
    backgroundColor: "rgba(34,197,94,0.15)",
  },

  badgeSuspended: {
    backgroundColor: "rgba(239,68,68,0.15)",
  },

  badgeText: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.5,
  },

  badgeTextActive: {
    color: "#16a34a",
  },

  badgeTextSuspended: {
    color: "#dc2626",
  },
  filterRow: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 10,
  },

  filterBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(34,197,94,0.15)",
  },

  filterBtnActive: {
    backgroundColor: "#37d06d",
  },

  filterText: {
    fontWeight: "700",
    color: "#102A43",
  },

  filterTextActive: {
    color: "#fff",
  },

  expandSection: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(16,42,67,0.08)",
    paddingTop: 10,
  },

  suspendBtn: {
    backgroundColor: "#dc2626",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },

  activateBtn: {
    backgroundColor: "#16a34a",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "800",
  },
});
