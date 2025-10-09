import { useEffect, useMemo, useState } from "react";
import { getOrCreateClientId, trackAbAssignment } from "@/lib/analytics";

export interface ABVariant {
  id: string;
  title: string;
  description: string;
}

const STORAGE_KEY = "be_ab_assignments";

type StoredAssignments = Record<string, string>;

const readAssignments = (): StoredAssignments => {
  if (typeof window === "undefined") return {};
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as StoredAssignments) : {};
  } catch (error) {
    console.warn("Failed to read AB assignments", error);
    return {};
  }
};

const writeAssignments = (assignments: StoredAssignments) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
  } catch (error) {
    console.warn("Failed to persist AB assignments", error);
  }
};

const chooseVariant = (testName: string, variants: ABVariant[]) => {
  if (typeof window === "undefined" || variants.length === 0) {
    return variants[0];
  }

  const assignments = readAssignments();
  const existing = assignments[testName];
  if (existing) {
    const matched = variants.find((variant) => variant.id === existing);
    if (matched) return matched;
  }

  const clientId = getOrCreateClientId();
  const seed = clientId ? hashString(`${testName}:${clientId}`) : Math.random();
  const index = Math.floor(seed * variants.length) % variants.length;
  const selected = variants[index];
  assignments[testName] = selected.id;
  writeAssignments(assignments);
  return selected;
};

const hashString = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) / 0xffffffff;
};

export const useABVariant = (testName: string, variants: ABVariant[]) => {
  const safeVariants = useMemo(() => {
    return variants.length > 0 ? variants : [{ id: "default", title: "", description: "" }];
  }, [variants]);

  const [selected, setSelected] = useState(() => chooseVariant(testName, safeVariants));

  useEffect(() => {
    setSelected(chooseVariant(testName, safeVariants));
  }, [testName, safeVariants]);

  useEffect(() => {
    if (!selected) return;
    trackAbAssignment(testName, selected.id);
  }, [selected, testName]);

  return useMemo(() => selected ?? safeVariants[0], [selected, safeVariants]);
};
