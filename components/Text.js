"use client";
import { useLanguage } from "./LanguageProvider";

export default function Text({ en, bn, as: Tag = "span", className, style, html }) {
  const { lang } = useLanguage();
  const content = lang === "en" ? en : bn;
  const isHtml = html || (typeof content === "string" && content.includes("<"));

  if (isHtml) {
    return <Tag className={className} style={style} dangerouslySetInnerHTML={{ __html: content }} />;
  }

  return <Tag className={className} style={style}>{content}</Tag>;
}
