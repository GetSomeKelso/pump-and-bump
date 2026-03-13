const WEEK_FACTS = [
  "🩸 Last menstrual period",                    // Week 0 (gestational)
  "🌸 Uterine lining preparing",                 // Week 1
  "🌱 Ovulation & fertilization",                // Week 2
  "🌱 Fertilization & implantation",             // Week 3
  "💫 Implantation complete",                     // Week 4
  "💫 Neural tube forming",                       // Week 5
  "❤️ Heart begins beating",                      // Week 6
  "👁️ Eyes & limb buds appear",                   // Week 7
  "🧠 Brain developing rapidly",                  // Week 8
  "🫀 Four-chambered heart",                      // Week 9
  "🦷 Tiny fingers forming",                      // Week 10
  "🤸 Starts moving!",                            // Week 11
  "👂 Can hear sounds",                           // Week 12
  "🦶 Fingernails growing",                       // Week 13
  "🏋️ Reflexes developing",                       // Week 14
  "😊 Facial expressions",                        // Week 15
  "🎵 Responds to music",                         // Week 16
  "💪 Getting stronger",                          // Week 17
  "🧇 Size of an avocado",                        // Week 18
  "🤚 Fingerprints forming",                      // Week 19
  "👋 Yawning & hiccuping",                       // Week 20
  "🦻 Hearing fully developed",                   // Week 21
  "🛌 Sleep-wake cycles",                         // Week 22
  "🍌 Size of a banana",                          // Week 23
  "🏃 Very active!",                              // Week 24
  "🧬 Rapid brain growth",                        // Week 25
  "🫁 Lungs maturing",                            // Week 26
  "👶 Fat layers forming",                        // Week 27
  "🌟 Eyes can open",                             // Week 28
  "🎯 Third trimester begins!",                   // Week 29
  "📏 14 inches long",                            // Week 30
  "😴 REM sleep begins",                          // Week 31
  "🦴 Bones hardening",                           // Week 32
  "🏆 Almost there!",                             // Week 33
  "🤗 Settling into position",                    // Week 34
  "🌈 Immune system ready",                       // Week 35
  "🎁 Almost fully formed",                       // Week 36
  "⭐ Final sprint!",                             // Week 37
  "🍉 Full term soon",                            // Week 38
  "🚀 Full term!",                                // Week 39
  "🎊 Ready any day!",                            // Week 40
  "🌺 Any moment now!",                           // Week 41
  "👑 Your baby is here!",                        // Week 42
];

export function getMilestone(daysOld) {
  const week = Math.floor(daysOld / 7);
  const idx = Math.min(week, WEEK_FACTS.length - 1);
  return WEEK_FACTS[idx];
}
