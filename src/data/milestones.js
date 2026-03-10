const milestones = [
  "A tiny cluster of cells is forming",        // Week 0
  "The embryo implants in the uterine wall",    // Week 1
  "The neural tube is beginning to form",       // Week 2
  "Tiny buds that become arms and legs appear",  // Week 3
  "Heart begins beating",                        // Week 4
  "Eyes, ears, and mouth start forming",         // Week 5
  "Brain waves can be detected",                 // Week 6
  "Fingers and toes are forming",                // Week 7
  "All major organs are in place",               // Week 8
  "Baby can make tiny movements",                // Week 9
  "Fingernails and hair start growing",          // Week 10
  "Baby can open and close their fists",         // Week 11
  "Reflexes are developing",                     // Week 12
  "Vocal cords are forming",                     // Week 13
  "Baby can squint and frown",                   // Week 14
  "Baby can sense light",                        // Week 15
  "Baby's hearing is developing",                // Week 16
  "Fat is beginning to form",                    // Week 17
  "Baby is the size of a bell pepper",           // Week 18
  "A protective coating covers the skin",        // Week 19
  "Sleep-wake cycles are forming",               // Week 20
  "Baby can swallow",                            // Week 21
  "Eyebrows and eyelids are visible",            // Week 22
  "Baby responds to sounds",                     // Week 23
  "Lungs are developing rapidly",                // Week 24
  "Baby can respond to your voice",              // Week 25
  "Eyes begin to open",                          // Week 26
  "Third trimester begins!",                     // Week 27
  "Baby can dream (REM sleep detected)",         // Week 28
  "Baby is getting stronger every day",          // Week 29
  "Brain is growing rapidly",                    // Week 30
  "Baby can turn their head",                    // Week 31
  "Toenails have formed",                        // Week 32
  "Bones are hardening",                         // Week 33
  "Baby's immune system is maturing",            // Week 34
  "Baby is almost fully developed",              // Week 35
  "Baby is gaining weight steadily",             // Week 36
  "Baby is considered early term",               // Week 37
  "Baby is ready for the outside world",         // Week 38
  "Full term! Any day now",                      // Week 39
  "Your baby is here!",                          // Week 40
];

const milestoneEmojis = [
  "\u2728", "\u2728", "\u{1F9E0}", "\u{1F331}", "\u2764\uFE0F",
  "\u{1F440}", "\u{1F9E0}", "\u{1F44B}", "\u{1F3D7}\uFE0F", "\u{1F3C3}",
  "\u{1F485}", "\u270A", "\u{1F938}", "\u{1F399}\uFE0F", "\u{1F60A}",
  "\u{1F31E}", "\u{1F442}", "\u{1F37C}", "\u{1FAD1}", "\u{1F6E1}\uFE0F",
  "\u{1F6CC}", "\u{1F4A7}", "\u{1F441}\uFE0F", "\u{1F50A}", "\u{1FAB7}",
  "\u{1F5E3}\uFE0F", "\u{1F440}", "\u{1F3AF}", "\u{1F4AD}", "\u{1F4AA}",
  "\u{1F9E0}", "\u{1F504}", "\u{1F9B6}", "\u{1F9B4}", "\u{1F6E1}\uFE0F",
  "\u{1F476}", "\u{1F4C8}", "\u{1F7E2}", "\u{1F30D}", "\u{1F31F}", "\u{1F451}",
];

export function getMilestone(daysOld) {
  const week = Math.floor(daysOld / 7);
  const idx = Math.min(week, milestones.length - 1);
  return `${milestoneEmojis[idx]} ${milestones[idx]}`;
}
