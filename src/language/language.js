import { ru } from "./ru";
import { uz } from "./uz";

const words = {
  uz: uz,
  ru: ru,
};
const currentLang = localStorage.getItem("lang");
const currentLangContent = words?.[currentLang] || uz;

function FormatMessage({ id }) {
  return <>{currentLangContent?.[id] || ""}</>;
}

export function formatMessage(id) {
  return currentLangContent?.[id] || "";
}

export default FormatMessage;
