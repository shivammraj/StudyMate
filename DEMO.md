# StudyMate Demo Script (75 Seconds)

> **Core Message:** Students don't need another generic AI chatbot that outputs paragraphs of text. They need to **see** the execution, test their understanding with a diagnostic quiz, uncover why their intuition failed, and follow a targeted 10-minute fix.

---

## ⏱️ Step-by-Step Walkthrough

| Timestamp | What You Do on Screen | What You Say to Judges |
|---|---|---|
| **0:00** | On the Home screen, click the instant chip **"Explain binary search"** or type it, then click **"Explain it"**. | *"Students don't need another paragraph. They need to see it."* |
| **0:10** | Point out the header tags: **Subject: Computer Science**, **Method: Step-by-step with code**, and the Big Idea. | *"StudyMate determined the exact subject and selected a synchronized visual walkthrough with C++ code."* |
| **0:15** | Switch to **"Predict"** mode. Click **Next** or press **Right Arrow**. Predict the decision at mid index: show that predicting correctly advances, while the C++ line highlights in sync with the array cells. | *"Notice: Every step is computed by pure deterministic code, so the animation is always mathematically correct. The active C++ line moves directly with the state."* |
| **0:35** | Scroll down, click **"Practice this topic"**. Answer the 6 questions quickly: answer recall questions correctly, deliberately miss an application question and mark confidence as **"Certain"**. | *"Six questions, three distinct concepts, three cognitive skills—pinpointing facts, understanding, and application."* |
| **0:50** | Arrive on **Results** screen. Point to the diagnostic headline: e.g. *"You felt sure about Loop termination, but the answer was off. Fix that first."* or *"You know the idea but struggle to use it on new problems."* | *"It doesn't give a useless grade like '4 out of 6'. It provides a human diagnostic: what's actually broken in your mental model."* |
| **1:00** | Click **"Start your 10-minute plan"**. Check off the first exercise step, show the curated search resources, then click **"Retake practice"**. | *"Here is a 10-minute plan focused purely on the weakest idea. When the student retakes the practice, Results shows a direct Before/After mastery delta."* |
| **1:10** | Click **"My progress"** in the top navigation bar. Show the topic mastery map populated across subjects. | *"Your mastery map fills in from real practice data, tracking retention and continuous improvement across the engineering syllabus."* |

---

## 🛡️ Hackathon Demo Safeguards

1. **AI Latency or Offline Backup**:
   - The 3 sample chips on the Home screen (*"Explain binary search"*, *"Explain Kirchhoff's voltage law"*, *"Solve: integrate x e^x dx"*) load instantly from pre-verified fixtures with zero network latency.
   - If Wi-Fi is spotty, keep `AI_PROVIDER=mock` active.
2. **Demo Data Seed**:
   - Navigate to `http://localhost:5173/?demo=1` to instantly pre-populate the **My progress** topic map with historical sessions. Click **"Clear demo data"** anytime to reset.
