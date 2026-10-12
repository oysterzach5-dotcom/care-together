export const AREAS = ["Colombo", "Kandy", "Galle", "Negombo", "Jaffna"];

export const TASKS = [
  "Personal care",
  "Medication reminders",
  "Companionship",
  "Meal preparation",
  "Mobility assistance",
  "Post-surgery care",
  "Physiotherapy support",
  "Palliative care",
  "Errands & transport",
  "Light housekeeping",
  "Vitals monitoring",
  "Wound care",
  "Overnight care",
];

export const PATIENT_TYPES = [
  "General elderly care",
  "Dementia / Alzheimer's",
  "Post-surgery recovery",
  "Mobility impaired",
  "Palliative / end-of-life",
  "Bedridden",
  "Diabetes",
  "Heart conditions",
  "Stroke recovery",
  "Parkinson's",
];

export function photoUrl(seed: string) {
  return `https://randomuser.me/api/portraits/${seed}.jpg`;
}

export function formatLKR(n: number) {
  return `Rs. ${Math.round(n).toLocaleString("en-US")}`;
}

/** Estimated total cost of a booking. */
export function estimateTotal(hourlyRate: number, hoursPerDay: number, days: number) {
  return hourlyRate * hoursPerDay * days;
}
