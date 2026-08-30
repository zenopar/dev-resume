import React from "react";
import { ResumeData } from "../../resume/types";
import { getResumeLabels } from "../../resume/translations";
import { Icon } from "@/components/ui";

export interface TemplateProps {
  data: ResumeData;
}

export const CompactSplitTemplate: React.FC<TemplateProps> = ({ data }) => {
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

  const fontScale = settings.fontSizeMultiplier || 1.05;
  const spaceScale = settings.spacingMultiplier || 1.0;
  const labels = getResumeLabels(settings.language);

  const formatUrl = (url: string) => {
    return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  };

  const renderFormattedBullet = (text: string) => {
    const cleanText = text.replace(/^[•\-\*]\s*/, "");
    if (cleanText.includes("**")) {
      const parts = cleanText.split("**");
      return (
        <span>
          {parts.map((part, i) =>
            i % 2 === 1 ? (
              <strong key={i} className="font-bold text-black">
                {part}
              </strong>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </span>
      );
    }
    return <span>{cleanText}</span>;
  };

  return (
    <div
      className="w-full h-full bg-white text-black font-sans leading-relaxed flex flex-col selection:bg-zinc-200"
      style={{
        fontSize: `${11 * fontScale}px`,
        lineHeight: 1.38,
      }}
    >
      {/* Header Banner */}
      <header
        className="border-b-2 border-black pb-2 mb-2 flex justify-between items-end"
        style={{
          paddingBottom: `${8 * spaceScale}px`,
          marginBottom: `${10 * spaceScale}px`,
        }}
      >
        <div>
          <h1
            className="font-bold tracking-tight text-black uppercase"
            style={{ fontSize: `${24 * fontScale}px`, letterSpacing: "-0.02em" }}
          >
            {personalInfo.firstName || "Firstname"}{" "}
            {personalInfo.lastName || "Lastname"}
          </h1>
          {personalInfo.title && (
            <p
              className="font-semibold text-zinc-800 tracking-wide mt-0.5"
              style={{ fontSize: `${12.5 * fontScale}px` }}
            >
              {personalInfo.title}
            </p>
          )}
        </div>

        {personalInfo.city && (
          <div
            className="text-zinc-700 font-medium flex items-center gap-1.5 shrink-0 pb-0.5"
            style={{ fontSize: `${10.5 * fontScale}px` }}
          >
            {settings.showIcons && <Icon name="map-pin" size={12} className="text-black shrink-0" />}
            <span>{personalInfo.city}</span>
          </div>
        )}
      </header>

      {/* 2-Column Split Body */}
      <div className="grid grid-cols-12 gap-3 flex-1" style={{ gap: `${12 * spaceScale}px` }}>
        {/* Main Column (Left - 7 cols / ~58%) */}
        <div className="col-span-7 space-y-2.5" style={{ rowGap: `${8 * spaceScale}px` }}>
          {/* About Me / Profile */}
          {aboutMe.summary && (
            <section>
              <h2
                className="font-bold text-black uppercase tracking-wider border-b border-zinc-300 pb-0.5 mb-1 flex items-center gap-1.5"
                style={{ fontSize: `${11.5 * fontScale}px` }}
              >
                {settings.showIcons && <Icon name="user" size={12} />}
                <span>{labels.profile}</span>
              </h2>
              <p className="text-zinc-850 text-justify leading-snug" style={{ fontSize: `${10.2 * fontScale}px` }}>
                {aboutMe.summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section>
              <h2
                className="font-bold text-black uppercase tracking-wider border-b border-zinc-300 pb-0.5 mb-1.5 flex items-center gap-1.5"
                style={{ fontSize: `${11.5 * fontScale}px` }}
              >
                {settings.showIcons && <Icon name="briefcase" size={12} />}
                <span>{labels.experience}</span>
              </h2>
              <div className="space-y-2" style={{ rowGap: `${7 * spaceScale}px` }}>
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline">
                      <div className="font-bold text-black" style={{ fontSize: `${11 * fontScale}px` }}>
                        {exp.role}
                      </div>
                      <div className="text-zinc-600 font-mono text-[9px] shrink-0 font-medium">
                        {exp.startDate} – {exp.current ? labels.present : exp.endDate}
                      </div>
                    </div>
                    <div className="text-zinc-700 font-medium text-[10px] mb-0.5">
                      {exp.company} {exp.location ? `• ${exp.location}` : ""}
                    </div>

                    {exp.description && (
                      <div className="text-zinc-800 space-y-0.5" style={{ fontSize: `${9.8 * fontScale}px` }}>
                        {exp.description.split("\n").filter(Boolean).map((line, lIdx) => (
                          <div key={lIdx} className="flex items-start gap-1">
                            <span className="text-black font-bold select-none">•</span>
                            <span className="flex-1 leading-snug">{renderFormattedBullet(line)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section>
              <h2
                className="font-bold text-black uppercase tracking-wider border-b border-zinc-300 pb-0.5 mb-1.5 flex items-center gap-1.5"
                style={{ fontSize: `${11.5 * fontScale}px` }}
              >
                {settings.showIcons && <Icon name="projects" size={12} />}
                <span>{labels.featuredProjects}</span>
              </h2>
              <div className="space-y-1.5" style={{ rowGap: `${6 * spaceScale}px` }}>
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex justify-between items-baseline">
                      <div className="font-bold text-black" style={{ fontSize: `${10.5 * fontScale}px` }}>
                        {proj.name} {proj.role && <span className="font-normal text-zinc-600 text-[9.5px]">({proj.role})</span>}
                      </div>
                      {proj.website && (
                        <a
                          href={proj.website.startsWith("http") ? proj.website : `https://${proj.website}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-black font-semibold hover:underline font-mono text-[9px]"
                        >
                          {formatUrl(proj.website)}
                        </a>
                      )}
                    </div>
                    {proj.description && (
                      <p className="text-zinc-800 text-justify mt-0.5 leading-snug" style={{ fontSize: `${9.8 * fontScale}px` }}>
                        {proj.description}
                      </p>
                    )}
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="text-[9px] text-zinc-700 font-mono mt-0.5">
                        <span className="font-bold text-zinc-600">{labels.stack} </span>
                        <span>{proj.technologies.join(", ")}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Column (Right - 5 cols / ~42%) */}
        <div className="col-span-5 border-l border-zinc-200 pl-3 space-y-2.5" style={{ rowGap: `${8 * spaceScale}px`, paddingLeft: `${10 * spaceScale}px` }}>
          {/* Contact Details */}
          <section>
            <h2
              className="font-bold text-black uppercase tracking-wider border-b border-zinc-300 pb-0.5 mb-1 flex items-center gap-1.5"
              style={{ fontSize: `${11 * fontScale}px` }}
            >
              {settings.showIcons && <Icon name="mail" size={11} />}
              <span>{labels.contact}</span>
            </h2>
            <div className="space-y-1 text-zinc-800" style={{ fontSize: `${9.8 * fontScale}px` }}>
              {personalInfo.email && (
                <div className="flex items-center gap-1.5 truncate">
                  {settings.showIcons && <Icon name="mail" size={11} className="text-black shrink-0" />}
                  <a href={`mailto:${personalInfo.email}`} className="hover:underline text-black font-semibold truncate">
                    {personalInfo.email}
                  </a>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-1.5">
                  {settings.showIcons && <Icon name="phone" size={11} className="text-black shrink-0" />}
                  <span className="font-medium text-zinc-900">{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.github && (
                <div className="flex items-center gap-1.5 truncate">
                  {settings.showIcons && <Icon name="github" size={11} className="text-black shrink-0" />}
                  <a
                    href={personalInfo.github.startsWith("http") ? personalInfo.github : `https://${personalInfo.github}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline text-black font-medium truncate"
                  >
                    {formatUrl(personalInfo.github)}
                  </a>
                </div>
              )}
              {personalInfo.linkedin && (
                <div className="flex items-center gap-1.5 truncate">
                  {settings.showIcons && <Icon name="linkedin" size={11} className="text-black shrink-0" />}
                  <a
                    href={personalInfo.linkedin.startsWith("http") ? personalInfo.linkedin : `https://${personalInfo.linkedin}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline text-black font-medium truncate"
                  >
                    {formatUrl(personalInfo.linkedin)}
                  </a>
                </div>
              )}
              {personalInfo.website && (
                <div className="flex items-center gap-1.5 truncate">
                  {settings.showIcons && <Icon name="globe" size={11} className="text-black shrink-0" />}
                  <a
                    href={personalInfo.website.startsWith("http") ? personalInfo.website : `https://${personalInfo.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline text-black font-medium truncate"
                  >
                    {formatUrl(personalInfo.website)}
                  </a>
                </div>
              )}
            </div>
          </section>

          {/* Technical Skills */}
          {skills.length > 0 && (
            <section>
              <h2
                className="font-bold text-black uppercase tracking-wider border-b border-zinc-300 pb-0.5 mb-1 flex items-center gap-1.5"
                style={{ fontSize: `${11 * fontScale}px` }}
              >
                {settings.showIcons && <Icon name="code" size={11} />}
                <span>{labels.skills}</span>
              </h2>
              <div className="space-y-1" style={{ fontSize: `${9.8 * fontScale}px` }}>
                {skills.map((cat) => (
                  <div key={cat.id}>
                    <span className="font-bold text-black block">
                      {cat.category}:
                    </span>
                    <span className="text-zinc-800 text-[9.2px] leading-snug">
                      {cat.skills.join(", ")}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section>
              <h2
                className="font-bold text-black uppercase tracking-wider border-b border-zinc-300 pb-0.5 mb-1 flex items-center gap-1.5"
                style={{ fontSize: `${11 * fontScale}px` }}
              >
                {settings.showIcons && <Icon name="education" size={11} />}
                <span>{labels.education}</span>
              </h2>
              <div className="space-y-1.5">
                {education.map((edu) => (
                  <div key={edu.id} style={{ fontSize: `${9.5 * fontScale}px` }}>
                    <div className="font-bold text-black leading-tight">{edu.degree}</div>
                    <div className="text-zinc-700">{edu.school}</div>
                    <div className="text-zinc-500 font-mono text-[8.5px]">
                      {edu.startDate} – {edu.endDate}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <section>
              <h2
                className="font-bold text-black uppercase tracking-wider border-b border-zinc-300 pb-0.5 mb-1 flex items-center gap-1.5"
                style={{ fontSize: `${11 * fontScale}px` }}
              >
                {settings.showIcons && <Icon name="check" size={11} />}
                <span>{labels.certifications}</span>
              </h2>
              <div className="space-y-1" style={{ fontSize: `${9.5 * fontScale}px` }}>
                {certifications.map((cert) => (
                  <div key={cert.id} className="leading-tight">
                    <span className="font-semibold text-black">{cert.name}</span>
                    <div className="text-zinc-500 text-[8.5px] font-mono">{cert.issuer} {cert.date ? `• ${cert.date}` : ""}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Awards */}
          {awards.length > 0 && (
            <section>
              <h2
                className="font-bold text-black uppercase tracking-wider border-b border-zinc-300 pb-0.5 mb-1 flex items-center gap-1.5"
                style={{ fontSize: `${11 * fontScale}px` }}
              >
                {settings.showIcons && <Icon name="award" size={11} />}
                <span>{labels.awards}</span>
              </h2>
              <div className="space-y-1" style={{ fontSize: `${9.5 * fontScale}px` }}>
                {awards.map((award) => (
                  <div key={award.id} className="leading-tight">
                    <div className="font-semibold text-black">{award.name}</div>
                    <div className="text-zinc-500 text-[8.5px] font-mono">{award.issuer} {award.date ? `• ${award.date}` : ""}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <section>
              <h2
                className="font-bold text-black uppercase tracking-wider border-b border-zinc-300 pb-0.5 mb-1 flex items-center gap-1.5"
                style={{ fontSize: `${11 * fontScale}px` }}
              >
                {settings.showIcons && <Icon name="languages" size={11} />}
                <span>{labels.languages}</span>
              </h2>
              <div className="space-y-0.5" style={{ fontSize: `${9.5 * fontScale}px` }}>
                {languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between">
                    <span className="font-bold text-black">{lang.name}</span>
                    <span className="text-zinc-700">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
