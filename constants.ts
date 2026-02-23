
import { TenseData, Question } from './types';

export const ROBOT_MASCOT_URL = "https://i.ibb.co/LhbV4Vp/bunny-mascot.png";

export const TENSES: TenseData[] = [
  { id: 'present-simple', name: 'Present Simple', description: 'ความจริงทั่วไป, กิจวัตรประจำวัน.', signalWords: ['Always', 'Usually', 'Every day'], formula: { subject: 'S', verb: 'V.1 (s/es)', note: 'เติม s/es เมื่อประธานเป็นเอกพจน์' }, usages: ['General Truth', 'Habit'], examples: [{ text: "She drinks milk.", verb: "drinks", category: "Habit" }] },
  { id: 'present-continuous', name: 'Present Continuous', description: 'กำลังทำอยู่ในขณะนี้.', signalWords: ['Now', 'At the moment'], formula: { subject: 'S', verb: 'is/am/are + V.ing', note: 'ใช้ am กับ I' }, usages: ['Action now'], examples: [{ text: "I am baking.", verb: "am baking", category: "Now" }] },
  { id: 'present-perfect', name: 'Present Perfect', description: 'เพิ่งจบลง หรือประสบการณ์.', signalWords: ['Already', 'Yet', 'Ever'], formula: { subject: 'S', verb: 'has/have + V.3', note: 'Has (เอกพจน์), Have (พหูพจน์)' }, usages: ['Finished action', 'Experience'], examples: [{ text: "I have eaten.", verb: "have eaten", category: "Done" }] },
  { id: 'present-perfect-continuous', name: 'Present Perfect Continuous', description: 'ทำมาต่อเนื่องจนถึงตอนนี้.', signalWords: ['Since', 'For'], formula: { subject: 'S', verb: 'has/have + been + V.ing', note: 'เน้นความยาวนาน' }, usages: ['Duration'], examples: [{ text: "It has been raining.", verb: "has been raining", category: "Duration" }] },
  { id: 'past-simple', name: 'Past Simple', description: 'เหตุการณ์ที่จบไปแล้วในอดีต.', signalWords: ['Yesterday', 'Last night'], formula: { subject: 'S', verb: 'V.2', note: 'รูปอดีตของกริยา' }, usages: ['Past event'], examples: [{ text: "I went home.", verb: "went", category: "Past" }] },
  { id: 'past-continuous', name: 'Past Continuous', description: 'กำลังทำอยู่ในจุดหนึ่งในอดีต.', signalWords: ['While', 'As'], formula: { subject: 'S', verb: 'was/were + V.ing', note: 'Was (เอกพจน์), Were (พหูพจน์)' }, usages: ['Ongoing past action'], examples: [{ text: "I was sleeping.", verb: "was sleeping", category: "Continuous past" }] },
  { id: 'past-perfect', name: 'Past Perfect', description: 'เกิดและจบก่อนอีกเหตุการณ์ในอดีต.', signalWords: ['Before', 'After'], formula: { subject: 'S', verb: 'had + V.3', note: 'ใช้ Had กับทุกประธาน' }, usages: ['Earlier past event'], examples: [{ text: "I had left.", verb: "had left", category: "Sequence" }] },
  { id: 'past-perfect-continuous', name: 'Past Perfect Continuous', description: 'ทำต่อเนื่องก่อนอีกเหตุการณ์ในอดีต.', signalWords: ['For', 'Before'], formula: { subject: 'S', verb: 'had + been + V.ing', note: 'เน้นความต่อเนื่องในอดีต' }, usages: ['Past duration'], examples: [{ text: "I had been waiting.", verb: "had been waiting", category: "Duration" }] },
  { id: 'future-simple', name: 'Future Simple', description: 'สิ่งที่จะเกิดขึ้นในอนาคต.', signalWords: ['Tomorrow', 'Next week'], formula: { subject: 'S', verb: 'will + V.inf', note: 'V.inf ไม่ผัน' }, usages: ['Future plan'], examples: [{ text: "I will go.", verb: "will go", category: "Future" }] },
  { id: 'future-continuous', name: 'Future Continuous', description: 'กำลังทำอยู่ในจุดหนึ่งในอนาคต.', signalWords: ['At this time tomorrow'], formula: { subject: 'S', verb: 'will + be + V.ing', note: 'เน้นการกระทำในอนาคต' }, usages: ['Ongoing future action'], examples: [{ text: "I will be working.", verb: "will be working", category: "Future continuous" }] },
  { id: 'future-perfect', name: 'Future Perfect', description: 'จะเสร็จสมบูรณ์ในอนาคต.', signalWords: ['By the time', 'By next month'], formula: { subject: 'S', verb: 'will + have + V.3', note: 'เน้นการทำเสร็จ' }, usages: ['Future completion'], examples: [{ text: "I will have finished.", verb: "will have finished", category: "Completion" }] },
  { id: 'future-perfect-continuous', name: 'Future Perfect Continuous', description: 'จะทำต่อเนื่องไปจนถึงจุดหนึ่งในอนาคต.', signalWords: ['For', 'By next year'], formula: { subject: 'S', verb: 'will + have + been + V.ing', note: 'เน้นระยะเวลาในอนาคต' }, usages: ['Future duration'], examples: [{ text: "I will have been living.", verb: "will have been living", category: "Duration" }] }
];

// --- คลังสำหรับ Pre-test (20 ข้อ) ---
export const PRE_TEST_POOL: Question[] = [
  { id: 1, sentence: "Water ___ at 100 degrees Celsius.", correct: "boils", options: ["boil", "boils", "is boiling", "boiled"], tense: "Present Simple", explanation: "เป็นความจริงตามธรรมชาติ (Scientific Fact) จึงใช้ Present Simple." },
  { id: 2, sentence: "Look! The cat ___ on the roof.", correct: "is sitting", options: ["sits", "sat", "is sitting", "has sat"], tense: "Present Continuous", explanation: "มีคำว่า Look! บ่งบอกว่ากำลังเกิดขึ้นตอนนี้ จึงใช้ Present Continuous." },
  { id: 3, sentence: "I ___ this book already.", correct: "have read", options: ["read", "am reading", "have read", "will read"], tense: "Present Perfect", explanation: "มีคำว่า already บ่งบอกว่าทำเสร็จสมบูรณ์แล้วในปัจจุบัน จึงใช้ Present Perfect." },
  { id: 4, sentence: "Yesterday, we ___ to the cinema.", correct: "went", options: ["go", "goes", "went", "going"], tense: "Past Simple", explanation: "Yesterday บอกอดีตที่จบไปแล้ว จึงใช้ Past Simple (V.2)." },
  { id: 5, sentence: "While I ___ TV, the phone rang.", correct: "was watching", options: ["watch", "watched", "was watching", "had watched"], tense: "Past Continuous", explanation: "เป็นเหตุการณ์ที่กำลังดำเนินอยู่ในอดีตแล้วถูกแทรก (ขณะที่กำลังดู...โทรศัพท์ก็ดัง)." },
  { id: 6, sentence: "He ___ English for five years before he moved to London.", correct: "had been studying", options: ["studies", "is studying", "had studied", "had been studying"], tense: "Past Perfect Continuous", explanation: "เน้นความต่อเนื่องของเหตุการณ์ที่เกิดก่อนอีกเหตุการณ์หนึ่งในอดีต." },
  { id: 7, sentence: "I think it ___ tomorrow.", correct: "will rain", options: ["rains", "is raining", "will rain", "has rained"], tense: "Future Simple", explanation: "เป็นการคาดเดา (Prediction) เกี่ยวกับอนาคต จึงใช้ Future Simple." },
  { id: 8, sentence: "By the time you arrive, I ___ my work.", correct: "will have finished", options: ["finish", "will finish", "will have finished", "have finished"], tense: "Future Perfect", explanation: "By the time บอกว่าเหตุการณ์จะเสร็จสมบูรณ์ก่อนเวลาหนึ่งในอนาคต." },
  { id: 9, sentence: "She ___ usually ___ up at 6 AM.", correct: "gets", options: ["get", "gets", "got", "is getting"], tense: "Present Simple", explanation: "คำว่า usually บอกกิจวัตรประจำวัน จึงใช้ Present Simple." },
  { id: 10, sentence: "They ___ soccer at the moment.", correct: "are playing", options: ["play", "played", "are playing", "have played"], tense: "Present Continuous", explanation: "at the moment บ่งบอกว่ากำลังเกิดขึ้น ณ ตอนนี้." },
  { id: 11, sentence: "I ___ to Japan twice.", correct: "have been", options: ["was", "am", "have been", "go"], tense: "Present Perfect", explanation: "บอกประสบการณ์ว่าเคยไปมาแล้ว โดยไม่ระบุเวลาที่แน่นอน." },
  { id: 12, sentence: "Last night, I ___ a strange noise.", correct: "heard", options: ["hear", "heard", "was hearing", "had heard"], tense: "Past Simple", explanation: "Last night ระบุเวลาในอดีตที่จบไปแล้ว." },
  { id: 13, sentence: "They ___ dinner when the light went out.", correct: "were having", options: ["have", "had", "were having", "has had"], tense: "Past Continuous", explanation: "เหตุการณ์ที่กำลังทำในอดีตแล้วมีอีกเหตุการณ์มาขัดจังหวะ." },
  { id: 14, sentence: "He ___ already ___ before I arrived.", correct: "had left", options: ["left", "has left", "had left", "was leaving"], tense: "Past Perfect", explanation: "เหตุการณ์ที่เกิดและจบก่อนอีกเหตุการณ์หนึ่งในอดีต." },
  { id: 15, sentence: "I ___ probably ___ at home tonight.", correct: "will be", options: ["am", "was", "will be", "have been"], tense: "Future Simple", explanation: "การคาดการณ์เหตุการณ์ในอนาคต (probably tonight)." },
  { id: 16, sentence: "We ___ for two hours when the bus finally came.", correct: "had been waiting", options: ["waited", "were waiting", "had waited", "had been waiting"], tense: "Past Perfect Continuous", explanation: "เน้นระยะเวลาที่ทำต่อเนื่องมาจนถึงจุดหนึ่งในอดีต." },
  { id: 17, sentence: "Next month, I ___ in this company for ten years.", correct: "will have been working", options: ["will work", "will have worked", "will have been working", "work"], tense: "Future Perfect Continuous", explanation: "บอกระยะเวลาที่จะสะสมมาจนถึงจุดหนึ่งในอนาคต." },
  { id: 18, sentence: "Listen! The baby ___.", correct: "is crying", options: ["cries", "cried", "is crying", "has cried"], tense: "Present Continuous", explanation: "Listen! สั่งให้ฟังสิ่งที่กำลังเกิดขึ้นเดี๋ยวนี้." },
  { id: 19, sentence: "I ___ my keys. I can't find them.", correct: "have lost", options: ["lost", "lose", "have lost", "had lost"], tense: "Present Perfect", explanation: "เหตุการณ์ที่เพิ่งเกิดขึ้นและส่งผลถึงปัจจุบัน (หาไม่เจอ)." },
  { id: 20, sentence: "They ___ to Paris next summer.", correct: "will travel", options: ["travel", "travels", "will travel", "traveled"], tense: "Future Simple", explanation: "แผนการหรือเหตุการณ์ในอนาคต." }
];

// --- คลังสำหรับ Post-test (30 ข้อ - ไม่ซ้ำกับ Pre-test) ---
export const POST_TEST_POOL: Question[] = [
  { id: 101, sentence: "The moon ___ around the Earth.", correct: "goes", options: ["go", "goes", "is going", "went"], tense: "Present Simple", explanation: "เป็นความจริงทางวิทยาศาสตร์ตลอดกาล." },
  { id: 102, sentence: "Quiet! I ___ to the news.", correct: "am listening", options: ["listen", "listened", "am listening", "have listened"], tense: "Present Continuous", explanation: "Quiet! บ่งบอกว่ากำลังทำบางอย่างที่ต้องการสมาธิ ณ ตอนนี้." },
  { id: 103, sentence: "She ___ her keys. She is looking for them now.", correct: "has lost", options: ["loses", "lost", "has lost", "had lost"], tense: "Present Perfect", explanation: "ส่งผลถึงปัจจุบันคือตอนนี้เธอกำลังหาอยู่." },
  { id: 104, sentence: "I ___ a big sandwich for lunch yesterday.", correct: "ate", options: ["eat", "eats", "ate", "eaten"], tense: "Past Simple", explanation: "yesterday ระบุเวลาอดีตที่เจาะจง." },
  { id: 105, sentence: "He ___ his bike when he fell off.", correct: "was riding", options: ["rides", "rode", "was riding", "had ridden"], tense: "Past Continuous", explanation: "กำลังทำกริยาหนึ่งอยู่ แล้วเกิดอุบัติเหตุแทรก." },
  { id: 106, sentence: "They ___ the house before the guests arrived.", correct: "had cleaned", options: ["clean", "cleaned", "have cleaned", "had cleaned"], tense: "Past Perfect", explanation: "ทำความสะอาดเสร็จก่อนที่แขกจะมา (เกิดก่อนอดีตอีกที)." },
  { id: 107, sentence: "Next year, my sister ___ university.", correct: "will start", options: ["starts", "is starting", "will start", "has started"], tense: "Future Simple", explanation: "เหตุการณ์ในอนาคตที่คาดการณ์ไว้." },
  { id: 108, sentence: "By 2026, I ___ from high school.", correct: "will have graduated", options: ["graduate", "will graduate", "will have graduated", "have graduated"], tense: "Future Perfect", explanation: "By + ปีอนาคต บ่งบอกว่าเหตุการณ์จะเสร็จสิ้นตอนนั้น." },
  { id: 109, sentence: "Dogs ___ bark at strangers.", correct: "usually", options: ["usually", "now", "yesterday", "since"], tense: "Present Simple", explanation: "นิสัยหรือพฤติกรรมปกติใช้ Present Simple คู่กับ adverb of frequency." },
  { id: 110, sentence: "Don't bother him. He ___.", correct: "is sleeping", options: ["sleeps", "is sleeping", "slept", "has slept"], tense: "Present Continuous", explanation: "บอกว่าอย่ากวนเพราะ 'ตอนนี้' เขากำลังหลับ." },
  { id: 111, sentence: "I ___ her for ten years.", correct: "have known", options: ["know", "am knowing", "have known", "had known"], tense: "Present Perfect", explanation: "กริยา know มักไม่ใช้ในรูป Continuous จึงใช้ Perfect บอกระยะเวลาที่รู้จักมาจนปัจจุบัน." },
  { id: 112, sentence: "Two days ago, I ___ my old friend.", correct: "met", options: ["meet", "met", "was meeting", "have met"], tense: "Past Simple", explanation: "ago ระบุอดีตที่ชัดเจน." },
  { id: 113, sentence: "While Mom was cooking, Dad ___ the garden.", correct: "was watering", options: ["waters", "watered", "was watering", "is watering"], tense: "Past Continuous", explanation: "สองเหตุการณ์ที่กำลังดำเนินไปพร้อมๆ กันในอดีต (Parallel Actions)." },
  { id: 114, sentence: "When I arrived at the station, the train ___.", correct: "had already left", options: ["leaves", "is leaving", "has left", "had already left"], tense: "Past Perfect", explanation: "รถไฟไปก่อนที่ฉันจะถึง (เหตุการณ์เกิดก่อนอดีต)." },
  { id: 115, sentence: "I promise I ___ you back tomorrow.", correct: "will pay", options: ["pay", "pays", "will pay", "am paying"], tense: "Future Simple", explanation: "ใช้ will สำหรับการให้สัญญา (Promise)." },
  { id: 116, sentence: "He ___ for the test all night.", correct: "has been studying", options: ["studies", "is studying", "has been studying", "studied"], tense: "Present Perfect Continuous", explanation: "เน้นว่าอ่านมาอย่างหนักหน่วงต่อเนื่องจนถึงปัจจุบัน." },
  { id: 117, sentence: "By the end of this month, I ___ here for a year.", correct: "will have been living", options: ["will live", "will have lived", "will have been living", "live"], tense: "Future Perfect Continuous", explanation: "นับระยะเวลาต่อเนื่องไปจนถึงจุดหนึ่งในอนาคต." },
  { id: 118, sentence: "The pink bakery ___ at 8:00 every morning.", correct: "opens", options: ["open", "opens", "is opening", "opened"], tense: "Present Simple", explanation: "ตารางเวลา (Timetable) ใช้ Present Simple." },
  { id: 119, sentence: "Look at those clouds! It ___ rain.", correct: "is going to", options: ["will", "is going to", "rains", "has rained"], tense: "Future Simple", explanation: "ใช้ be going to สำหรับการคาดการณ์ที่มีหลักฐานชัดเจนเห็นอยู่ตรงหน้า." },
  { id: 120, sentence: "I ___ never ___ a pink elephant before.", correct: "have seen", options: ["see", "saw", "have seen", "had seen"], tense: "Present Perfect", explanation: "บอกประสบการณ์ (Experience) ว่าไม่เคยเห็นมาก่อนเลย." },
  { id: 121, sentence: "Last summer, we ___ many strawberries.", correct: "picked", options: ["pick", "picks", "picked", "were picking"], tense: "Past Simple", explanation: "เหตุการณ์ที่จบสมบูรณ์ในอดีต (Last summer)." },
  { id: 122, sentence: "She ___ when she heard the news.", correct: "was crying", options: ["cries", "cried", "was crying", "is crying"], tense: "Past Continuous", explanation: "เหตุการณ์ที่กำลังดำเนินอยู่ (กำลังร้องไห้อยู่) ในอดีต." },
  { id: 123, sentence: "I ___ my homework before I went out.", correct: "had finished", options: ["finish", "finished", "has finished", "had finished"], tense: "Past Perfect", explanation: "ทำการบ้านเสร็จก่อน (เหตุการณ์ 1) แล้วค่อยออกไป (เหตุการณ์ 2 ในอดีต)." },
  { id: 124, sentence: "I ___ you later.", correct: "will call", options: ["call", "calls", "will call", "am calling"], tense: "Future Simple", explanation: "การตัดสินใจทันที (Instant decision)." },
  { id: 125, sentence: "She ___ English since she was five.", correct: "has been learning", options: ["learns", "is learning", "has been learning", "learned"], tense: "Present Perfect Continuous", explanation: "เน้นความต่อเนื่องจากอดีตจนปัจจุบัน (since)." },
  { id: 126, sentence: "In 2030, people ___ in flying cars.", correct: "will be driving", options: ["drive", "will drive", "will be driving", "are driving"], tense: "Future Continuous", explanation: "คาดการณ์สิ่งที่กำลังดำเนินอยู่ในอนาคตไกลๆ." },
  { id: 127, sentence: "They ___ all the food by the time we got there.", correct: "had eaten", options: ["eat", "ate", "have eaten", "had eaten"], tense: "Past Perfect", explanation: "เขากินหมดไปก่อนที่เราจะถึง." },
  { id: 128, sentence: "I ___ a bath when the doorbell rang.", correct: "was taking", options: ["take", "took", "was taking", "am taking"], tense: "Past Continuous", explanation: "กำลังอาบน้ำอยู่ (ต่อเนื่อง) แล้วมีคนกดกริ่งแทรก." },
  { id: 129, sentence: "He ___ to the gym every Friday.", correct: "goes", options: ["go", "goes", "is going", "went"], tense: "Present Simple", explanation: "กิจวัตรประจำวัน (Habit)." },
  { id: 130, sentence: "I ___ here for three hours when she finally arrived.", correct: "had been waiting", options: ["waited", "was waiting", "had waited", "had been waiting"], tense: "Past Perfect Continuous", explanation: "เน้นความต่อเนื่องของเวลาที่รอก่อนเหตุการณ์อดีตอีกอันหนึ่ง." }
];

export const SCRAMBLE_POOL: Question[] = [
  { id: 501, sentence: "The kitten is sleeping on the rug", correct: "The kitten is sleeping on the rug", scrambledWords: ["sleeping", "on", "kitten", "is", "The", "rug"], tense: "Present Continuous" },
  { id: 502, sentence: "I will bake a pink cake tomorrow", correct: "I will bake a pink cake tomorrow", scrambledWords: ["bake", "tomorrow", "will", "a", "cake", "pink", "I"], tense: "Future Simple" },
  { id: 503, sentence: "She has lost her magic wand", correct: "She has lost her magic wand", scrambledWords: ["has", "magic", "lost", "her", "wand", "She"], tense: "Present Perfect" }
];

export const MATCH_POOL: Question[] = [
  { id: 601, sentence: "I study English every Monday.", correct: "Present Simple", options: ["Present Simple", "Present Continuous", "Past Simple", "Future Simple"], tense: "Present Simple" },
  { id: 602, sentence: "We were dancing at 8 PM.", correct: "Past Continuous", options: ["Past Simple", "Past Continuous", "Present Perfect", "Future Simple"], tense: "Past Continuous" },
  { id: 603, sentence: "By next year, I will have graduated.", correct: "Future Perfect", options: ["Future Simple", "Future Perfect", "Present Perfect", "Past Perfect"], tense: "Future Perfect" }
];

export const GARDEN_POOL: Question[] = [
  { id: 201, sentence: "Roses ___ lovely in the morning.", correct: "look", options: ["look", "looks", "looking", "looked"], tense: "Present Simple" },
  { id: 202, sentence: "The sun ___ brightly today.", correct: "is shining", options: ["shines", "is shining", "shone", "will shine"], tense: "Present Continuous" }
];

export const MACHINE_POOL: Question[] = [
  { id: 301, sentence: "I see a butterfly.", targetTense: "Past Simple", correct: "I saw a butterfly.", options: ["I saw a butterfly.", "I am seeing a butterfly.", "I have seen a butterfly.", "I will see a butterfly."], tense: "Past Simple" },
  { id: 302, sentence: "She is singing.", targetTense: "Future Simple", correct: "She will sing.", options: ["She sang.", "She will sing.", "She sings.", "She has sung."], tense: "Future Simple" }
];

export const QUEST_POOL: Question[] = [
  { id: 401, sentence: "He always drink coffee.", wrongPart: "drink", correct: "drinks", options: ["drink", "drinks", "drinking", "drank"], tense: "Present Simple" },
  { id: 402, sentence: "They was playing football.", wrongPart: "was", correct: "were", options: ["was", "were", "been", "be"], tense: "Past Continuous" }
];

export const SNIPER_POOL = [...PRE_TEST_POOL, ...POST_TEST_POOL];
export const SENTENCE_POOL = [...SNIPER_POOL, ...GARDEN_POOL, ...MACHINE_POOL, ...QUEST_POOL, ...SCRAMBLE_POOL, ...MATCH_POOL];
