// Client-safe role definitions shared by the dashboard UI and the server checks.

export const roles = {
  admin: {
    label: "Administrateur",
    description: "Accès complet : articles, demandes de rendez-vous et gestion des utilisateurs.",
  },
  editor: {
    label: "Rédacteur",
    description: "Rédige, publie et modifie les articles.",
  },
  assistant: {
    label: "Secrétariat",
    description: "Consulte et traite les demandes de rendez-vous.",
  },
} as const;

export type Role = keyof typeof roles;

export const access = {
  posts: ["admin", "editor"],
  requests: ["admin", "assistant"],
  users: ["admin"],
} as const satisfies Record<string, readonly Role[]>;

export type Area = keyof typeof access;

export function can(role: Role, area: Area) {
  return (access[area] as readonly Role[]).includes(role);
}
