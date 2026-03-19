
import {  collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "./src/firebase-config.js";
// https://drive.google.com/file/d/1Rb6v61N5wsXnccMUjhsQa_GNgBHJX-ub/view?usp=sharing
// https://drive.google.com/file/d/1Bx9pX1vXF5fCGMY3GCIPmEf0CQ_VtEF2/view?usp=sharing
// ── Les 5 vidéos — remplis name et relation ───────────────────────────────────
const VIDEOS = [
  // {
  //   driveId:  "1Q4qOWp93mhRvRiNRDEmuuItK5d1a09gH",
  //   name:     "Micheal & Jael",       // ← à remplacer
  //   relation: "",         // ← à remplacer
  //   message:  "",
  // },
  // {
  //   driveId:  "13rlxMTHUi7blDpMLy3HGeWhORiZLRpVK",
  //   name:     "Nom",
  //   relation: "",
  //   message:  "",
  // },
  // {
  //   driveId:  "1W7y3e3i7Ig4_cGfjs65XVnf9YKImWPdH",
  //   name:     "Nom",
  //   relation: "",
  //   message:  "",
  // },
  // {
  //   driveId:  "1dutp5rT_m0jKMvHOU-19RheaCTAnJmGX",
  //   name:     "Nom 4",
  //   relation: "",
  //   message:  "",
  // },
  // {
  //   driveId:  "1LV_496Wr02FmgF4HBJnt38kI91JWMqHg",
  //   name:     "Polo",
  //   relation: "",
  //   message:  "",
  // },
  {
    driveId:  "1Rb6v61N5wsXnccMUjhsQa_GNgBHJX-ub",
    name:     "",
    relation: "",
    message:  "",
  },
   {
    driveId:  "1Bx9pX1vXF5fCGMY3GCIPmEf0CQ_VtEF2",
    name:     "",
    relation: "",
    message:  "",
  }
];

async function seed() {
  console.log("Démarrage du seed...\n");

  for (const v of VIDEOS) {
    try {
      const doc = await addDoc(collection(db, "voeux"), {
        type:      "video_drive",
        videoType: "drive",
        driveId:   v.driveId,
        name:      v.name,
        relation:  v.relation,
        message:   v.message,
        timestamp: Timestamp.now(),
      });
      console.log(`✓ ${v.name} → doc ID: ${doc.id}`);
    } catch (err) {
      console.error(`✗ Erreur pour ${v.name}:`, err.message);
    }
  }

  console.log("\nSeed terminé !");
  process.exit(0);
}

seed();