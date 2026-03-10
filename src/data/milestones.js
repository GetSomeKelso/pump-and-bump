const WEEK_FACTS = [
  "🌱 Fertilization & implantation",          // Week 0
  "🌱 Fertilization & implantation",          // Week 1
  "🌱 Fertilization & implantation",          // Week 2
  "💫 Neural tube forming",                    // Week 3
  "❤️ Heart begins beating",                   // Week 4
  "👁️ Eyes & limb buds appear",                // Week 5
  "🧠 Brain developing rapidly",               // Week 6
  "🫀 Four-chambered heart",                   // Week 7
  "🦷 Tiny fingers forming",                   // Week 8
  "🤸 Starts moving!",                         // Week 9
  "👂 Can hear sounds",                        // Week 10
  "🦶 Fingernails growing",                    // Week 11
  "🏋️ Reflexes developing",                    // Week 12
  "😊 Facial expressions",                     // Week 13
  "🎵 Responds to music",                      // Week 14
  "💪 Getting stronger",                       // Week 15
  "🧇 Size of an avocado",                     // Week 16
  "🤚 Fingerprints forming",                   // Week 17
  "👋 Yawning & hiccuping",                    // Week 18
  "🦻 Hearing fully developed",                // Week 19
  "🛌 Sleep-wake cycles",                      // Week 20
  "🍌 Size of a banana",                       // Week 21
  "🏃 Very active!",                           // Week 22
  "🧬 Rapid brain growth",                     // Week 23
  "🫁 Lungs maturing",                         // Week 24
  "👶 Fat layers forming",                     // Week 25
  "🌟 Eyes can open",                          // Week 26
  "🎯 Third trimester begins!",                // Week 27
  "📏 14 inches long",                         // Week 28
  "😴 REM sleep begins",                       // Week 29
  "🦴 Bones hardening",                        // Week 30
  "🏆 Almost there!",                          // Week 31
  "🤗 Settling into position",                 // Week 32
  "🌈 Immune system ready",                    // Week 33
  "🎁 Almost fully formed",                    // Week 34
  "⭐ Final sprint!",                          // Week 35
  "🍉 Full term soon",                         // Week 36
  "🚀 Full term!",                             // Week 37
  "🎊 Ready any day!",                         // Week 38
  "🌺 Any moment now!",                        // Week 39
  "👑 Your baby is here!",                     // Week 40
];

export function getMilestone(daysOld) {
  const week = Math.floor(daysOld / 7);
  const idx = Math.min(week, WEEK_FACTS.length - 1);
  return WEEK_FACTS[idx];
}
