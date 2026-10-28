# Genius Protocol

A self-study app for computing, networking, security and AI: lessons, labs, quizzes, flashcards, certification guides and ADA, an AI tutor.

**Open it:** https://gold567200.github.io/gold567200/

- On iPhone, open the link in Safari, tap Share, then **Add to Home Screen**.
- Progress is saved in the browser on each device. Use **Labs → Genius Tools → Backup & restore** to move it between devices.
- For a lifelike professor voice in lectures and the Classroom, open **Labs → Genius Tools → Professor voice** and download the on-device voice (about 159 MB, once). It runs on your phone with no account. ElevenLabs, with your own key, is an optional alternative.
- The on-device voice uses Supertonic 3 by Supertone (OpenRAIL licence) on the sherpa-onnx WebAssembly engine (Apache-2.0); see `voice/LICENSES.txt`.
- To use ADA on this website, open **Labs → Genius Tools → Connect ADA** and paste your own Anthropic API key. The key stays in that browser and is sent only to `api.anthropic.com`. Create it in a Console workspace with a spend limit.

This is a static site with no build step. GitHub Pages serves this `gh-pages` branch from its root. The `main` branch holds the GitHub profile README and is separate.
