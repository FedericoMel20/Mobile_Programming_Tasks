import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BREAKPOINTS = {
  tablet: 768,
  largeTablet: 1024,
};

const featureCards = [
  {
    key: "dashboard",
    title: "Dashboard",
    description: "Ringkasan singkat performa bisnis Anda.",
    icon: { family: "MaterialIcons", name: "dashboard" },
  },
  {
    key: "calendar",
    title: "Calendar",
    description: "Atur jadwal meeting dan to-do secara terstruktur.",
    icon: { family: "FontAwesome5", name: "calendar-alt" },
  },
  {
    key: "tasks",
    title: "Tasks",
    description: "Lacak progres tugas tim secara real-time.",
    icon: { family: "Ionicons", name: "list" },
  },
  {
    key: "messages",
    title: "Messages",
    description: "Komunikasi cepat antar anggota tim.",
    icon: { family: "MaterialIcons", name: "message" },
  },
];

function IconRenderer({
  family,
  name,
  size,
}: {
  family: string;
  name: string;
  size: number;
}) {
  // Choose icon family
  if (family === "MaterialIcons") {
    return <MaterialIcons name={name as any} size={size} color="#8AB4FF" />;
  }
  if (family === "FontAwesome5") {
    return <FontAwesome5 name={name as any} size={size} color="#8AB4FF" />;
  }
  if (family === "Ionicons") {
    return <Ionicons name={name as any} size={size} color="#8AB4FF" />;
  }
  // fallback
  return <MaterialIcons name="help-outline" size={size} color="#8AB4FF" />;
}

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const isTablet = width >= BREAKPOINTS.tablet;
  const isLargeTablet = width >= BREAKPOINTS.largeTablet;
  const isLandscape = width > height;

  // responsive scale factor based on smaller screen dimension
  const base = Math.min(width, height);
  const scale = base / 375; 

  // icon sizing — scale dynamically and tune per device class
  const iconSize = Math.round(
    22 * scale * (isLargeTablet ? 1.8 : isTablet ? 1.3 : 1)
  );

 
  const cardWidthStyle = isLargeTablet
    ? { width: "31%" } 
    : isTablet && isLandscape
    ? { width: "48%" } 
    : isTablet
    ? { width: "48%" }
    : { width: "100%" };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          isTablet ? styles.containerTablet : styles.containerMobile,
        ]}
      >
        <View
          style={[
            styles.hero,
            isTablet ? styles.heroTablet : styles.heroMobile,
            // on large tablets or landscape, give hero more horizontal padding
            isLargeTablet && { padding: 32 },
            isLandscape && isTablet && { paddingVertical: 28 },
          ]}
        >
          <View style={styles.heroLeft}>
            <Text style={styles.overline}>
              {isLargeTablet ? "Large Tablet" : isTablet ? "Tablet" : "Mobile"}{" "}
              {isLandscape ? "— Landscape" : "— Portrait"}
            </Text>
            <Text style={styles.title}>Dashboard Responsive</Text>
            <Text style={styles.subtitle}>
              Contoh layout yang otomatis menyesuaikan tampilan tablet, ponsel,
              dan orientasi.
            </Text>
          </View>

          {/* Optionally show a larger decorative block on tablets */}
          <View
            style={[
              styles.heroPreview,
              isTablet ? styles.heroPreviewTablet : styles.heroPreviewMobile,
            ]}
          >
            <Text style={styles.previewText}>
              {isLargeTablet ? "Overview" : "Ringkasan"}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.cardGrid,
            isLargeTablet ? styles.cardGridLargeTablet : isTablet ? styles.cardGridTablet : styles.cardGridMobile,
          ]}
        >
          {featureCards.map((card) => (
            <View
              key={card.key}
              style={[
                styles.card,
                isTablet ? styles.cardTablet : styles.cardMobile,
                cardWidthStyle,
              ]}
            >
              <View style={styles.cardHeader}>
                <IconRenderer
                  family={card.icon.family}
                  name={card.icon.name}
                  size={iconSize}
                />
                <Text style={styles.cardTitle}>{card.title}</Text>
              </View>

              <Text style={styles.cardDesc}>{card.description}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0B1120",
  },
  container: {
    flexGrow: 1,
    gap: 24,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  containerMobile: {
    alignItems: "stretch",
  },
  containerTablet: {
    maxWidth: 1200,
    alignSelf: "center",
  },
  hero: {
    borderRadius: 24,
    padding: 24,
    backgroundColor: "#111C33",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },
  heroMobile: {
    alignItems: "flex-start",
  },
  heroTablet: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 24,
  },
  heroLeft: {
    flex: 1,
  },
  heroPreview: {
    minWidth: 120,
    minHeight: 80,
    borderRadius: 16,
    backgroundColor: "#0F243F",
    alignItems: "center",
    justifyContent: "center",
  },
  heroPreviewMobile: {
    marginTop: 12,
  },
  heroPreviewTablet: {
    width: 220,
    height: 120,
  },
  previewText: {
    color: "#B8C6E3",
    fontSize: 16,
  },
  overline: {
    color: "#8AB4FF",
    letterSpacing: 1,
    fontSize: 12,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    color: "#B8C6E3",
    fontSize: 16,
    marginTop: 8,
  },

  cardGrid: {
    flexWrap: "wrap",
    gap: 12,
  },
  cardGridMobile: {
    flexDirection: "column",
    gap: 12,
  },
  cardGridTablet: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "space-between",
  },
  cardGridLargeTablet: {
    flexDirection: "row",
    gap: 18,
    justifyContent: "flex-start",
  },

  card: {
    flexGrow: 1,
    borderRadius: 20,
    padding: 20,
    backgroundColor: "#162544",
    marginBottom: 12,
  },
  cardMobile: {
    width: "100%",
  },
  cardTablet: {
    // width is dynamically set inline using cardWidthStyle above
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  cardDesc: {
    color: "#B8C6E3",
    fontSize: 14,
    lineHeight: 20,
  },
});
