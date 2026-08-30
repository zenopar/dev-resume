import React from "react";
import { ResumeData } from "../../resume/types";
import { getResumeLabels } from "../../resume/translations";

export interface TemplateProps {
  data: ResumeData;
}

export const TechnicalMinimalTemplate: React.FC<TemplateProps> = ({ data }) => {
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
      className="w-full h-full bg-white text-black font-sans leading-relaxed selection:bg-zinc-200"
      style={{
        fontSize: `${11 * fontScale}px`,
        lineHeight: 1.38,
      }}
    >
      {/* Centered LaTeX Style Header */}
      <header
        className="text-center pb-2 mb-2 border-b border-black"
        style={{
          paddingBottom: `${8 * spaceScale}px`,
          marginBottom: `${10 * spaceScale}px`,
        }}
      >
        <h1
          className="font-bold tracking-normal text-black uppercase"
          style={{ fontSize: `${25 * fontScale}px`, letterSpacing: "0.04em" }}
        >
          {personalInfo.firstName || "Firstname"}{" "}
          {personalInfo.lastName || "Lastname"}
        </h1>
        {personalInfo.title && (
          <p
            className="font-semibold text-zinc-900 tracking-wide mt-0.5"
            style={{ fontSize: `${12.5 * fontScale}px` }}
          >
            {personalInfo.title}
          </p>
        )}

        {/* Delimited Contact Info */}
        <div
          className="flex flex-wrap justify-center items-center gap-x-2.5 gap-y-0.5 mt-1 text-zinc-800 font-normal"
          style={{ fontSize: `${10 * fontScale}px` }}
        >
          {personalInfo.city && <span className="font-medium">{personalInfo.city}</span>}
          {personalInfo.email && (
            <>
              {personalInfo.city && <span className="text-zinc-400">•</span>}
              <a href={`mailto:${personalInfo.email}`} className="hover:underline text-black font-semibold">
                {personalInfo.email}
              </a>
            </>
          )}
          {personalInfo.phone && (
            <>
              <span className="text-zinc-400">•</span>
              <span>{personalInfo.phone}</span>
            </>
          )}
          {personalInfo.website && (
            <>
              <span className="text-zinc-400">•</span>
              <a
                href={personalInfo.website.startsWith("http") ? personalInfo.website : `https://${personalInfo.website}`}
                target="_blank"
                rel="noreferrer"
                className="hover:underline text-black font-semibold"
              >
                {formatUrl(personalInfo.website)}
              </a>
            </>
          )}
          {personalInfo.github && (
            <>
              <span className="text-zinc-400">•</span>
              <a
                href={personalInfo.github.startsWith("http") ? personalInfo.github : `https://${personalInfo.github}`}
                target="_blank"
                rel="noreferrer"
                className="hover:underline text-black font-semibold"
              >
                {formatUrl(personalInfo.github)}
              </a>
            </>
          )}
          {personalInfo.linkedin && (
            <>
              <span className="text-zinc-400">•</span>
              <a
                href={personalInfo.linkedin.startsWith("http") ? personalInfo.linkedin : `https://${personalInfo.linkedin}`}
                target="_blank"
                rel="noreferrer"
                className="hover:underline text-black font-semibold"
              >
                {formatUrl(personalInfo.linkedin)}
              </a>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="space-y-2.5" style={{ rowGap: `${8 * spaceScale}px` }}>
        {/* About Me / Summary */}
        {aboutMe.summary && (
          <section>
            <h2
              className="font-bold text-black uppercase tracking-widest border-b border-black pb-0.5 mb-1"
              style={{ fontSize: `${11 * fontScale}px` }}
            >
              {labels.summary}
            </h2>
            <p className="text-zinc-850 text-justify leading-snug" style={{ fontSize: `${10.2 * fontScale}px` }}>
              {aboutMe.summary}
            </p>
          </section>
        )}

        {/* Technical Skills */}
        {skills.length > 0 && (
          <section>
            <h2
              className="font-bold text-black uppercase tracking-widest border-b border-black pb-0.5 mb-1"
              style={{ fontSize: `${11 * fontScale}px` }}
            >
              {labels.skills}
            </h2>
            <div className="space-y-1" style={{ fontSize: `${10.2 * fontScale}px` }}>
              {skills.map((cat) => (
                <div key={cat.id} className="flex items-baseline gap-2">
                  <span className="font-bold text-black min-w-[130px] shrink-0">
                    {cat.category}:
                  </span>
                  <span className="text-zinc-850 leading-snug">
                    {cat.skills.join(", ")}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section>
            <h2
              className="font-bold text-black uppercase tracking-widest border-b border-black pb-0.5 mb-1"
              style={{ fontSize: `${11 * fontScale}px` }}
            >
              {labels.experience}
            </h2>
            <div className="space-y-2" style={{ rowGap: `${6 * spaceScale}px` }}>
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <div className="font-bold text-black" style={{ fontSize: `${11 * fontScale}px` }}>
                      {exp.role} <span className="font-semibold text-zinc-800">— {exp.company}</span>
                    </div>
                    <div className="text-zinc-600 font-mono text-[9.5px] shrink-0 font-medium">
                      {exp.startDate} – {exp.current ? labels.present : exp.endDate} {exp.location ? `| ${exp.location}` : ""}
                    </div>
                  </div>

                  {exp.description && (
                    <div className="text-zinc-800 mt-0.5 space-y-0.5" style={{ fontSize: `${10 * fontScale}px` }}>
                      {exp.description.split("\n").filter(Boolean).map((line, lIdx) => (
                        <div key={lIdx} className="flex items-start gap-1.5">
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
              className="font-bold text-black uppercase tracking-widest border-b border-black pb-0.5 mb-1"
              style={{ fontSize: `${11 * fontScale}px` }}
            >
              {labels.projects}
            </h2>
            <div className="space-y-1.5" style={{ rowGap: `${6 * spaceScale}px` }}>
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline">
                    <div className="font-bold text-black" style={{ fontSize: `${10.8 * fontScale}px` }}>
                      <span>{proj.name}</span> {proj.role && <span className="font-normal text-zinc-600 text-[10px]">({proj.role})</span>}
                    </div>
                    {proj.website && (
                      <a
                        href={proj.website.startsWith("http") ? proj.website : `https://${proj.website}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-black font-semibold hover:underline font-mono text-[9.5px]"
                      >
                        {formatUrl(proj.website)}
                      </a>
                    )}
                  </div>
                  {proj.description && (
                    <p className="text-zinc-800 text-justify mt-0.5 leading-snug" style={{ fontSize: `${10 * fontScale}px` }}>
                      {proj.description}
                    </p>
                  )}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="text-[9.2px] text-zinc-700 font-mono mt-0.5">
                      <span className="font-bold text-zinc-600">{labels.keywords} </span>
                      <span>{proj.technologies.join(", ")}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education & Certifications in 2 Columns */}
        <div className="grid grid-cols-2 gap-4 pt-1" style={{ gap: `${12 * spaceScale}px` }}>
          <div>
            {education.length > 0 && (
              <section>
                <h2
                  className="font-bold text-black uppercase tracking-widest border-b border-black pb-0.5 mb-1"
                  style={{ fontSize: `${10.5 * fontScale}px` }}
                >
                  {labels.education}
                </h2>
                {education.map((edu) => (
                  <div key={edu.id} className="mb-1" style={{ fontSize: `${10 * fontScale}px` }}>
                    <div className="flex justify-between items-baseline font-bold text-black">
                      <span>{edu.degree}</span>
                      <span className="font-mono text-[9px] font-normal text-zinc-600">{edu.startDate} – {edu.endDate}</span>
                    </div>
                    <div className="text-zinc-800">{edu.school}</div>
                    {edu.details && <div className="text-zinc-600 italic text-[9px]">{edu.details}</div>}
                  </div>
                ))}
              </section>
            )}

            {languages.length > 0 && (
              <section className="mt-2">
                <h2
                  className="font-bold text-black uppercase tracking-widest border-b border-black pb-0.5 mb-0.5"
                  style={{ fontSize: `${10.5 * fontScale}px` }}
                >
                  {labels.languages}
                </h2>
                <div className="flex flex-wrap gap-x-3 text-[9.5px]" style={{ fontSize: `${9.5 * fontScale}px` }}>
                  {languages.map((lang) => (
                    <span key={lang.id} className="text-zinc-800">
                      <strong>{lang.name}</strong> ({lang.proficiency})
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div>
            {certifications.length > 0 && (
              <section>
                <h2
                  className="font-bold text-black uppercase tracking-widest border-b border-black pb-0.5 mb-1"
                  style={{ fontSize: `${10.5 * fontScale}px` }}
                >
                  {labels.certifications}
                </h2>
                <div className="space-y-0.5" style={{ fontSize: `${9.8 * fontScale}px` }}>
                  {certifications.map((cert) => (
                    <div key={cert.id} className="flex justify-between items-baseline">
                      <span className="font-semibold text-zinc-900">{cert.name}</span>
                      {cert.date && <span className="font-mono text-[9px] text-zinc-600 shrink-0">{cert.date}</span>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {awards.length > 0 && (
              <section className="mt-2">
                <h2
                  className="font-bold text-black uppercase tracking-widest border-b border-black pb-0.5 mb-1"
                  style={{ fontSize: `${10.5 * fontScale}px` }}
                >
                  {labels.awards}
                </h2>
                <div className="space-y-0.5" style={{ fontSize: `${9.8 * fontScale}px` }}>
                  {awards.map((award) => (
                    <div key={award.id} className="flex justify-between items-baseline">
                      <span className="font-semibold text-zinc-900">{award.name}</span>
                      {award.date && <span className="font-mono text-[9px] text-zinc-600 shrink-0">{award.date}</span>}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
