import React from "react";
import { Svg, Path, Rect, Circle } from "@react-pdf/renderer";

export interface PdfIconProps {
  name:
    | "user"
    | "briefcase"
    | "projects"
    | "code"
    | "education"
    | "check"
    | "award"
    | "languages"
    | "mail"
    | "phone"
    | "map-pin"
    | "globe"
    | "github"
    | "linkedin";
  size?: number;
  color?: string;
}

export const PdfIcon: React.FC<PdfIconProps> = ({
  name,
  size = 8.5,
  color = "#000000",
}) => {
  switch (name) {
    case "user":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path
            d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
          <Circle cx={12} cy={7} r={4} stroke={color} strokeWidth="2" fill="none" />
        </Svg>
      );
    case "briefcase":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Rect
            x={2}
            y={7}
            width={20}
            height={14}
            rx={2}
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
          <Path
            d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
        </Svg>
      );
    case "projects":
      // Exact Lucide FolderGit2
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path
            d="M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v1"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
          <Path d="M12 10v4" stroke={color} strokeWidth="2" fill="none" />
          <Circle cx={12} cy={18} r={2} stroke={color} strokeWidth="2" fill="none" />
          <Path d="m14 13.5 3-2.5" stroke={color} strokeWidth="2" fill="none" />
          <Circle cx={18} cy={11} r={2} stroke={color} strokeWidth="2" fill="none" />
        </Svg>
      );
    case "code":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path
            d="m18 16 4-4-4-4M6 8l-4 4 4 4M14.5 4l-5 16"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
        </Svg>
      );
    case "education":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path
            d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
          <Path
            d="M22 10v6M6 12.5V16a6 3 0 0 0 12 0v-3.5"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
        </Svg>
      );
    case "check":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path
            d="M20 6 9 17l-5-5"
            stroke={color}
            strokeWidth="2.5"
            fill="none"
          />
        </Svg>
      );
    case "award":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={12} cy={8} r={6} stroke={color} strokeWidth="2" fill="none" />
          <Path
            d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
        </Svg>
      );
    case "languages":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path
            d="m5 8 6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
        </Svg>
      );
    case "mail":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Rect
            x={2}
            y={4}
            width={20}
            height={16}
            rx={2}
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
          <Path
            d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
        </Svg>
      );
    case "phone":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path
            d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
        </Svg>
      );
    case "map-pin":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path
            d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
          <Circle cx={12} cy={10} r={3} stroke={color} strokeWidth="2" fill="none" />
        </Svg>
      );
    case "globe":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth="2" fill="none" />
          <Path
            d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
        </Svg>
      );
    case "github":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path
            d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
          <Path d="M9 18c-4.51 2-5-2-7-2" stroke={color} strokeWidth="2" fill="none" />
        </Svg>
      );
    case "linkedin":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path
            d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
          <Rect x={2} y={9} width={4} height={12} stroke={color} strokeWidth="2" fill="none" />
          <Circle cx={4} cy={4} r={2} stroke={color} strokeWidth="2" fill="none" />
        </Svg>
      );
    default:
      return null;
  }
};
