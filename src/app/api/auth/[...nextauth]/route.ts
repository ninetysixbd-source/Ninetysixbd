import { handlers } from "@/auth"
// Since auth.ts is in root/auth.ts (or src/auth.ts if src-dir is used), let's check placement.
// Assuming auth.ts is in src/auth.ts or root. I placed it in D:\96BD\store\auth.ts which is root relative to project, but since we used src-dir, it might be cleaner in src/lib or just src. 
// I'll place it in src/auth.ts for better import. I'll move it in the next step or just import correctly.
// Let's assume I write it to D:\96BD\store\src\auth.ts instead to match the src directory structure.
// Wait, I wrote it to D:\96BD\store\auth.ts.
// Next.js with src dir usually likes src/auth.ts. 
// I'll re-write auth.ts to src/auth.ts and then this file.
export const { GET, POST } = handlers
