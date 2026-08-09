// Populates the database with departments and sample doctors so the API
// returns real data immediately. Run with: npm run seed
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Department = require("../models/Department");
const Doctor = require("../models/Doctor");

const departments = [
  { name: "Cardiology", slug: "cardiology", description: "Heart & vascular care", icon: "Heart" },
  { name: "Neurology", slug: "neurology", description: "Brain & nervous system", icon: "Brain" },
  { name: "Orthopedics", slug: "orthopedics", description: "Bones & joints", icon: "Bone" },
  { name: "General Medicine", slug: "general", description: "Primary & family care", icon: "Stethoscope" },
  { name: "ENT", slug: "ent", description: "Ear, nose & throat", icon: "Activity" },
  { name: "Gynecology", slug: "gynecology", description: "Women's health", icon: "Users" },
  { name: "Pediatrics", slug: "pediatrics", description: "Child healthcare", icon: "Baby" },
  { name: "Dermatology", slug: "dermatology", description: "Skin & hair care", icon: "Sparkles" },
];

async function seed() {
  await connectDB();

  await Department.deleteMany({});
  await Doctor.deleteMany({});

  const createdDepts = await Department.insertMany(departments);
  const bySlug = Object.fromEntries(createdDepts.map((d) => [d.slug, d._id]));

  const doctors = [
    { name: "Dr. Aanya Sharma", qualification: "MD, DM Cardiology", department: bySlug.cardiology, experienceYears: 14, availableDays: ["Mon", "Wed", "Fri"], consultationStart: "09:00", consultationEnd: "13:00", languages: ["English", "Hindi"], photoInitials: "AS" },
    { name: "Dr. Rohan Verma", qualification: "MBBS, MD Cardiology", department: bySlug.cardiology, experienceYears: 9, availableDays: ["Tue", "Thu", "Sat"], consultationStart: "14:00", consultationEnd: "18:00", languages: ["English", "Hindi"], photoInitials: "RV" },
    { name: "Dr. Meera Iyer", qualification: "MD, DM Neurology", department: bySlug.neurology, experienceYears: 17, availableDays: ["Mon", "Tue", "Thu"], consultationStart: "10:00", consultationEnd: "14:00", languages: ["English", "Tamil"], photoInitials: "MI" },
    { name: "Dr. Karan Malhotra", qualification: "MS Ortho", department: bySlug.orthopedics, experienceYears: 12, availableDays: ["Mon", "Wed", "Sat"], consultationStart: "09:00", consultationEnd: "12:00", languages: ["English", "Punjabi"], photoInitials: "KM" },
    { name: "Dr. Priya Nair", qualification: "MBBS, MD", department: bySlug.general, experienceYears: 8, availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri"], consultationStart: "08:00", consultationEnd: "11:00", languages: ["English", "Malayalam"], photoInitials: "PN" },
    { name: "Dr. Sameer Khan", qualification: "MS ENT", department: bySlug.ent, experienceYears: 11, availableDays: ["Tue", "Thu", "Sat"], consultationStart: "11:00", consultationEnd: "15:00", languages: ["English", "Urdu"], photoInitials: "SK" },
    { name: "Dr. Divya Menon", qualification: "MD OBG", department: bySlug.gynecology, experienceYears: 15, availableDays: ["Mon", "Wed", "Fri"], consultationStart: "10:00", consultationEnd: "13:00", languages: ["English", "Hindi"], photoInitials: "DM" },
    { name: "Dr. Arjun Rao", qualification: "MD Pediatrics", department: bySlug.pediatrics, experienceYears: 10, availableDays: ["Mon", "Tue", "Thu", "Sat"], consultationStart: "16:00", consultationEnd: "19:00", languages: ["English", "Telugu"], photoInitials: "AR" },
  ];

  await Doctor.insertMany(doctors);

  console.log(`Seeded ${createdDepts.length} departments and ${doctors.length} doctors.`);
  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
