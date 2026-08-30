import React from "react";
import { Page, Text, View, Link } from "@react-pdf/renderer";
import { ResumeData } from "../../resume/types";
import { getResumeLabels } from "../../resume/translations";
import { createPdfStyles } from "../PdfStyles";
import { PdfIcon } from "../components/PdfIcons";

export const CompactSplitPdf: React.FC<{ data: ResumeData }> = ({ data }) => {
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
      {/* Header Banner */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTopRow}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={styles.name}>
              {personalInfo.firstName || "Firstname"}{" "}
              {personalInfo.lastName || "Lastname"}
            </Text>
            {personalInfo.title ? (
              <Text style={styles.title}>{personalInfo.title}</Text>
            ) : null}
          </View>
          {personalInfo.city ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 3.5, flexShrink: 0 }}>
              {settings.showIcons ? <PdfIcon name="map-pin" size={9} color="#000000" /> : null}
              <Text style={styles.city}>{personalInfo.city}</Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* 2-Column Split Body */}
      <View style={styles.splitSidebarRow}>
        {/* Left Main Column (58%) */}
        <View style={styles.splitMainColumn}>
          {/* Profile */}
          {aboutMe.summary ? (
            <View style={styles.section}>
              <View style={styles.sectionTitleContainer}>
                {settings.showIcons ? <PdfIcon name="user" size={9.5} color="#000000" /> : null}
                <Text style={styles.sectionTitle}>{labels.profile}</Text>
              </View>
              <Text style={styles.aboutText}>{aboutMe.summary}</Text>
            </View>
          ) : null}

          {/* Work Experience */}
          {experience.length > 0 ? (
            <View style={styles.section}>
              <View style={styles.sectionTitleContainer}>
                {settings.showIcons ? <PdfIcon name="briefcase" size={9.5} color="#000000" /> : null}
                <Text style={styles.sectionTitle}>{labels.experience}</Text>
              </View>
              {experience.map((exp) => (
                <View key={exp.id} style={styles.itemContainer}>
                  <View style={styles.itemHeader}>
                    <View style={styles.itemRoleCol}>
                      <Text style={styles.itemRole}>{exp.role}</Text>
                    </View>
                    <Text style={styles.itemDates}>
                      {exp.startDate} – {exp.current ? labels.present : exp.endDate}
                    </Text>
                  </View>
                  <Text style={styles.itemCompany}>
                    {exp.company} {exp.location ? `• ${exp.location}` : ""}
                  </Text>

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
              <View style={styles.sectionTitleContainer}>
                {settings.showIcons ? <PdfIcon name="projects" size={9.5} color="#000000" /> : null}
                <Text style={styles.sectionTitle}>{labels.projects}</Text>
              </View>
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
                      <Text style={styles.projectTechLabel}>{labels.stack}</Text>
                      <Text style={styles.projectTechList}>
                        {proj.technologies.join(" • ")}
                      </Text>
                    </View>
                  ) : null}
                </View>
              ))}
            </View>
          ) : null}
        </View>

        {/* Right Sidebar Column (38%) */}
        <View style={styles.splitSidebarColumn}>
          {/* Contact */}
          <View style={styles.section}>
            <View style={styles.sectionTitleContainer}>
              {settings.showIcons ? <PdfIcon name="mail" size={9.5} color="#000000" /> : null}
              <Text style={styles.sectionTitle}>{labels.contact}</Text>
            </View>
            <View style={{ gap: 4 }}>
              {personalInfo.email ? (
                <View style={styles.contactItemWrapper}>
                  {settings.showIcons ? <PdfIcon name="mail" size={8} color="#000000" /> : null}
                  <Link src={`mailto:${personalInfo.email}`} style={styles.contactLink}>
                    {personalInfo.email}
                  </Link>
                </View>
              ) : null}
              {personalInfo.phone ? (
                <View style={styles.contactItemWrapper}>
                  {settings.showIcons ? <PdfIcon name="phone" size={8} color="#000000" /> : null}
                  <Text style={styles.contactItem}>{personalInfo.phone}</Text>
                </View>
              ) : null}
              {personalInfo.github ? (
                <View style={styles.contactItemWrapper}>
                  {settings.showIcons ? <PdfIcon name="github" size={8} color="#000000" /> : null}
                  <Link src={getFullUrl(personalInfo.github)} style={styles.contactLink}>
                    {formatUrl(personalInfo.github)}
                  </Link>
                </View>
              ) : null}
              {personalInfo.linkedin ? (
                <View style={styles.contactItemWrapper}>
                  {settings.showIcons ? <PdfIcon name="linkedin" size={8} color="#000000" /> : null}
                  <Link src={getFullUrl(personalInfo.linkedin)} style={styles.contactLink}>
                    {formatUrl(personalInfo.linkedin)}
                  </Link>
                </View>
              ) : null}
              {personalInfo.website ? (
                <View style={styles.contactItemWrapper}>
                  {settings.showIcons ? <PdfIcon name="globe" size={8} color="#000000" /> : null}
                  <Link src={getFullUrl(personalInfo.website)} style={styles.contactLink}>
                    {formatUrl(personalInfo.website)}
                  </Link>
                </View>
              ) : null}
            </View>
          </View>

          {/* Technical Skills */}
          {skills.length > 0 ? (
            <View style={styles.section}>
              <View style={styles.sectionTitleContainer}>
                {settings.showIcons ? <PdfIcon name="code" size={9.5} color="#000000" /> : null}
                <Text style={styles.sectionTitle}>{labels.skills}</Text>
              </View>
              {skills.map((cat) => (
                <View key={cat.id} style={{ marginBottom: 3 }}>
                  <Text style={styles.subTitle}>{cat.category}:</Text>
                  <Text style={styles.subText}>{cat.skills.join(", ")}</Text>
                </View>
              ))}
            </View>
          ) : null}

          {/* Education */}
          {education.length > 0 ? (
            <View style={styles.section}>
              <View style={styles.sectionTitleContainer}>
                {settings.showIcons ? <PdfIcon name="education" size={9.5} color="#000000" /> : null}
                <Text style={styles.sectionTitle}>{labels.education}</Text>
              </View>
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

          {/* Certifications */}
          {certifications.length > 0 ? (
            <View style={styles.section}>
              <View style={styles.sectionTitleContainer}>
                {settings.showIcons ? <PdfIcon name="check" size={9.5} color="#000000" /> : null}
                <Text style={styles.sectionTitle}>{labels.certifications}</Text>
              </View>
              {certifications.map((cert) => (
                <View key={cert.id} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", width: "100%", marginBottom: 2 }}>
                  <View style={{ flex: 1, paddingRight: 4 }}>
                    <Text style={styles.subText}>
                      <Text style={{ fontFamily: "Roboto", fontWeight: "bold", color: "#000000" }}>{cert.name}</Text>
                    </Text>
                    <Text style={styles.subDetails}>{cert.issuer}</Text>
                  </View>
                  {cert.date ? (
                    <Text style={styles.itemDates}>{cert.date}</Text>
                  ) : null}
                </View>
              ))}
            </View>
          ) : null}

          {/* Awards */}
          {awards.length > 0 ? (
            <View style={styles.section}>
              <View style={styles.sectionTitleContainer}>
                {settings.showIcons ? <PdfIcon name="award" size={9.5} color="#000000" /> : null}
                <Text style={styles.sectionTitle}>{labels.awards}</Text>
              </View>
              {awards.map((award) => (
                <View key={award.id} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", width: "100%", marginBottom: 2 }}>
                  <View style={{ flex: 1, paddingRight: 4 }}>
                    <Text style={styles.subTitle}>{award.name}</Text>
                    <Text style={styles.subDetails}>{award.issuer}</Text>
                  </View>
                  {award.date ? (
                    <Text style={styles.itemDates}>{award.date}</Text>
                  ) : null}
                </View>
              ))}
            </View>
          ) : null}

          {/* Languages */}
          {languages.length > 0 ? (
            <View style={styles.section}>
              <View style={styles.sectionTitleContainer}>
                {settings.showIcons ? <PdfIcon name="languages" size={9.5} color="#000000" /> : null}
                <Text style={styles.sectionTitle}>{labels.languages}</Text>
              </View>
              {languages.map((lang) => (
                <Text key={lang.id} style={styles.subText}>
                  <Text style={{ fontFamily: "Roboto", fontWeight: "bold", color: "#000000" }}>{lang.name}:</Text> {lang.proficiency}
                </Text>
              ))}
            </View>
          ) : null}
        </View>
      </View>
    </Page>
  );
};
