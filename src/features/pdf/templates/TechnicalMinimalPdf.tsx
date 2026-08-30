import React from "react";
import { Page, Text, View, Link } from "@react-pdf/renderer";
import { ResumeData } from "../../resume/types";
import { getResumeLabels } from "../../resume/translations";
import { createPdfStyles } from "../PdfStyles";

export const TechnicalMinimalPdf: React.FC<{ data: ResumeData }> = ({ data }) => {
  const {
    personalInfo,
    aboutMe,
    experience,
    projects,
    skills,
    education,
    certifications,
    awards,
    languages,
    settings,
  } = data;

  const styles = createPdfStyles(
    settings.fontSizeMultiplier || 1.05,
    settings.spacingMultiplier || 1.0
  );

  const labels = getResumeLabels(settings.language);

  const formatUrl = (url: string) => {
    return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  };

  const getFullUrl = (url: string) => {
    return url.startsWith("http") ? url : `https://${url}`;
  };

  const renderPdfBullet = (text: string) => {
    const clean = text.replace(/^[•\-\*]\s*/, "");
    if (clean.includes("**")) {
      const parts = clean.split("**");
      return (
        <Text style={styles.bulletText}>
          {parts.map((p, i) =>
            i % 2 === 1 ? (
              <Text key={i} style={{ fontFamily: "Roboto", fontWeight: "bold", color: "#000000" }}>
                {p}
              </Text>
            ) : (
              <Text key={i}>{p}</Text>
            )
          )}
        </Text>
      );
    }
    return <Text style={styles.bulletText}>{clean}</Text>;
  };

  return (
    <Page size="A4" style={styles.page}>
      {/* Centered LaTeX Style Header */}
      <View
        style={{
          alignItems: "center",
          borderBottomWidth: 1.2,
          borderBottomColor: "#000000",
          paddingBottom: 6,
          marginBottom: 8,
        }}
      >
        <Text style={{ ...styles.name, textAlign: "center", letterSpacing: 1.0, fontSize: 22 }}>
          {personalInfo.firstName || "Firstname"}{" "}
          {personalInfo.lastName || "Lastname"}
        </Text>
        {personalInfo.title ? (
          <Text style={{ ...styles.title, textAlign: "center", marginTop: 2, fontSize: 11 }}>
            {personalInfo.title}
          </Text>
        ) : null}

        {/* Delimited Contacts */}
        <View style={{ ...styles.contactRow, justifyContent: "center", marginTop: 4 }}>
          {personalInfo.city ? (
            <Text style={styles.contactItem}>{personalInfo.city} • </Text>
          ) : null}
          {personalInfo.email ? (
            <Link src={`mailto:${personalInfo.email}`} style={styles.contactLink}>
              {personalInfo.email}
            </Link>
          ) : null}
          {personalInfo.phone ? (
            <Text style={styles.contactItem}> • {personalInfo.phone}</Text>
          ) : null}
          {personalInfo.website ? (
            <Link src={getFullUrl(personalInfo.website)} style={styles.contactLink}>
              {" "}• {formatUrl(personalInfo.website)}
            </Link>
          ) : null}
          {personalInfo.github ? (
            <Link src={getFullUrl(personalInfo.github)} style={styles.contactLink}>
              {" "}• {formatUrl(personalInfo.github)}
            </Link>
          ) : null}
          {personalInfo.linkedin ? (
            <Link src={getFullUrl(personalInfo.linkedin)} style={styles.contactLink}>
              {" "}• {formatUrl(personalInfo.linkedin)}
            </Link>
          ) : null}
        </View>
      </View>

      {/* About Me */}
      {aboutMe.summary ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitleLatex}>{labels.summary}</Text>
          <Text style={styles.aboutText}>{aboutMe.summary}</Text>
        </View>
      ) : null}

      {/* Technical Skills */}
      {skills.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitleLatex}>{labels.skills}</Text>
          {skills.map((cat) => (
            <View key={cat.id} style={styles.skillCategoryRow}>
              <Text style={{ ...styles.skillCategoryName, width: 120 }}>
                {cat.category}:
              </Text>
              <Text style={styles.skillListText}>{cat.skills.join(", ")}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* Experience */}
      {experience.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitleLatex}>{labels.experience}</Text>
          {experience.map((exp) => (
            <View key={exp.id} style={styles.itemContainer}>
              <View style={styles.itemHeader}>
                <View style={styles.itemRoleCol}>
                  <Text style={styles.itemRole}>
                    {exp.role}{" "}
                    <Text style={styles.itemCompany}>— {exp.company}</Text>
                  </Text>
                </View>
                <Text style={styles.itemDates}>
                  {exp.startDate} – {exp.current ? labels.present : exp.endDate}
                  {exp.location ? ` | ${exp.location}` : ""}
                </Text>
              </View>

              {exp.description ? (
                <View style={styles.bulletList}>
                  {exp.description.split("\n").filter(Boolean).map((line, idx) => (
                    <View key={idx} style={styles.bulletRow}>
                      <Text style={styles.bulletDot}>•</Text>
                      {renderPdfBullet(line)}
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          ))}
        </View>
      ) : null}

      {/* Projects */}
      {projects.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitleLatex}>{labels.projects}</Text>
          {projects.map((proj) => (
            <View key={proj.id} style={styles.itemContainer}>
              <View style={styles.itemHeader}>
                <View style={styles.itemRoleCol}>
                  <Text style={styles.projectName}>
                    {proj.name}
                    {proj.role ? (
                      <Text style={styles.projectRole}> ({proj.role})</Text>
                    ) : null}
                  </Text>
                </View>
                {proj.website ? (
                  <Link src={getFullUrl(proj.website)} style={styles.projectLink}>
                    {formatUrl(proj.website)}
                  </Link>
                ) : null}
              </View>

              {proj.description ? (
                <Text style={styles.projectDesc}>{proj.description}</Text>
              ) : null}

              {proj.technologies && proj.technologies.length > 0 ? (
                <View style={styles.projectTechRow}>
                  <Text style={styles.projectTechLabel}>{labels.keywords}</Text>
                  <Text style={styles.projectTechList}>
                    {proj.technologies.join(" • ")}
                  </Text>
                </View>
              ) : null}
            </View>
          ))}
        </View>
      ) : null}

      {/* 2-Column Bottom: Education & Certs/Awards */}
      <View style={styles.twoColumnGrid}>
        {/* Left Column */}
        <View style={styles.gridColumn}>
          {education.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitleLatex}>{labels.education}</Text>
              {education.map((edu) => (
                <View key={edu.id} style={{ marginBottom: 3 }}>
                  <View style={styles.itemHeader}>
                    <View style={styles.itemRoleCol}>
                      <Text style={styles.subTitle}>{edu.degree}</Text>
                    </View>
                    <Text style={styles.itemDates}>
                      {edu.startDate} – {edu.endDate}
                    </Text>
                  </View>
                  <Text style={styles.subText}>{edu.school}</Text>
                  {edu.details ? (
                    <Text style={styles.subDetails}>{edu.details}</Text>
                  ) : null}
                </View>
              ))}
            </View>
          ) : null}

          {languages.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitleLatex}>{labels.languages}</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {languages.map((lang) => (
                  <Text key={lang.id} style={styles.subText}>
                    <Text style={{ fontFamily: "Roboto", fontWeight: "bold", color: "#000000" }}>{lang.name}</Text> ({lang.proficiency})
                  </Text>
                ))}
              </View>
            </View>
          ) : null}
        </View>

        {/* Right Column */}
        <View style={styles.gridColumn}>
          {certifications.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitleLatex}>{labels.certifications}</Text>
              {certifications.map((cert) => (
                <View key={cert.id} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", width: "100%", marginBottom: 2 }}>
                  <View style={{ flex: 1, paddingRight: 6 }}>
                    <Text style={styles.subText}>
                      <Text style={{ fontFamily: "Roboto", fontWeight: "bold", color: "#000000" }}>{cert.name}</Text>
                    </Text>
                  </View>
                  {cert.date ? (
                    <Text style={styles.itemDates}>{cert.date}</Text>
                  ) : null}
                </View>
              ))}
            </View>
          ) : null}

          {awards.length > 0 ? (
            <View style={{ ...styles.section, marginTop: 3 }}>
              <Text style={styles.sectionTitleLatex}>{labels.awards}</Text>
              {awards.map((award) => (
                <View key={award.id} style={{ marginBottom: 2.5 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
                    <View style={{ flex: 1, paddingRight: 6 }}>
                      <Text style={styles.subTitle}>{award.name}</Text>
                    </View>
                    {award.date ? (
                      <Text style={styles.itemDates}>{award.date}</Text>
                    ) : null}
                  </View>
                  <Text style={styles.subDetails}>
                    {award.issuer}{" "}
                    {award.description ? `• ${award.description}` : ""}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      </View>
    </Page>
  );
};
