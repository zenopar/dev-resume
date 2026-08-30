import { StyleSheet, Font } from "@react-pdf/renderer";

// Completely disable hyphenation breaks so words wrap naturally like in web preview
Font.registerHyphenationCallback((word) => [word]);

// Register full local Unicode Roboto font family (Regular, Bold, Italic, BoldItalic)
if (typeof window !== "undefined") {
  const origin = window.location.origin || "";
  Font.register({
    family: "Roboto",
    fonts: [
      {
        src: `${origin}/fonts/Roboto-Regular.ttf`,
        fontWeight: "normal",
        fontStyle: "normal",
      },
      {
        src: `${origin}/fonts/Roboto-Bold.ttf`,
        fontWeight: "bold",
        fontStyle: "normal",
      },
      {
        src: `${origin}/fonts/Roboto-Italic.ttf`,
        fontWeight: "normal",
        fontStyle: "italic",
      },
      {
        src: `${origin}/fonts/Roboto-BoldItalic.ttf`,
        fontWeight: "bold",
        fontStyle: "italic",
      },
    ],
  });
}

// Mathematical 1:1 conversion factor from 96 DPI CSS pixels to 72 DPI PDF points (72 / 96 = 0.75)
export const createPdfStyles = (
  fontSizeMultiplier = 1.05,
  spacingMultiplier = 1.0
) => {
  const px = (pixelValue: number) => pixelValue * 0.75;
  const f = (size: number) => Math.round(px(size) * fontSizeMultiplier * 10) / 10;
  const s = (spacing: number) => Math.round(px(spacing) * spacingMultiplier * 10) / 10;

  return StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#FFFFFF",
      paddingTop: s(32),
      paddingBottom: s(32),
      paddingLeft: s(36),
      paddingRight: s(36),
      fontFamily: "Roboto",
      color: "#000000",
    },

    // Header Banner
    headerContainer: {
      borderBottomWidth: 1.5,
      borderBottomColor: "#000000",
      borderBottomStyle: "solid",
      paddingBottom: s(8),
      marginBottom: s(10),
    },
    headerTopRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "baseline",
    },
    name: {
      fontSize: f(23),
      fontFamily: "Roboto",
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: -0.2,
      color: "#000000",
    },
    title: {
      fontSize: f(12),
      fontFamily: "Roboto",
      fontWeight: "bold",
      color: "#1F2937",
      marginTop: 2,
    },
    city: {
      fontSize: f(10),
      color: "#374151",
      fontFamily: "Roboto",
      fontWeight: "bold",
    },

    // Contacts Row
    contactRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      marginTop: s(7),
    },
    contactItemWrapper: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: s(14),
      marginBottom: s(2),
    },
    contactItem: {
      fontSize: f(9.8),
      color: "#1F2937",
      marginLeft: 3,
    },
    contactLink: {
      fontSize: f(9.8),
      color: "#000000",
      textDecoration: "none",
      fontFamily: "Roboto",
      fontWeight: "bold",
      marginLeft: 3,
    },

    // Section Titles with distinct breathing room below
    section: {
      marginBottom: s(9),
    },
    sectionTitleContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderBottomWidth: 0.8,
      borderBottomColor: "#D1D5DB",
      borderBottomStyle: "solid",
      paddingBottom: s(2.5),
      marginBottom: s(7), // Distinct margin under section title and line before first item!
    },
    sectionTitle: {
      fontSize: f(11),
      fontFamily: "Roboto",
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: 0.6,
      color: "#000000",
      marginLeft: 4,
    },
    sectionTitleLatex: {
      fontSize: f(11),
      fontFamily: "Roboto",
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: 1.0,
      borderBottomWidth: 1,
      borderBottomColor: "#000000",
      borderBottomStyle: "solid",
      paddingBottom: s(2.5),
      marginBottom: s(7),
      color: "#000000",
    },

    // Content Items
    aboutText: {
      fontSize: f(10),
      lineHeight: 1.38,
      color: "#1F2937",
      textAlign: "justify",
    },

    itemContainer: {
      marginBottom: s(7), // Comfortable space between jobs/projects
    },
    itemHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "baseline",
      width: "100%",
    },
    itemRoleCol: {
      flex: 1,
      paddingRight: 8,
    },
    itemRole: {
      fontSize: f(11),
      fontFamily: "Roboto",
      fontWeight: "bold",
      color: "#000000",
    },
    itemCompany: {
      fontSize: f(10.5),
      fontFamily: "Roboto",
      color: "#374151",
    },
    itemDates: {
      fontSize: f(9.5),
      color: "#4B5563",
      textAlign: "right",
      fontFamily: "Roboto",
      flexShrink: 0,
    },

    // Projects Specific
    projectName: {
      fontSize: f(10.8),
      fontFamily: "Roboto",
      fontWeight: "bold",
      color: "#000000",
    },
    projectRole: {
      fontSize: f(9.5),
      fontFamily: "Roboto",
      color: "#4B5563",
    },
    projectLink: {
      fontSize: f(9.5),
      color: "#000000",
      textDecoration: "none",
      fontFamily: "Courier",
      textAlign: "right",
      flexShrink: 0,
    },
    projectDesc: {
      fontSize: f(9.8),
      lineHeight: 1.34,
      color: "#1F2937",
      marginTop: s(2),
      textAlign: "justify",
    },
    projectTechRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "baseline",
      marginTop: s(2.5),
    },
    projectTechLabel: {
      fontSize: f(9.0),
      fontFamily: "Roboto",
      fontWeight: "bold",
      color: "#4B5563",
      marginRight: 3,
    },
    projectTechList: {
      fontSize: f(9.0),
      fontFamily: "Courier",
      color: "#374151",
    },

    bulletList: {
      marginTop: s(3),
    },
    bulletRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: s(2),
    },
    bulletDot: {
      fontSize: f(10),
      marginRight: 4,
      color: "#000000",
      fontFamily: "Roboto",
      fontWeight: "bold",
    },
    bulletText: {
      fontSize: f(9.8),
      lineHeight: 1.36,
      color: "#1F2937",
      flex: 1,
    },

    techTagsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: s(2.5),
    },
    techLabel: {
      fontSize: f(9),
      fontFamily: "Roboto",
      fontWeight: "bold",
      color: "#4B5563",
      marginRight: 3,
    },
    techList: {
      fontSize: f(9),
      fontFamily: "Courier",
      color: "#374151",
    },

    // Skills Matrix
    skillCategoryRow: {
      flexDirection: "row",
      alignItems: "baseline",
      marginBottom: s(3),
    },
    skillCategoryName: {
      fontSize: f(9.8),
      fontFamily: "Roboto",
      fontWeight: "bold",
      color: "#000000",
      width: px(125),
    },
    skillListText: {
      fontSize: f(9.8),
      color: "#1F2937",
      flex: 1,
      lineHeight: 1.34,
    },

    // Multi-column Bottom Grid
    twoColumnGrid: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: s(2),
    },
    gridColumn: {
      width: "48%",
    },

    // Split Sidebar Layout Specific
    splitSidebarRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    splitMainColumn: {
      width: "58%",
    },
    splitSidebarColumn: {
      width: "38%",
      borderLeftWidth: 0.8,
      borderLeftColor: "#E5E7EB",
      borderLeftStyle: "solid",
      paddingLeft: s(10),
    },

    // Sub sections
    subTitle: {
      fontSize: f(10),
      fontFamily: "Roboto",
      fontWeight: "bold",
      color: "#000000",
    },
    subText: {
      fontSize: f(9.5),
      color: "#374151",
    },
    subDetails: {
      fontSize: f(8.8),
      color: "#6B7280",
      fontStyle: "italic",
    },
  });
};
