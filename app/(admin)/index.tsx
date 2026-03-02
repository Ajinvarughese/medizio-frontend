import React, { useState, useMemo, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import { fetchAllDoctors } from "@/utils/doctor";
import { useRouter } from "expo-router";
import { logout } from "@/utils/auth";

const { width } = Dimensions.get("window");

/* ✅ CATEGORY OBJECT WITH ICONS */
const CATEGORIES = [
    { icon: "🩺", label: "General Physician" },
    { icon: "❤️", label: "Cardiologist" },
    { icon: "🧠", label: "Neurologist" },
    { icon: "🧴", label: "Dermatologist" },
    { icon: "🦴", label: "Orthopedic" },
    { icon: "👶", label: "Pediatrician" },
    { icon: "🤰", label: "Gynecologist" },
    { icon: "🧑‍⚕️", label: "Psychiatrist" },
    { icon: "📷", label: "Radiologist" },
    { icon: "✂️", label: "Surgeon" },
];

export default function AdminHome() {
    const [activeCategory, setActiveCategory] = useState<string | null>("General Physician");
    const [doctors, setDoctors] = useState([]);
    const router = useRouter();

    const load = async () => {
        const doc = await fetchAllDoctors();
        setDoctors(doc)   
    }

    useEffect(() => {
        load();
    }, [])

    /* ✅ FILTER LOGIC */
    const filteredDoctors = useMemo(() => {
        let filtered = doctors;

        if (activeCategory) {
            filtered = doctors.filter(
                (doc) =>
                    doc?.speciality?.name?.toLowerCase() ===
                    activeCategory.toLowerCase()
            );
        }

        // Sort: verified doctors first
        return filtered.sort((a, b) => {
            if (a.verified === b.verified) return 0;
            return a.verified ? -1 : 1;
        });

    }, [activeCategory, doctors]);

    return (
      <ScrollView
        style={styles.root}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Background Blobs */}
        <View style={styles.bg1} />
        <View style={styles.bg2} />

        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Admin Dashboard 👑</Text>
            <Text style={styles.subtitle}>
              Monitor doctors and manage platform activity
            </Text>
          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={() => {
            logout();
            router.replace('/(auth)/welcome');
          }}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* HERO CARD */}
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Platform Overview</Text>

          <View style={styles.statsRow}>
            <StatBox value={doctors.length} label="Total Doctors" />

            <StatBox
              value={doctors.filter((d) => !d?.verified).length}
              label="Pending"
            />
          </View>
        </View>

        {/* CATEGORY SECTION */}
        <Text style={styles.sectionTitle}>Specializations</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.label;

            return (
              <TouchableOpacity
                key={cat.label}
                style={[styles.categoryCard, isActive && styles.categoryActive]}
                onPress={() => setActiveCategory(isActive ? null : cat.label)}
              >
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text
                  style={[styles.categoryText, isActive && { color: "#fff" }]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* DOCTOR LIST */}
        <Text style={styles.sectionTitle}>Doctors</Text>

        {filteredDoctors.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🧑‍⚕️</Text>
            <Text style={styles.emptyTitle}>No Doctors Found</Text>
            <Text style={styles.emptySubtitle}>
              There are no doctors available for this specialization right now.
            </Text>
          </View>
        ) : (
          filteredDoctors.map((doc) => (
            <View key={doc.id} style={styles.doctorCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.docName}>Dr. {doc.name}</Text>
                <Text style={{ ...styles.docSpec, fontWeight: "500" }}>
                  {doc.email}
                </Text>
                <Text style={styles.docSpec}>{doc.speciality.name}</Text>

                <View style={styles.metaRow}>
                  <Text style={styles.meta}>⭐ {doc.rating}</Text>
                  <Text style={styles.meta}>📍{doc.location}</Text>

                  <View
                    style={[
                      styles.label,
                      doc.accountStatus === "ACTIVE"
                        ? styles.labelActive
                        : styles.labelSuspended,
                    ]}
                  >
                    <Text
                      style={[
                        styles.labelText,
                        doc.accountStatus === "ACTIVE"
                          ? styles.labelTextActive
                          : styles.labelTextSuspended,
                      ]}
                    >
                      {doc.accountStatus === "ACTIVE" ? "Active" : "Suspended"}
                    </Text>
                  </View>
                </View>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  doc.verified ? styles.approved : styles.pending,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    doc.verified ? { color: "#16a34a" } : { color: "#b45309" },
                  ]}
                >
                  {doc.verified ? "Verified" : "Unverified"}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    );
}

/* ---------- COMPONENTS ---------- */

function StatBox({
                     value,
                     label,
                 }: {
    value: number;
    label: string;
}) {
    return (
        <View style={styles.statBox}>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f0fdf4",
    padding: 20,
    paddingTop: 60,
  },

  bg1: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 999,
    backgroundColor: "rgba(55,208,109,0.15)",
    top: -120,
    right: -100,
  },

  bg2: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: "rgba(16,185,129,0.12)",
    bottom: -120,
    left: -100,
  },

  header: {
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoutBtn: {
    backgroundColor: "#ef4444",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },

  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#102A43",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#64748b",
  },

  heroCard: {
    backgroundColor: "#16a34a",
    borderRadius: 26,
    padding: 20,
    marginBottom: 25,
  },

  heroTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#fff",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  statBox: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 18,
    padding: 16,
    width: "48%",
  },

  statValue: {
    fontSize: 26,
    fontWeight: "900",
    color: "#fff",
  },

  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#102A43",
    marginTop: 20,
    marginBottom: 10,
  },

  categoryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginRight: 12,
    alignItems: "center",
    width: width * 0.32,
    elevation: 3,
  },

  categoryActive: {
    backgroundColor: "#37d06d",
  },

  categoryIcon: {
    fontSize: 26,
  },

  categoryText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#102A43",
    marginTop: 6,
    textAlign: "center",
  },

  doctorCard: {
    backgroundColor: "#ffffff",
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
  },

  docName: {
    fontSize: 15,
    fontWeight: "900",
    color: "#102A43",
  },

  docSpec: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
  },

  metaRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },

  meta: {
    fontSize: 11,
    color: "#475569",
    fontWeight: "600",
    alignSelf: "center",
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },

  approved: {
    backgroundColor: "rgba(22,163,74,0.12)",
  },

  pending: {
    backgroundColor: "rgba(234,179,8,0.15)",
  },

  statusText: {
    fontSize: 11,
    fontWeight: "800",
  },
  label: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: "flex-start",
  },

  labelText: {
    fontSize: 11,
    fontWeight: "800",
  },

  labelActive: {
    backgroundColor: "rgba(34,197,94,0.15)", // light green
  },

  labelTextActive: {
    color: "#16a34a",
  },

  labelSuspended: {
    backgroundColor: "rgba(251,146,60,0.18)", // light orange
  },

  labelTextSuspended: {
    color: "#ea580c",
  },
  emptyState: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 30,
    alignItems: "center",
    marginTop: 20,
    elevation: 3,
  },

  emptyIcon: {
    fontSize: 42,
    marginBottom: 10,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#102A43",
  },

  emptySubtitle: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
    marginTop: 6,
    maxWidth: 240,
  },
});
