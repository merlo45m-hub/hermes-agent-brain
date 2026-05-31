# Hermes + Obsidian Setup Guide

## What You'll Get

✅ **Permanent Memory** — Hermes remembers everything about you across sessions  
✅ **Faster Responses** — Retrieves from vault instead of re-processing  
✅ **Lower Token Usage** — Context stored externally, not re-sent every turn  
✅ **Infinite Context** — All your notes linked together in one system  

---

## 3 Steps to Connect

### 1️⃣ Add Your First Note to GitHub

Your GitHub vault is at: `https://github.com/merlo45m-hub/hermes-agent-brain`

**On your Android phone, open Termux:**

```bash
cd ~/storage/shared
git clone https://github.com/merlo45m-hub/hermes-agent-brain.git
cd hermes-agent-brain
```

**Create your first memory note:**

```bash
cat > MY_PROFILE.md << 'EOF'
# Michael's Profile

## Who I Am
- Name: Michael (@merlo45m-hub)
- Platform: Primarily Android user
- Location: [your location]
- Role: [your role/occupation]

## My Goals
1. Build an AI-powered photo editor for mobile
2. Connect Obsidian vault as permanent memory
3. Create workflows that save time

## Preferences
- Prefer concise, actionable updates
- Copy-paste ready code examples
- Dark theme / professional aesthetics
- Matcha lover ☕

## Tech Stack I Use
- React Native / Expo
- NVIDIA NIM APIs
- OpenRouter
- Ollama Cloud (gemma4:31b)
- GitHub + Obsidian vault

## Project Status
- PhotoEditor Pro: Phase 1 complete (4,518 LOC), Phase 2 (AI features) scaffolded
- API integrations: Working (NVIDIA NIM tested)
- Vault setup: In progress
EOF
```

**Push it to GitHub:**

```bash
git add MY_PROFILE.md
git commit -m "Add my profile and preferences"
git push
```

### 2️⃣ Connect Hermes to Your Vault

**Back on your computer (or in this sandbox), configure Hermes:**

```bash
# Enable memory
hermes config set memory.memory_enabled true

# Point to your GitHub vault
hermes config set agent.vault_path ~/obsidian_vault_final

# Enable user profile
hermes config set user_profile_enabled true

# Restart Hermes or start a new session
hermes
```

### 3️⃣ Add More Notes to Build Context

Create additional markdown files in your vault:

**GOALS.md** — What you're working toward
```bash
cat > GOALS.md << 'EOF'
# Current Goals

## Short Term (This Month)
- [ ] Test PhotoEditor Pro demo on Android phone
- [ ] Integrate NVIDIA NIM APIs fully
- [ ] Set up CI/CD pipeline

## Medium Term (3 Months)
- [ ] Complete Phase 2 AI features (auto-enhance, background removal)
- [ ] Deploy to Play Store / App Store
- [ ] User testing with photographers

## Long Term (6+ Months)
- [ ] Reach 10k daily active users
- [ ] Build community around the app
- [ ] Expand to web version
EOF
git add GOALS.md && git commit -m "Add goals" && git push
```

**PROJECTS.md** — What you're building
```bash
cat > PROJECTS.md << 'EOF'
# Projects

## PhotoEditor Pro
- **Status**: Active development
- **Tech**: React Native, Expo, Zustand, react-native-skia
- **Phase 1**: Complete (Library, Edit, Export tabs)
- **Phase 2**: AI features scaffolded (auto-enhance, background removal, etc.)
- **Next**: Deploy Expo app, integrate NVIDIA NIM

## Obsidian Vault Bridge
- **Status**: Setting up
- **Purpose**: Give Hermes permanent memory
- **Benefits**: Faster responses, lower token usage, infinite context
- **Connected**: GitHub repo (hermes-agent-brain)

## NVIDIA NIM Integration
- **Status**: Testing (API key verified)
- **Models**: llama-3.1-8b-instruct, llama-3.2-1b-instruct
- **Use**: LLM completions for prompt enhancement
- **Next**: Integrate with ComfyUI for video generation
EOF
git add PROJECTS.md && git commit -m "Add projects" && git push
```

**LEARNINGS.md** — What you've discovered
```bash
cat > LEARNINGS.md << 'EOF'
# Key Learnings

## API Integrations
- ✅ NVIDIA NIM works: base URL must be https://integrate.api.nvidia.com/v1 (not api.nvidia.com)
- ✅ OpenRouter works for video generation
- ⚠️ Comfy Cloud free tier cannot queue video jobs (HTTP 429 – PAYMENT_REQUIRED)
- 💡 Alternative: Use local ComfyUI with DGX playbooks on GPU machine

## Photo Editing
- React Native Skia for GPU rendering
- Zustand for state management (very clean for complex editor UX)
- Layer-based non-destructive editing is essential
- Before/after split view with draggable divider is a must-have

## Android Development
- Termux is valuable for package management
- `pkg update && pkg upgrade` must run as non-root
- Expo Go simplifies testing on phone without full APK build

## GitHub + Obsidian
- Private vault requires personal access token (PAT with repo scope)
- Git pull/push from Android via Termux works smoothly
- Markdown-first workflow keeps everything searchable and version-controlled
EOF
git add LEARNINGS.md && git commit -m "Add learnings" && git push
```

---

## How It Works

1. **Hermes reads your vault** at session start
2. **Extracts key facts** (goals, preferences, projects, learnings)
3. **Injects them into context** so every response knows who you are
4. **Uses fewer tokens** because facts are stored in vault, not re-sent

---

## What Hermes Now Remembers

Every time you open Hermes, it knows:

- ✅ Your profile (name, preferences, tech stack)
- ✅ Your goals (what you're working toward)
- ✅ Your projects (PhotoEditor Pro, integrations, etc.)
- ✅ Your learnings (API quirks, workflows, discoveries)

**The secret sauce** (from the video): interconnected notes. Link them:

```markdown
# MY_PROFILE.md
- Working on: [[PROJECTS#PhotoEditor Pro]]
- Current goals: [[GOALS#Short Term]]

# PROJECTS.md
- Uses NVIDIA NIM: [[LEARNINGS#API Integrations]]
- Learned from: [[LEARNINGS#Photo Editing]]
```

---

## Next: Add This Note to Your Vault

Once you've completed steps 1-3, add this setup guide itself:

```bash
cp /path/to/this/file HERMES_OBSIDIAN_SETUP.md
git add HERMES_OBSIDIAN_SETUP.md
git commit -m "Add Hermes+Obsidian setup guide"
git push
```

Every time you discover something new, add it to the vault. Hermes will use it in every future session.

---

## Testing It Works

Start a new Hermes session:

```bash
hermes
```

Then ask:

```
What are my current goals?
What tech stack do I prefer?
What have I learned about NVIDIA NIM?
Tell me about the PhotoEditor Pro project.
```

Hermes should answer accurately by reading from your vault — **without you re-explaining anything**. That's the infinite context engine in action.

---

**Questions?** Watch the video: https://youtu.be/kobM9Z1FQZM?si=lhrWkDNpTvQF-Y0p
