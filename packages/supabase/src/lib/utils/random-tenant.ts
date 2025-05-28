export function generateTenantName(): string {
    const adjectives = ["quick", "bright", "bold", "smart", "swift", "clever", "brave", "lucky"];
    const nouns = ["falcon", "lion", "panda", "tiger", "eagle", "whale", "hawk", "wolf"];
  
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4-digit number
  
    return `${randomAdj}-${randomNoun}-${randomNumber}`;
  }
  