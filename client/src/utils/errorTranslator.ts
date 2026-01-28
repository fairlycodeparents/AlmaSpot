const errorMap: Record<string, string> = {
  "User already exists": "Esiste già un account con questa email.",
  "Invalid credentials": "Email o password non corretti.",
  "User not found": "Utente non trovato.",

  "Email is required": "L'email è obbligatoria.",
  "Invalid email format": "Il formato dell'email non è valido.",
  "Password is required": "La password è obbligatoria.",

  "Email must be a unibo.it address":
    "Devi utilizzare la mail istituzionale (@unibo.it).",
  "Password must be at least 8 characters long":
    "La password deve essere di almeno 8 caratteri.",
  "Password too long": "La password è troppo lunga.",
  "Password must contain at least one number":
    "La password deve contenere almeno un numero.",
};

export function translateError(backendMessage: string): string | undefined {
  const cleanMessage = backendMessage.replace("Error: ", "").trim();

  if (errorMap[cleanMessage]) {
    return errorMap[cleanMessage];
  }

  return cleanMessage || "Si è verificato un errore.";
}
