/* Lab guides — batch 4 (p39–p46) */
window.LABX=window.LABX||{};

/* p39 Mobile App Development */
Object.assign(window.LABX,{
  "p39lab1":{
    time:"two or three sessions of 2–3 h",
    setup:[
      "Android Studio (current stable) from developer.android.com/studio, with SDK Platform 36 and one emulator image (API 35 or 36, Google APIs, matching your CPU: x86_64 or arm64). Hardware acceleration must work: KVM on Linux, Hypervisor Framework on macOS, WHPX on Windows. 16 GB RAM is comfortable; 8 GB works with only the emulator open.",
      "Use the JDK bundled with Android Studio (Settings > Build, Execution, Deployment > Build Tools > Gradle > Gradle JDK). Do not install a separate JDK unless a build error asks for one.",
      "Look up current versions on developer.android.com/jetpack/androidx/versions and the KSP releases page instead of copying old blog posts. In gradle/libs.versions.toml you will need: room-runtime, room-ktx, room-compiler, hilt-android, hilt-compiler, the Hilt Compose ViewModel artifact, lifecycle-viewmodel-compose, navigation3-runtime and navigation3-ui, plus the ksp, hilt and room plugins.",
      "An empty GitHub repository cloned locally, and Developer options enabled on the emulator (Settings > About > tap Build number seven times)."
    ],
    checkpoints:[
      "./gradlew assembleDebug ends with BUILD SUCCESSFUL, and the app launches on the emulator showing your empty Compose screen. libs.versions.toml contains the Room, Hilt, KSP and Navigation 3 entries, and the app build.gradle.kts uses ksp(...) for both compilers.",
      "Typing a note and tapping Add shows it at the top of the list at once, with no manual refresh, because the list is driven by the Flow. App Inspection > Database Inspector shows the notes table with your rows.",
      "./gradlew testDebugUnitTest passes the ViewModel tests, and ./gradlew connectedDebugAndroidTest passes the DAO test and the Compose UI test. The HTML reports under app/build/reports/ list every test name in green.",
      "Your README has a table with one row per piece of state: notes list, half-typed text, scroll position. Each row says whether it survived rotation and whether it survived process death, and which object kept it (ViewModel, SavedStateHandle or rememberSaveable, Room)."
    ],
    hints:[
      "Keep NotesScreen stateless. It receives a NotesUiState and two lambdas (onTextChange, onAdd) and owns nothing. Then the ViewModel can be tested without UI, and the UI can be tested without Hilt or a database.",
      "In the DAO, observe with a non-suspend function that returns Flow<List<Note>>, and insert with a suspend function. The ViewModel maps the repository Flow to NotesUiState and turns it into a StateFlow with stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), NotesUiState()). Key LazyColumn items with items(notes, key = { it.id }).",
      "Tests: set Dispatchers.setMain(UnconfinedTestDispatcher()) in @Before and reset it in @After. Back the fake repository with a MutableStateFlow. Collect uiState in backgroundScope so WhileSubscribed has a subscriber. For the UI test, use createComposeRule(), setContent { NotesScreen(...) }, then performTextInput, performClick and assertIsDisplayed. For process death: press Home, then run adb shell am kill <applicationId>, then reopen the app from Recents."
    ],
    trouble:[
      ["App crashes at launch: 'Hilt Activity must be attached to an @HiltAndroidApp Application'","There is no Application class annotated with @HiltAndroidApp, or the manifest does not point to it","Create class NotesApp : Application() with @HiltAndroidApp, set android:name=\".NotesApp\" on <application>, and add @AndroidEntryPoint to MainActivity."],
      ["Build fails with a wall of KSP, Hilt or 'Unresolved reference' errors","The ksp plugin is not applied in the module, kapt and ksp are mixed, or the KSP version does not support your Kotlin version","Read the first error in the Build window, not the last; later errors are usually caused by the first. Apply the ksp plugin in the app module, use ksp(...) for room-compiler and hilt-compiler, and pick a KSP release that lists support for your Kotlin version."],
      ["IllegalStateException: 'Cannot access database on the main thread since it may potentially lock the UI for a long period of time'","A non-suspend DAO insert is called from a click handler","Make insert a suspend function and call it inside viewModelScope.launch in the ViewModel, never from the composable."],
      ["ViewModel test fails with 'Module with the Main dispatcher had failed to initialize', or uiState never leaves its initial value","viewModelScope uses Dispatchers.Main, which does not exist on the JVM; with WhileSubscribed, nobody is collecting","Call Dispatchers.setMain in a test rule. Start a collector with backgroundScope.launch(UnconfinedTestDispatcher(testScheduler)) { vm.uiState.collect() } before you assert."],
      ["After you 'kill' the app, it opens fresh and even rememberSaveable text is gone","You force-stopped it (Force stop, or the Studio stop button). Force-stop clears the saved task state, which real process death does not","Simulate process death properly: put the app in the background, run adb shell am kill <applicationId>, then return to it from Recents."]
    ],
    challenge:"Add a 'pinned' Boolean column to Note. Bump the database version and write Migration(1, 2). Turn on schema export with the Room Gradle plugin's schemaDirectory. Then prove the migration with MigrationTestHelper in an instrumented test: create a version 1 database containing two notes, migrate it, and assert that both notes survive with pinned = false. Finally, install the old APK on the emulator, add notes, install the new APK over it, and confirm on the device that nothing was lost.",
    reflect:[
      "Why does the ViewModel survive rotation but not process death? Which object actually held the notes list in each case, and why did Room not care either way?",
      "What would break, and where, if NotesScreen collected the DAO Flow directly instead of going through the repository and the ViewModel? Think about testing and configuration changes.",
      "Why key LazyColumn items by id? What visibly goes wrong with index-based keys when a new note is inserted at the top while the list is animating?"
    ]
  },

  "p39lab2":{
    time:"4–6 h with a Mac; 2–3 h for the Linux package route",
    setup:[
      "With a Mac: install the current Xcode (27 at the time of writing) from the Mac App Store or developer.apple.com, plus at least one iOS Simulator runtime (Xcode > Settings > Components). Check Xcode's release notes for the minimum macOS it needs. You do not need a paid developer account for the Simulator.",
      "A free weather API that needs no key: Open-Meteo. Geocode with geocoding-api.open-meteo.com/v1/search?name=<city>, then fetch the forecast from api.open-meteo.com/v1/forecast with latitude, longitude and current=temperature_2m. Save one real response of each to disk as a test fixture.",
      "Without a Mac: install Swift 6.x for Linux with swiftly (swift.org/install), then run swift --version. Create the package with swift package init --type library. Swift Testing ships with Swift 6 toolchains, so import Testing works.",
      "If you rent a Mac, choose an hourly provider and read the billing terms first. Some cloud Mac offerings have a 24-hour minimum."
    ],
    checkpoints:[
      "The app builds and runs in the Simulator. A temporary debug Text shows a decoded temperature for a hard-coded city, fetched over an https:// URL.",
      "Typing a city shows a ProgressView, then the forecast. A nonsense city shows your error state, not a crash or an endless spinner. Favorite cities are still listed after you stop the app in Xcode and run it again (SwiftData persisted them).",
      "The Test navigator shows the Swift Testing tests (decoding plus model logic with a fake loader, no network) and the XCUITest all passing. A Cmd-U run or xcodebuild test ends with '** TEST SUCCEEDED **'.",
      "Linux route: swift build and swift test both succeed, and the summary shows your decoding and model tests passing. Your written plan lists exactly what still needs macOS (SwiftUI views, SwiftData, the Simulator, XCUITest, signing), with a dated, costed way to get each one."
    ],
    hints:[
      "Decide who owns the state. One view creates the WeatherModel with @State and passes it down. Children read it and never create their own. .task(id:) restarts the work whenever its id changes and cancels the previous run.",
      "Put a protocol between the model and the network, for example WeatherLoading with one async throws function that returns a Forecast. The live type calls URLSession.shared.data(from:). The fake returns your saved JSON fixture. The model takes a loader in its initializer.",
      "Model the screen as an enum: idle, loading, loaded(Forecast), failed(String). Inside .task(id: city), first await Task.sleep(for: .milliseconds(400)) as a debounce, then set loading, await the loader and set the result. Catch CancellationError separately and ignore it. For the UI test, set app.launchArguments = [\"-uiTesting\"] so the app injects the fake loader, give the field an accessibilityIdentifier, type the city, and use waitForExistence(timeout: 5) on the result label."
    ],
    trouble:[
      ["Console: 'App Transport Security policy requires the use of a secure connection'","An http:// URL","Use https:// endpoints. Do not add an ATS exception to work around it."],
      ["The decode fails with DecodingError.keyNotFound or typeMismatch","Your struct does not match the JSON: snake_case keys, a nested 'current' object, or a field that is sometimes missing","Print the whole DecodingError, not localizedDescription; it names the coding path. Decode the saved fixture in a unit test, and use CodingKeys or keyDecodingStrategy = .convertFromSnakeCase."],
      ["The error state flashes on every keystroke","Each keystroke changes the task id, which cancels the previous request, and the cancellation is treated as a failure","Catch CancellationError (and URLError.cancelled) and return quietly. Debounce at the start of the task."],
      ["XCUITest: 'Failed to find matching element', or a timeout","There is no accessibility identifier, or the test waits on the real network","Add .accessibilityIdentifier(\"city\") and one on the result label. Inject the fake loader through a launch argument so the UI test never depends on the internet."],
      ["Linux: 'cannot find URLSession in scope' or 'no such module SwiftUI'","On Linux, URLSession lives in FoundationNetworking, and SwiftUI does not exist there","Wrap the import in #if canImport(FoundationNetworking) import FoundationNetworking #endif, and keep every view out of the package."]
    ],
    challenge:"Add a cache that serves a city's forecast for 10 minutes without a network call. Inject a clock (a protocol that returns now) so a test can move time forward and prove that the cache expires. Then switch the package and the app to the Swift 6 language mode with complete strict concurrency checking. Fix every Sendable and actor-isolation diagnostic without @unchecked Sendable, and write down which type you made an actor and why.",
    reflect:[
      "Why use .task(id:) instead of onChange plus a manual Task { }? What happens to an in-flight request when the city changes or the view disappears?",
      "What would go wrong if a child view created its own WeatherModel? How would that show up on screen?",
      "What does the fake loader let you test that the real one cannot, and what risk is still untested until you hit the real API?"
    ],
    safety:"Cloud Mac rentals cost money. Note the billing unit and any minimum before you start. Some providers bill a 24-hour minimum, and a dedicated host keeps billing until you release it. Stop or release the machine as soon as your session ends."
  },

  "p39lab3":{
    time:"two sessions of 3 h",
    setup:[
      "Pick one stack. Flutter: install from docs.flutter.dev (on Ubuntu, snap install flutter --classic also works), then run flutter doctor until the Android toolchain is green, accepting licenses with flutter doctor --android-licenses. Expo: install Node LTS, then npx create-expo-app@latest notes-expo.",
      "The emulator from Lab 1, created from a Google Play system image so you can install Accessibility Scanner and the Android Accessibility Suite (TalkBack) from the Play Store. A physical Android phone is even better for the screen-reader pass.",
      "Your native Lab 1 app, with a release build configured: ./gradlew assembleRelease, signed with a local release key or, for local measurement only, the debug key.",
      "Before you turn TalkBack on, enable its shortcut (Settings > Accessibility > TalkBack > TalkBack shortcut: hold both volume keys) so you can always turn it off again."
    ],
    checkpoints:[
      "The cross-platform notes screen runs on the Android emulator. You can add a note and see it appear in the list. flutter doctor (or npx expo-doctor) reports no Android problems.",
      "A filled comparison table: release size for the same ABI (arm64-v8a) for each app, and median cold start over 10 runs from adb shell am start -W (the TotalTime field), all on the same device. The Bluetooth column names the actual library or API and the permissions each stack would need.",
      "A log of the eyes-closed add-note task in each app. It records every announcement that was missing, wrong or confusing, such as 'Button, unlabeled'. At the largest font size, a screenshot of each app shows whether any text clips or overlaps.",
      "Accessibility Scanner reports no remaining suggestions on each screen, or only ones you justify in writing. You have before and after screenshots for every fix."
    ],
    hints:[
      "Compare like with like: release builds, the same ABI, the same device, and the same cold-start condition. Debug builds are meaningless here, because Flutter debug runs in JIT mode and React Native debug loads JavaScript from Metro.",
      "Size: flutter build apk --release --target-platform android-arm64 --analyze-size. For Expo, npx expo run:android --variant release, which generates the native project first. Cold start: adb shell am force-stop <package>, then adb shell am start -W -n <package>/<activity>. Repeat ten times, discard the first run and take the median.",
      "Most Scanner findings come down to three fixes. Every icon-only button needs a label (contentDescription in Compose, Semantics label or tooltip in Flutter, accessibilityLabel in React Native). Touch targets must be at least 48 × 48 dp. Text must reach 4.5:1 contrast. For clipping, remove fixed heights so rows can grow and wrap."
    ],
    trouble:[
      ["The cross-platform app looks ten times larger than the native one","You are comparing a universal APK (all ABIs) with a single-ABI build, or an APK with an AAB","Build per ABI, or measure AABs with bundletool's get-size total. Write down the method in the table."],
      ["TalkBack or Accessibility Scanner cannot be found on the emulator","The system image has no Play Store, so the Android Accessibility Suite is missing","Create an AVD from a Google Play image and install both apps from the Play Store, or use a physical phone."],
      ["Stuck in TalkBack and unable to reach Settings","TalkBack changes the gestures: swipe to move, double-tap to activate","Hold both volume keys for three seconds to use the shortcut you set up. With adb, you can also clear the enabled_accessibility_services secure setting."],
      ["Cold-start numbers vary by 2x between runs","Emulator noise, a first-run compile, or background apps","Close other apps, discard the first launch, take the median of ten, and note the spread. If the spread is bigger than the difference, say so instead of claiming a winner."],
      ["TalkBack reads list items as one long run of text, or skips the add button","Semantics are merged or missing on custom rows","Check the merged semantics tree: Layout Inspector in Compose, the debugSemantics flag in Flutter. Group each row into one focusable element with a clear label."]
    ],
    challenge:"Turn the audit into automated tests that fail the build. In Flutter, add widget tests with meetsGuideline(androidTapTargetGuideline), labeledTapTargetGuideline and textContrastGuideline. In the native app, enable accessibility checks in the Compose or Espresso test. Remove one label on purpose and confirm the test fails with a readable message. Then record which of your manual TalkBack findings no automated check could ever have caught.",
    reflect:[
      "Which measured differences come from the framework's architecture (a bundled engine, a JavaScript runtime) and which come from your own code? How would you prove it?",
      "Why did the eyes-closed screen-reader pass find problems that Accessibility Scanner missed? Name the kinds of problems.",
      "If next quarter's feature were background Bluetooth LE scanning on both platforms, which stack would you choose given your numbers, and what evidence would change your mind?"
    ]
  },

  "p39lab4":{
    time:"3–5 h",
    setup:[
      "The Lab 1 Android project, and either the Lab 2 Xcode project or the Lab 2 Swift package, in one GitHub repository (or two). Public repositories get standard GitHub-hosted runner minutes free. Private repositories use your plan's included minutes, and macOS minutes cost several times more than Linux minutes. Check GitHub's current Actions billing page.",
      "Run each command locally first, exactly as CI will run it: ./gradlew lint testDebugUnitTest assembleDebug, ./gradlew connectedDebugAndroidTest with an emulator running, and xcodebuild test or swift test.",
      "fastlane installed locally (Homebrew, or gem install fastlane with a current Ruby; see docs.fastlane.tools). A Play Console service-account JSON key and an App Store Connect API key are only needed if you later run the beta lanes for real.",
      "Pin each action to its current major version tag, which you will find in each action's README: actions/checkout, actions/setup-java, gradle/actions/setup-gradle, actions/upload-artifact and reactivecircus/android-emulator-runner."
    ],
    checkpoints:[
      "A test pull request triggers the Android job and it goes green. The run's Artifacts section contains a reports zip with lint-results-debug.html and tests/testDebugUnitTest/index.html. On the second run, the setup-gradle step reports a cache hit and the job is noticeably faster.",
      "The emulator job log shows the emulator booting and connectedDebugAndroidTest running your Compose UI test, which passes. The test count in the report matches what you get locally.",
      "The macOS job ends with '** TEST SUCCEEDED **' from xcodebuild, or with a passing swift test summary on Linux if you have no Xcode project yet.",
      "fastlane lanes lists 'android beta' and 'ios beta'. The deploy workflow triggers only on workflow_dispatch. Secrets appear in YAML only as references like secrets.PLAY_JSON_KEY, never as values.",
      "A cost table: minutes per job, times pull requests per month, times any runner multiplier, compared with your plan's free minutes."
    ],
    hints:[
      "Make each job independent and reproducible: one platform per job, the same command you ran locally, and artifacts uploaded even on failure. A failed job without its reports is a mystery.",
      "Cache with gradle/actions/setup-gradle instead of hand-written cache keys. Add if: always() to the upload step. The emulator action needs /dev/kvm access on ubuntu runners; its README has the udev step that enables it.",
      "Key lines: runs-on: macos-26, then xcodebuild test -scheme <Scheme> -destination 'platform=iOS Simulator,name=<a device that xcrun simctl list devices available shows on that runner>'. In the Fastfile, use a platform :android block with gradle(task: 'bundle', build_type: 'Release') and upload_to_play_store(track: 'internal'), and a platform :ios block with build_app and upload_to_testflight. Trigger it with on: workflow_dispatch."
    ],
    trouble:[
      ["'./gradlew: Permission denied' on the runner","The execute bit on gradlew was lost when the file was committed from Windows or a zip","Run git update-index --chmod=+x gradlew, commit and push."],
      ["The emulator job times out, or logs a /dev/kvm permission error","KVM is not enabled for the runner user, or the image is the wrong architecture","Add the KVM udev step from the emulator action's README, use an x86_64 image on ubuntu runners, and cache the AVD snapshot if boot time hurts."],
      ["xcodebuild: 'Unable to find a destination matching the provided destination specifier'","The simulator name or OS in your destination is not installed on that runner image","Add a step that runs xcrun simctl list devices available and pick a listed device, or use OS=latest. Runner images change, so print what is there before you guess."],
      ["Lint fails the first run with dozens of old warnings","abortOnError is on, and the codebase has never been linted","Fix the real errors, then record the rest in a lint baseline file (lint { baseline = file(\"lint-baseline.xml\") }) and commit it. Do not disable lint."],
      ["upload_to_play_store fails with a 'package not found' style error","The Play API cannot create an app or its first release, or the service account lacks permission","Upload the first bundle manually in Play Console (Lab 5), then grant the service account release permissions under Users and permissions."]
    ],
    challenge:"Add a matrix to the emulator job (API 29 and API 36) and shard the instrumented tests across two runners. Cache the AVD snapshot. Measure wall-clock time and billed minutes before and after. Then decide, with numbers, which jobs run on every pull request and which run nightly or only on main. Write down the class of bug that your nightly-only jobs could let through, and how quickly you would find it.",
    reflect:[
      "Why upload reports with if: always()? Think through what you need when a job fails.",
      "Why keep the deploy lanes behind manual dispatch and repository secrets? What could happen if a pull request from a fork could trigger them?",
      "Given the price difference between macOS and Linux minutes, how do you decide which iOS checks run on every pull request?"
    ],
    safety:"Never commit keystores, Play service-account JSON files or App Store Connect .p8 keys. Store them only as encrypted repository secrets, and rotate any key that ever lands in git history. On private repositories, check your Actions spending limit or budget so a stuck macOS job cannot run up a bill."
  },

  "p39lab5":{
    time:"4–6 h, plus waiting time for Play processing",
    setup:[
      "A Google Play Console developer account (one-time registration fee, plus identity verification). Note: new personal accounts must run a closed test with a minimum number of testers for 14 days before they can publish to production. Internal testing has no such gate, and that is all this lab needs.",
      "A release upload key. In Android Studio: Build > Generate Signed App Bundle > create new keystore. Save the keystore file and both passwords in your password manager, plus an offline backup.",
      "Your own Android phone signed in to a Google account that you will add as an internal tester.",
      "The weather app's TestFlight part is a written plan. Do not pay for the Apple Developer Program just for this lab. A data inventory spreadsheet with columns: data type, collected by (your code or which SDK), purpose, leaves device?, shared with a third party?, encrypted in transit?, user can delete?"
    ],
    checkpoints:[
      "Play Console > Test and release > Setup > App signing shows Play App Signing enabled, with your upload key's SHA-256 fingerprint. The internal testing release reads 'Available to internal testers'. On your phone, the opt-in link leads to a Play Store install, and the app info screen shows it was installed from Google Play.",
      "The TestFlight plan names an internal group (App Store Connect users) and an external group with a target size. It includes Beta App Review notes with demo steps, a build cadence that keeps a build live inside the 90-day expiry, and the three questions you will ask testers.",
      "Every row in the data inventory maps to a Data safety answer and an App Privacy answer. No data type appears in one form but not the other. Each SDK row cites its source, such as the vendor's data disclosure page.",
      "If the app has accounts, account deletion is reachable from inside the app in three taps or fewer; if not, a sentence explains why there are no accounts. The privacy policy URL loads publicly over HTTPS. The rollout plan lists stages, a crash-free gate per stage, and halt criteria."
    ],
    hints:[
      "Start from evidence, not memory. The two forms summarize what the code and every SDK actually do. List those first, then fill in the forms.",
      "Find the evidence: the Merged Manifest tab shows every permission, including ones SDKs add. ./gradlew :app:dependencies lists every SDK. App Inspection > Network shows what really leaves the device. Each SDK vendor publishes a disclosure page, and Google's Play SDK Index covers many of them.",
      "Definitions matter. In Google's terms, data processed only on the device is not 'collected', and transfers to a service provider acting for you are not 'sharing'. A notes app with no network calls and no SDKs may honestly declare no data collected, but only after you have confirmed that no analytics or crash SDK is present. For rollout gates, Android vitals treats a user-perceived crash rate above about 1.09% and an ANR rate above about 0.47% as bad behavior. Set your gate stricter than that."
    ],
    trouble:[
      ["Upload rejected: 'You uploaded an APK or Android App Bundle that was signed in debug mode'","The release build is still using the debug signing config","Use Generate Signed App Bundle, or add a release signingConfig that reads the keystore path and passwords from local properties or environment variables, never from committed files."],
      ["'Version code 1 has already been used. Try another version code.'","Every upload needs a higher versionCode, even a failed one","Increase versionCode in the app's build.gradle.kts and rebuild. Consider deriving it from a counter or the date."],
      ["The tester's phone says the app is not available","The phone's Google account is not on the tester list, the opt-in has not been accepted, or the release is still processing","Check which account the Play Store on the phone uses, open the opt-in link while signed in as that account, and allow time for processing. Check the tester list before reinstalling anything."],
      ["Lost the upload keystore or its password","The key was never backed up","With Play App Signing you can request an upload key reset in Play Console. It takes time, so back up the keystore and both passwords today."],
      ["A policy notice says the Data safety form does not match app behavior","An SDK, often analytics, crash reporting or ads, collects device or usage identifiers you did not declare","Re-run the dependency and network inventory, read that SDK's disclosure page, and update both forms together."]
    ],
    challenge:"Write a release-gate script that reads ./gradlew :app:dependencies output and the merged manifest, extracts every SDK and permission, and compares them with a committed 'approved inventory' file. It fails if anything new appears. Wire it into your Lab 4 CI so a new SDK cannot ship without someone updating the inventory and both privacy forms. Then add a test dependency on purpose and confirm the gate catches it.",
    reflect:[
      "Why does Play App Signing separate the upload key from the app signing key? What does that buy you if your laptop is stolen?",
      "Why must the Data safety form and the App Privacy label agree with each other and with your code? Who is harmed when they do not?",
      "What crash-free gate would you set for a 1% rollout that reaches only 200 users, and why can such a small sample mislead you in both directions?"
    ],
    safety:"Your upload keystore and its passwords are the only way to update this app without a slow reset. Keep two backups, one of them offline. Do not upload real personal data while testing, and remove test accounts from the tester list when you are done."
  }
});

/* p40 Game Development, Graphics & Simulation */
Object.assign(window.LABX,{
  "p40lab1":{
    time:"two sessions of 2–3 h",
    setup:[
      "Python 3.12 or later from python.org, in a virtual environment: python -m venv .venv, activate it, then python -m pip install pygame-ce numpy matplotlib. Do not install pygame and pygame-ce side by side, because both use the import name pygame.",
      "Or Godot 4.x (stable, from godotengine.org). Set Project Settings > Physics > Common > Physics Ticks per Second to 120, and turn on physics interpolation (2D support arrived in 4.3). Godot's Max Physics Steps per Frame setting is its built-in clamp.",
      "A git repository with three files planned: game.py (the loop), frames.csv (log output) and plot.py (analysis). Close heavy background apps so frame times reflect your game."
    ],
    checkpoints:[
      "python -c \"import pygame\" prints a 'pygame-ce' banner with the SDL and Python versions. The window opens and the ball moves and bounces.",
      "A debug overlay or log shows physics steps per frame (about 2 at 60 fps rendering with DT = 1/120) and alpha always between 0 and 1. Motion looks smooth, not stepped.",
      "frames.csv has one row per frame for 60 s (about 3,600 rows at 60 fps). plot.py saves a PNG and prints the median and 99th-percentile frame time in ms.",
      "With a 120 ms sleep every 5 s, the plot shows spikes of about 120 ms. The log shows a burst of about 14 catch-up steps after each one, and the ball never passes through a paddle. Without the clamp, with 400 ms stalls and an expensive step, steps-per-frame and the accumulator grow frame after frame until the game freezes.",
      "A table of measured ball speed (px/s) and bounce positions for fixed-step and variable-step at a 30 fps cap and uncapped. Fixed-step values match across frame rates; variable-step values drift."
    ],
    hints:[
      "Separate two clocks: real time, which arrives in uneven chunks, and simulation time, which advances only in equal DT steps. The accumulator is the debt between them.",
      "Measure frames with time.perf_counter(), not clock.tick() (which returns whole milliseconds). Clamp each measured frame with min(frame, 0.25) before adding it to the accumulator. Keep prev and cur states so you can render between them.",
      "Shape: acc += min(now - last, 0.25); while acc >= DT: prev = cur; cur = step(cur, DT); acc -= DT. Then alpha = acc / DT, and render lerp(prev, cur, alpha). To see a real spiral of death, the step must cost real time: add a short busy-wait inside step() so 120 steps cost more than one second of wall time."
    ],
    trouble:[
      ["The motion stutters even with a fixed step","You render cur instead of the interpolated state, or compute alpha before the inner while loop","Compute alpha after the loop and render lerp(prev, cur, alpha). Log alpha to confirm that it sweeps from 0 to 1."],
      ["All frame times are exactly 16 or 17 ms","clock.tick() returns whole milliseconds","Use time.perf_counter() deltas, logged as floats in ms with three decimals."],
      ["No spiral of death appears without the clamp; the game just catches up","Your step is so cheap that 48 catch-up steps take microseconds","The spiral needs step cost × steps per second > 1 s. Add an artificial cost to step() and log steps-per-frame and the accumulator so you can see them grow."],
      ["The ball tunnels through the paddle in the variable-step version","With a large dt, the ball moves farther than the paddle is thick in one step","This is the expected result. Record it. Fix it in the fixed version with a smaller DT or a swept test against the paddle's line."],
      ["'pygame 2.x' banner instead of pygame-ce, or odd import errors","Both packages are installed in the same environment","Run pip uninstall pygame pygame-ce, reinstall pygame-ce only, and check with pip list."]
    ],
    challenge:"Make the simulation deterministic and prove it. Record the input for every step index to a file, then replay it at 30 fps and uncapped, and print a hash of the final state (rounded positions and velocities) for each. The hashes must match. Do the same with the variable-step version and show that they diverge. Explain in two sentences why fixed-step simulation is what makes replays, rollback netcode and lockstep multiplayer possible.",
    reflect:[
      "Why does clamping trade wall-clock accuracy for stability? What does the player see during a clamped 400 ms stall?",
      "Why interpolate between states instead of running one more physics step? How much display latency does interpolation add?",
      "What would change in feel, CPU cost and collision accuracy if DT were 1/30 s instead of 1/120 s?"
    ]
  },

  "p40lab2":{
    time:"three or four sessions of 2–3 h",
    setup:[
      "Godot 4.x (stable) or Unity 6 LTS installed through Unity Hub (Personal licence, free under the revenue threshold). Use 2D physics only.",
      "Free placeholder art: a character sheet with idle, run, jump, fall and land frames (Kenney.nl assets are CC0), and one tileset. Polish comes later.",
      "A git repository with a saves/ folder that holds a hand-written v1 save file as a test fixture, plus a tuning.md with an empty table: h, t, g, v0, fall multiplier.",
      "Two testers who will play for 5 minutes twice: before and after the feel changes."
    ],
    checkpoints:[
      "The tuning table has your chosen h and t and the derived g and v0. In game, a debug log of the maximum height and the time to apex matches h within a few pixels and t within one physics tick.",
      "Walking off a ledge and jumping within 0.1 s works (the log prints 'coyote jump'). Pressing jump just before landing fires on touchdown (the log prints 'buffered jump'). A tap and a hold produce two clearly different heights. Notes from two testers, before and after, are saved.",
      "A debug label shows the current animation state. You can trigger Idle → Run → Jump → Fall → Land → Idle, and the walk-to-run blend follows speed. The state-machine diagram is exported.",
      "The save file holds a 'version': 2 field. Killing the game mid-save leaves either the old file or the new one intact, never a truncated one. Loading the v1 fixture produces a valid v2 save with defaults filled in.",
      "During sustained firing, the Unity Profiler's GC Alloc column reads 0 B per frame in PlayerLoop, or Godot's Object and Node counts stay flat in Debugger > Monitors."
    ],
    hints:[
      "Choose the feel first (how high, how long to the top) and derive the physics from it. Never tune gravity by trial and error.",
      "From constant-acceleration kinematics: v0 = g·t and h = v0·t / 2, so g = 2h / t² and v0 = 2h / t. Multiply g by about 1.5–2 only while falling. Coyote time and the jump buffer are just two timers that count down each physics tick.",
      "Save: write to save.tmp, flush and close, then rename it over save.json. Migrations: while data.version < CURRENT, apply migrations[data.version](data). Pool: create N projectiles at start, then toggle them active and inactive instead of Instantiate/Destroy or instantiate/queue_free."
    ],
    trouble:[
      ["The character jitters, sinks into the floor, or is_on_floor() flickers","Movement runs in _process or Update, or the floor is checked before move_and_slide()","Move only in _physics_process or FixedUpdate. Call move_and_slide() first, then read is_on_floor()."],
      ["Jump height changes with frame rate","Gravity is added per frame without multiplying by delta","Apply velocity.y += g * delta inside the physics callback only."],
      ["Unity warns that 'Rigidbody2D.velocity' is obsolete","Unity 6 renamed it to linearVelocity","Use rb.linearVelocity and set it in FixedUpdate. Read input in Update and store it for the next FixedUpdate."],
      ["The animation sticks in Jump or flickers between Fall and Land","Transition conditions overlap, exit-time settings conflict, or the grounded flag is noisy","Make the conditions mutually exclusive, turn off exit time where the transition is condition-driven, and debounce grounded for one or two ticks."],
      ["GC Alloc is still above 0 B with pooling in place","String concatenation in the HUD, LINQ, boxing, Debug.Log calls, or profiling inside the Editor","Sort the Profiler Hierarchy by GC Alloc and turn on allocation call stacks to find the line. Check in a development build, because the Editor allocates on its own."]
    ],
    challenge:"Write a save-corruption drill. A test truncates the save file at 20 random byte offsets and flips random bytes in 20 more copies. For every damaged file, the loader must detect the problem (JSON parse failure or a checksum you add), fall back to the previous good save kept as save.bak, and never crash. Then add a v2 → v3 migration (rename a field, split settings into audio and controls) and prove that the full chain v1 → v2 → v3 works from your original fixture.",
    reflect:[
      "Why derive gravity from h and t instead of tuning it by feel? What happens to your tuning if the physics tick rate changes?",
      "Why does write-to-temp-then-rename protect a save from a crash or power cut, and what failure does it not protect against?",
      "Coyote time and jump buffering are physically unrealistic. Why do they make the game feel fairer?"
    ]
  },

  "p40lab3":{
    time:"two sessions of 2–3 h",
    setup:[
      "Godot 4.x with a 2D scene (one enemy sprite) and a 3D scene (a sphere or a model, one directional light). Or Unity 6 with URP and Shader Graph.",
      "A noise texture for the dissolve: in Godot, a NoiseTexture2D resource with FastNoiseLite; in Unity, any grayscale noise PNG.",
      "RenderDoc from renderdoc.org (free) for the frame capture. Godot's Forward+ and Mobile renderers use Vulkan, which RenderDoc captures well. In Unity, Window > Analysis > Frame Debugger does the same job.",
      "A screenshot folder named by step and exponent (n8.png, n32.png, n128.png)."
    ],
    checkpoints:[
      "On damage, only the hit enemy flashes to the flash color and fades back within about 0.1–0.2 s, driven from code by setting the shader parameter. Other enemies that share the sprite do not flash.",
      "Animating the dissolve threshold from 0 to 1 removes the sprite progressively, with a glowing band along the cut edge. It is fully visible at 0 and fully gone at 1.",
      "Three screenshots at n = 8, 32 and 128: the highlight shrinks and sharpens as n grows. The side facing away from the light is dark, with no negative light and no specular there.",
      "A RenderDoc capture (or Frame Debugger list) with draw counts for 1,000 separate mesh nodes and for one instanced draw (MultiMeshInstance3D or GPU instancing). The counts are noted per render pass: depth prepass, shadows, opaque."
    ],
    hints:[
      "A fragment shader runs once per pixel and knows only its inputs: UV, textures and the uniforms you send. To make an effect respond to gameplay, change a uniform from your script.",
      "The flash is a mix() toward a color by an amount. The dissolve compares a noise sample with a threshold, discards below it, and colors a thin band just above it with smoothstep. Blinn–Phong uses the half vector between the light and view directions.",
      "Key lines: COLOR.rgb = mix(COLOR.rgb, flash_color.rgb, flash_amount); if (n < threshold) { discard; }; vec3 H = normalize(LIGHT + VIEW); float spec = pow(max(dot(NORMAL, H), 0.0), shininess); and Lambert is max(dot(NORMAL, LIGHT), 0.0). In Godot, put the lighting in the light() function of a spatial shader and start from the skeleton in the docs."
    ],
    trouble:[
      ["Every enemy flashes when one is hit","They all share one material resource","Make the material unique per instance (Resource > Local to Scene in Godot, or duplicate it in code). In Unity, use a MaterialPropertyBlock."],
      ["Shader error such as 'Invalid arguments to operator' or a type mismatch","The Godot shader language has no implicit int-to-float conversion","Write float literals with a decimal point (1.0, not 1) and match vector sizes explicitly."],
      ["A specular highlight appears on the dark side, or the lighting looks inverted","Vectors are not normalized, or specular is not masked where N·L ≤ 0","Normalize N, L and V, and multiply the specular term by step(0.0, dot(N, L)) or skip it when N·L is zero."],
      ["RenderDoc shows 'no API frames' or cannot capture","You attached it to the editor instead of the running game, or the wrong graphics API is active","Launch the game executable (or Godot with your project path) from RenderDoc, or turn on 'Capture child processes', and use a Vulkan or D3D renderer."],
      ["Draw calls do not drop after turning on instancing in Unity","The SRP Batcher handled the objects instead, or the materials differ (renderer.material creates copies)","Read the Frame Debugger's 'why this draw call can't be batched' note, use sharedMaterial, or draw with Graphics.RenderMeshInstanced."]
    ],
    challenge:"Make Blinn–Phong energy-conserving by multiplying the specular term by (n + 8) / (8π). Compare n = 8, 32 and 128 again and describe how the brightness of the highlight now behaves. Then measure fill-rate cost: stack 300 overlapping full-screen dissolve quads and record GPU frame time (RenderDoc's timing or the engine's GPU profiler) with discard, and again with alpha blending instead. Explain the difference in terms of early depth testing and overdraw.",
    reflect:[
      "Why does discard make the dissolve possible, and why can it disable early depth testing and cost performance on some GPUs?",
      "Why does a larger exponent give a smaller highlight? What physical surface property is n standing in for?",
      "Why does instancing cut draw calls, and what must the instances share for it to work?"
    ]
  },

  "p40lab4":{
    time:"two sessions of 3 h",
    setup:[
      "Python 3.12+ with numpy and matplotlib in a virtual environment (or pygame-ce from Lab 1 for live visualization). Use the standard library heapq for the priority queue.",
      "Unity 6 with the AI Navigation package (com.unity.ai.navigation, from the Package Manager), or Godot 4.x with NavigationRegion3D and NavigationAgent3D. Build a small 3D level from boxes: a floor, walls, a ramp.",
      "A fixed random seed for every grid and cave you generate, so your node counts can be reproduced."
    ],
    checkpoints:[
      "The visualization shows walls, the closed set, the open set and the final path in different colors. The path never cuts a wall corner diagonally, and the printed cost uses 1 for straight moves and √2 for diagonals.",
      "A table for one fixed start, goal and map: Dijkstra (h = 0), octile and 2 × octile, each with nodes expanded and path cost. Dijkstra and octile report the same cost, octile expands fewer nodes, and 2 × octile expands the fewest but may cost more.",
      "The agent walks across the baked navmesh around obstacles and up the ramp, and the navmesh debug view is visible in a screenshot. Your notes compare its polygon (or triangle) count with the 2,500 cells of a 50 × 50 grid.",
      "Cave images after each of the 4 passes. After flood fill only the largest region remains, and A* reports a path (with its cost) from the entrance to the exit, or the generator rerolls the seed until one exists."
    ],
    hints:[
      "A* is Dijkstra plus a guess of the remaining cost. For the path to be optimal, the guess must never overestimate the true cost.",
      "Push (f, tie_counter, node) onto a heapq and keep g in a dict. When you pop a node whose g is worse than the one already recorded, skip it as stale, and count an expansion only for non-stale pops. Block a diagonal move when either orthogonal neighbor is a wall.",
      "Octile heuristic: dx, dy = abs(x1 - x2), abs(y1 - y2); h = (dx + dy) + (sqrt(2) - 2) * min(dx, dy). Cave rule: count walls among the 8 neighbors, treat out-of-bounds as wall, and make the cell a wall if the count is 5 or more (and keep it a wall at 4). Flood fill with a BFS from every unvisited floor cell and keep the biggest region."
    ],
    trouble:[
      ["Octile A* returns a longer path than Dijkstra","Diagonal moves cost 1 instead of √2, or nodes are closed before their best g is known","Make the step costs and the heuristic use the same units, and handle stale heap entries instead of never reopening nodes."],
      ["The path slips between two diagonal wall corners","Diagonal moves are allowed when both orthogonal neighbors are blocked","Block a diagonal move if either orthogonal neighbor is a wall (no corner cutting)."],
      ["A 50 × 50 search takes seconds","The open set is a list searched with min() or pop(0), or membership is tested on a list","Use heapq for the open set and dicts or sets for g and closed. A 2,500-cell search should take milliseconds."],
      ["Unity warning 'Failed to create agent because it is not close enough to the NavMesh', or the Godot agent never moves","The navmesh was not baked, the agent starts off the mesh, or the agent radius is too large for the gaps","Rebake, place the agent on the blue mesh, reduce the agent radius, and in Godot check that the region's source geometry includes your level's meshes or colliders."],
      ["The cave has no path from entrance to exit","Entrance and exit fell in different regions, or one of them was filled","Place them after the flood fill, inside the largest region, or reroll the seed and log how many seeds failed."]
    ],
    challenge:"Run weighted A* with f = g + w·h for w from 1.0 to 3.0 in steps of 0.25 on 20 random caves. Plot the mean nodes expanded and the mean cost ratio (path cost ÷ optimal cost) against w, and check the theory that the cost ratio never exceeds w. Then implement Jump Point Search on the open-grid map and compare its expansions with octile A*. Explain why JPS gains so much on open maps and so little in twisty caves.",
    reflect:[
      "Why does an admissible heuristic guarantee an optimal path, and why does 2 × octile expand fewer nodes but risk a worse path?",
      "When is a grid the better choice than a navmesh, and when is it the reverse? Think about dynamic obstacles, memory and path quality.",
      "Why does the 45% fill with a 5-neighbor rule produce cave-like shapes, and what happens to connectivity at 40% and at 50%?"
    ]
  },

  "p40lab5":{
    time:"three sessions of 2–3 h",
    setup:[
      "Two machines you own on your home LAN, or two Linux VMs on one host-only or NAT network. One machine must be Linux for tc netem. Python 3.12+ for the raw-UDP route, or Godot 4.x (ENetMultiplayerPeer), or Unity 6 with Netcode for GameObjects.",
      "Pick one UDP port (for example 40000) and allow it only on your private network: sudo ufw allow from 192.168.0.0/16 to any port 40000 proto udp on Linux, or a private-profile rule in Windows Defender Firewall.",
      "A shared step(state, input, dt) function that the server and the client both import, so prediction uses exactly the same physics.",
      "A plain-text log format for the server: tick, client id, seq, accepted or rejected, reason."
    ],
    checkpoints:[
      "The server log prints about 30 ticks per second and accepted inputs with increasing seq per client. Duplicate or old seq numbers are logged as dropped. Two clients see each other move.",
      "At 0 ms added latency, the local player responds on the same frame as the key press. The remote player moves smoothly about 100 ms behind. A debug overlay shows the pending-input count and the size of the last correction.",
      "tc qdisc show dev lo lists netem delay 60ms, and ping 127.0.0.1 shows an RTT near 120 ms (the delay applies in each direction). A table and short clips record correction size and frequency at 0, 60 and 150 ms.",
      "The modified client's speed ×5 and rapid-fire inputs produce REJECT or CLAMP lines in the server log with a reason. Its player is snapped back on the other client's screen, and the honest client is unaffected."
    ],
    hints:[
      "The server is the only one who decides what happened. Clients send intentions (inputs with sequence numbers), never positions or hits.",
      "Every snapshot echoes the last input seq the server applied for that client. The client keeps every unacknowledged input. On each snapshot it resets to the server state, drops the acknowledged inputs, and replays the rest through the same step function.",
      "Remote interpolation: render_time = now - 0.100. Find snapshots s0 and s1 with s0.t ≤ render_time < s1.t, then alpha = (render_time - s0.t) / (s1.t - s0.t). Use the server's tick timestamps, not packet arrival times. Validation: clamp each move to max_speed × tick_dt and enforce a fire cooldown on the server."
    ],
    trouble:[
      ["Works on localhost but the other machine receives nothing","The server is bound to 127.0.0.1, or a firewall drops inbound UDP","Bind to 0.0.0.0, add the private-network firewall rule, and test the path with nc -u -l 40000 on one machine and nc -u <ip> 40000 on the other before blaming your code."],
      ["'OSError: [Errno 98] Address already in use'","An earlier server process is still holding the port","Find it with ss -ulpn | grep 40000 and stop it. Shut the socket down cleanly on exit."],
      ["The local player rubber-bands even at 0 ms","Client and server step differently (a different dt, input applied in a different order), or acknowledged inputs are replayed","Log the client's predicted state and the server's state at the same seq. The first seq where they differ shows the bug. Share one step function."],
      ["'Error: Exclusivity flag on, cannot modify.' from tc","A root qdisc already exists on lo","Use sudo tc qdisc change dev lo root netem delay 150ms, or remove it first with sudo tc qdisc del dev lo root."],
      ["The remote player stutters","The interpolation delay is shorter than the gap between snapshots (33 ms at 30 Hz) plus jitter, or arrival times are used","Keep at least two to three snapshot intervals of buffer (100 ms) and interpolate on server timestamps."]
    ],
    challenge:"Add 5% packet loss and 20 ms of jitter with netem (delay 60ms 20ms loss 5%). Make each input packet carry the last three inputs, so one lost packet does not lose an input, and have the server ignore any seq it has already applied. Measure how often the server misses an input before and after. Then add server-side lag compensation for a hitscan shot: keep one second of position history, rewind targets to the shooter's view time (RTT/2 plus the interpolation delay), and log whether each hit is confirmed.",
    reflect:[
      "Why must the server, not the client, own the truth? What does that cost the player at 150 ms?",
      "Why is the remote player shown in the past, and why is that acceptable for other players but not for your own character?",
      "Which cheats does server-side input validation stop, and which ones (aim assistance, seeing through walls) does it not touch?"
    ],
    safety:"Run every test, including the 'attack' with the modified client, only against your own server on machines you own. Never send crafted traffic to anyone else's game or server. netem on lo delays every local service on that machine, so remove it with sudo tc qdisc del dev lo root when you finish."
  },

  "p40lab6":{
    time:"two sessions of 2–3 h",
    setup:[
      "Unity 6 with a development build (Build Profiles > Development Build + Autoconnect Profiler) and the Profiler, Frame Debugger and Rendering module. Or Godot 4.x with Debugger > Profiler, Visual Profiler and Monitors.",
      "A test scene with three toggles on keys 1, 2 and 3. Each switches one planted problem on or off, so you can measure them separately and together.",
      "Turn vsync off (QualitySettings.vSyncCount = 0 in Unity; display/window/vsync/vsync_mode = Disabled in Godot) so frame time measures work, not waiting. Add a script that logs every frame's unscaled delta time to CSV, as in Lab 1.",
      "A results sheet with one row per configuration: median ms, p99 ms, main-thread ms, GPU ms, GC Alloc per frame, draw calls or batches."
    ],
    checkpoints:[
      "Each toggle changes the frame rate on its own, and with all three on the scene is clearly slow. The on-screen state shows which problems are active.",
      "A capture of 300+ frames from the development build. You recorded main-thread and GPU time, GC Alloc per frame, and draw calls (about 3,000+ with problem 2 on). The Hierarchy view sorted by time names the proximity method as the top self-time entry, or your notes say which problem dominates instead.",
      "After each single fix and a fresh capture: GC Alloc for the text drops to 0 B, draw calls or batches fall from thousands to a handful, and the proximity check falls from tens of ms to under 1 ms. Each fix is a separate commit.",
      "The before/after table holds median and p99 for the baseline and after each fix, from CSV logs of at least 30 s with the first few seconds discarded."
    ],
    hints:[
      "Measure before you fix, and fix one thing at a time. Otherwise you cannot tell which change helped.",
      "Compare main-thread time with GPU time. Whichever is larger is the bottleneck, and optimizing the other buys nothing. In the CPU Hierarchy, sort by Self ms for hot code and by GC Alloc for garbage.",
      "Fixes: update the text only when the value changes (cache the last value or use a non-allocating API). For the draws, use one shared material plus GPU instancing, or a MultiMesh in Godot. For proximity, a dictionary from (floor(x / r), floor(y / r)) to a list of objects, checking only the 3 × 3 neighboring cells. With cell size r, that cuts about 2 million pair checks to a few thousand."
    ],
    trouble:[
      ["Numbers in Play mode differ wildly from the build","The Editor adds its own overhead and allocations","Profile the development build attached to the Profiler, and report only build numbers."],
      ["Frame time is stuck at 16.7 ms no matter what you change","vsync or a target frame rate is capping the loop","Turn vsync off and set the target frame rate to unlimited, then confirm that frame time moves when you toggle a problem."],
      ["Deep Profiling makes everything slow and changes the ranking","Deep profiling instruments every method call and distorts timings","Use it only to find a call site. Time things with ProfilerMarker or Profiler.BeginSample regions, with deep profiling off."],
      ["Instancing made no difference to draw calls","Each renderer got its own material copy (renderer.material), or the SRP Batcher is batching instead","Use sharedMaterial, check 'Enable GPU Instancing' on that material, and read the Frame Debugger's reason for each unbatched draw."],
      ["p99 changes a lot between identical runs","Background apps, thermal throttling, or shader compilation in the first seconds","Warm up for 10 s, discard that part, run three times, and report the spread along with the median."]
    ],
    challenge:"Build a performance gate. A script runs the scene headless or in a development build for 30 s, writes median and p99 frame time to JSON, and exits non-zero if p99 exceeds an 8.3 ms budget (120 Hz). Run it in CI or from a local script. Reintroduce one planted problem and confirm the gate fails. Then move the proximity check to Unity's Jobs and Burst (or a compute shader, or a Godot GDExtension) and compare it with your spatial grid on 2,000, 10,000 and 50,000 objects.",
    reflect:[
      "Why do the median and the 99th percentile tell different stories, and which one does the player feel as stutter?",
      "Were your gains additive? Why might fixing the CPU problem reveal a GPU problem that was hidden before?",
      "At what object count did your grid start beating the brute-force O(n²) loop, and why is O(n²) sometimes the right choice?"
    ]
  },

  "p40lab7":{
    time:"one week, about 20–30 h in total",
    setup:[
      "An itch.io account, and a week-long jam that you have joined from itch.io/jams. Read its rules on team size, asset use, AI use, and post-deadline updates before you write any code.",
      "Your engine from the earlier labs (Godot 4.x or Unity 6), with web export templates installed. For Godot, consider a non-threaded web export, which avoids cross-origin isolation problems.",
      "butler, itch.io's upload tool, from itch.io/docs/butler. Run butler login once.",
      "A one-page pitch template (core verb, theme hook, one twist, cut list) and a daily plan with day-2 and day-3 gates."
    ],
    checkpoints:[
      "The jam page shows you as joined. A one-page pitch dated day 1 names the core verb, how it uses the theme, and at least three features you have already decided to cut.",
      "On day 2 you can play start → fail → restart. On day 3 one complete level exists. Notes from three playtesters record where each one got stuck or confused.",
      "butler status <user>/<game>:html5 shows your latest build. The game loads and plays in Chrome and Firefox on desktop and in a phone browser, and any issue is written down.",
      "Settings work: volume changes take effect immediately, a remapped key persists after a page reload, and the screen-shake toggle disables shake. The jam shows your entry as submitted with time to spare.",
      "A published postmortem quotes rating numbers and comments, and lists what went right, what went wrong and what you would cut."
    ],
    hints:[
      "The scope is the whole game. Pick one verb and one twist on the theme. Everything that is not the core loop by day 2 goes on the cut list.",
      "Make and upload a web build on day 2, not day 6. Platform problems (audio, input, loading) show up early that way. butler uploads only the changed bytes, so push daily.",
      "butler push <folder containing index.html> <user>/<game>:html5 --userversion 0.3. On the itch page, mark the upload 'This file will be played in the browser' and set the embed size. Only if you exported a threaded Godot build, tick the SharedArrayBuffer support option."
    ],
    trouble:[
      ["Godot web build is a black screen with a SharedArrayBuffer or cross-origin isolation error in the console","A threaded web export needs COOP/COEP headers","Export with thread support turned off (Godot 4.3+), or enable itch's SharedArrayBuffer option. Open the browser console (F12) first: the first red error usually names the cause."],
      ["Unity WebGL: 'Unable to parse Build/...framework.js.br! This can happen if build compression was enabled but web server hosting the content was misconfigured'","Brotli-compressed files are served without the matching header","Turn on Decompression Fallback in Player Settings > Publishing Settings, or switch the compression format."],
      ["No sound until the player clicks","Browser autoplay policy blocks audio before a user gesture","Add a 'click to start' screen and start or resume audio in that click handler."],
      ["itch.io says it cannot find index.html","The zip or folder has an extra parent directory","Push the folder that directly contains index.html, or zip its contents rather than the folder itself."],
      ["Unplayable on a phone","There are no touch controls, the canvas is bigger than the screen, or the keyboard-only menu cannot be used","Add on-screen buttons, enable the fullscreen button and a sensible embed size, and test on a phone on day 3, not day 7."]
    ],
    challenge:"Automate shipping. Add a GitHub Actions workflow that exports the web build (and a Windows or Linux build) headlessly with the engine's command-line export on every tag, then runs butler push with an API key stored as a repository secret, using separate channels per platform. Respect the jam's rule about updates during voting (use a separate post-jam page or channel if needed), and ship a post-jam patch that fixes the top three issues from the comments.",
    reflect:[
      "What did you cut, and was it the right call in hindsight? What signal told you?",
      "Why does an early web build reduce more risk than one more feature?",
      "What do jam ratings measure, and what do they miss compared with watching three people play?"
    ]
  }
});

/* p41 Quantum Computing */
Object.assign(window.LABX,{
  "p41lab1":{
    time:"3–4 h, plus queue time on the QPU",
    setup:[
      "Python 3.11 or later from python.org. Create and activate a virtual environment, then run python -m pip install 'qiskit[visualization]' qiskit-ibm-runtime qiskit-aer jupyterlab. The quotes stop your shell from expanding the brackets.",
      "An IBM Quantum Platform account at quantum.cloud.ibm.com with an Open Plan instance. Before you run anything, confirm the instance's plan is Open, not pay-as-you-go. The Open Plan gives up to 10 minutes of QPU time per rolling 28 days and allows job and batch modes, but not sessions.",
      "A notebook that never contains your API key. Save credentials once from a separate terminal Python session, and add .ipynb_checkpoints and any credential files to .gitignore.",
      "A results table ready: simulator counts, hardware counts, predicted forbidden fraction, measured fraction, standard error, job ID, QPU seconds."
    ],
    checkpoints:[
      "python -c \"import qiskit, qiskit_aer, qiskit_ibm_runtime; print(qiskit.__version__)\" prints a 2.x version with no import errors.",
      "Statevector(qc) prints amplitudes of about [0.707, 0, 0, 0.707]. With measure_all(), 4,000 AerSimulator shots give only '00' and '11', each within about ±65 of 2,000 (two standard deviations).",
      "~/.qiskit/qiskit-ibm.json exists. A fresh QiskitRuntimeService() with no arguments connects, and service.backends() lists real devices. Your notebook shows no key.",
      "The ISA circuit's count_ops() contains only native operations (for example rz, sx, cz and measure), and the layout names two physical qubits that are directly coupled.",
      "A written prediction, made before the run, with the numbers used: the CZ error for that pair, the readout error of each qubit, and the predicted fraction of 01 plus 10.",
      "The job ID and QPU seconds are recorded. The hardware counts include a few percent of 01 and 10. The measured fraction and its standard error sit next to the prediction, with a sentence on whether they agree within two standard errors."
    ],
    hints:[
      "The simulator is perfect, so any forbidden outcome on hardware comes from errors you can read from the calibration data before you run.",
      "Make an ISA circuit with generate_preset_pass_manager(optimization_level=2, backend=backend).run(qc). Get the physical qubits from isa.layout.final_index_layout(). Read the errors with backend.target['cz'][(a, b)].error and backend.target['measure'][(a,)].error.",
      "A first-order model: P(01 or 10) ≈ e_ro(a) + e_ro(b) + (2/3)·e_CZ. The 2/3 comes from a depolarizing error spreading over the four outcomes. Standard error = sqrt(p(1 − p) / 4000). Run SamplerV2(mode=backend).run([isa], shots=4000), print job.job_id(), and read counts with result[0].data.meas.get_counts()."
    ],
    trouble:[
      ["The Sampler rejects the job with an error that an instruction (such as h) 'is not supported by the target'","You submitted the abstract circuit, not the transpiled ISA circuit","Run the circuit through the preset pass manager for that backend and submit the result."],
      ["'Unable to find account' or a similar error when creating QiskitRuntimeService()","save_account never ran in this environment, or it saved under a different name or channel","Open ~/.qiskit/qiskit-ibm.json to see what was saved, rerun save_account with set_as_default=True, and keep the key out of the notebook."],
      ["KeyError when reading backend.target['cz'][(a, b)]","The pair is stored in the other order, or the two qubits are not coupled","Try (b, a), and take the pair from the transpiled layout rather than assuming qubits 0 and 1."],
      ["'ModuleNotFoundError: No module named qiskit_aer' in Jupyter, though pip says it is installed","The notebook kernel is not your virtual environment","Run python -m ipykernel install --user --name qiskit from inside the venv and choose that kernel. Always install with python -m pip."],
      ["The job sits in QUEUED for hours","The backend is busy; queue time is normal and free","Leave it. Retrieve the result later with service.job('<job id>').result(). Check usage on the platform's dashboard before you resubmit anything."]
    ],
    challenge:"Separate readout error from gate error. Run four calibration circuits (prepare 00, 01, 10 and 11, then measure) in one batch on the same two physical qubits, build the 4 × 4 confusion matrix, and invert it (or solve it with least squares) to correct your Bell counts. Report how much of the forbidden fraction was readout. If budget allows, repeat the Bell run on the backend's worst-calibrated coupled pair, chosen with initial_layout, and test whether the measured gap follows the calibration ranking.",
    reflect:[
      "Which error term dominated your prediction, and why is readout often a bigger source of error than the two-qubit gate on today's devices?",
      "Why does the transpiler choose particular physical qubits, and what would happen to the circuit if the chosen pair were not directly coupled?",
      "If your measurement missed the prediction by more than two standard errors, which assumptions could be wrong: calibration drift, crosstalk, decay during readout, or the first-order model itself?"
    ],
    safety:"The API key is a password tied to a billing account. Never paste it into a notebook you share or commit. If it leaks, revoke it on the platform at once. Keep to the Open Plan instance: a pay-as-you-go instance bills per second of QPU time."
  },

  "p41lab2":{
    time:"2–3 h",
    setup:[
      "The Lab 1 virtual environment with qiskit, qiskit-aer and qiskit-ibm-runtime, plus Jupyter.",
      "Know Qiskit's bit order before you start: in a counts key, qubit 0 is the rightmost character. With four qubits, use q0–q2 as inputs and q3 as the output, and measure only q0–q2 into three classical bits.",
      "Pick a fake backend from qiskit_ibm_runtime.fake_provider. FakeKingston if your version has it; otherwise list the module's contents and choose another Heron device."
    ],
    checkpoints:[
      "Four oracle functions return 4-qubit circuits. A classical truth-table check passes: for each of the 8 inputs, prepare x with X gates, apply the oracle, measure q3, and confirm that it equals f(x).",
      "The circuit drawing shows X then H on q3, H on q0–q2, a barrier, the oracle, H on q0–q2, and three measurements into three classical bits.",
      "Ideal results with 1,000 shots: f = 0 and f = 1 give {'000': 1000}. The three-bit parity gives {'111': 1000}. f = x0 gives {'001': 1000}, with qubit 0 on the right.",
      "The handwritten sum for f = x0 ⊕ x1 lists all eight signs (+, −, −, +, +, −, −, +) and shows that they add to 0, so the amplitude of |000⟩ is 0.",
      "A noisy table for all four oracles on the fake backend: the fraction of '000' for the constant ones (just under 100%) and the false '000' rate for the balanced ones (small but not zero)."
    ],
    hints:[
      "With the output qubit in |−⟩, 'flip the output when f(x) = 1' becomes 'multiply this input's amplitude by −1'. That is phase kickback, and it turns the oracle into a sign pattern over the inputs.",
      "Each balanced oracle you need is just CX gates from the inputs that appear in f to the output. f = 1 is a single X on the output, and f = 0 is no gates at all.",
      "After the final H layer, the amplitude of |000⟩ is (1/8)·Σ(−1)^f(x). That sum is ±1 for a constant f and 0 for a balanced f. For the noisy run, transpile with the fake backend's preset pass manager and pass the fake backend as the Sampler's mode, or use AerSimulator.from_backend(fake)."
    ],
    trouble:[
      ["A balanced oracle gives '000' on the ideal simulator","The output qubit is in |+⟩ (no X before H), so there is no kickback","Apply X and then H to q3 before the oracle, and check with Statevector that q3 is in |−⟩."],
      ["Counts keys have four bits, such as '1001'","measure_all() also measured the output qubit","Create a 3-bit classical register and measure only q0–q2 into it."],
      ["f = x0 shows '001' but you expected '100'","Qiskit prints bitstrings with qubit 0 on the right","Nothing is wrong. Record the convention in the notebook so your tables are unambiguous."],
      ["ImportError: cannot import name 'FakeKingston'","Your qiskit-ibm-runtime version does not ship that fake backend","Upgrade the package, or list fake_provider's contents and choose another Heron fake. Note which one you used."]
    ],
    challenge:"Write a generator for random balanced oracles on n inputs: XOR a random non-empty subset of the inputs into the output, wrapped in random X conjugations. Also write a random constant oracle. For n = 3 to 6, run 20 random oracles of each kind on the noisy fake backend. Plot the misclassification rate against n and against the transpiled two-qubit gate count. Compare with the classical deterministic worst case of 2^(n−1) + 1 queries, and note where a randomized classical algorithm with a few queries would already be good enough.",
    reflect:[
      "Why does preparing the output qubit in |−⟩ turn a bit-flip oracle into a phase oracle?",
      "What exactly is the speedup here, and why does it vanish against a classical randomized algorithm that tolerates a small error?",
      "Why does noise sometimes make a balanced function look constant, and how would repeating the circuit help you decide?"
    ]
  },

  "p41lab3":{
    time:"3–4 h, plus queue time",
    setup:[
      "The Lab 1 environment and a working QiskitRuntimeService on your Open Plan instance. Check how many QPU minutes you have left this window. One k = 2 job of 4,000 shots costs only seconds, but it needs to fit.",
      "A notebook section for each step and a table ready with columns k, theory, simulated, hardware. Remember that in '101', the characters are q2 q1 q0, so the 0 is on q1.",
      "Precompute the theory: θ = arcsin(1/√8) ≈ 0.3614 rad, and P(k) = sin²((2k + 1)θ)."
    ],
    checkpoints:[
      "The oracle alone, applied to a uniform superposition, gives a Statevector where every amplitude is +0.354 except |101⟩, which is −0.354.",
      "Simulated P('101') for k = 0, 1, 2 and 3 falls within about ±1.5 points of 12.5%, 78.1%, 94.5% and 33.1%. The standard error at 4,000 shots is under 0.8 points.",
      "For your second marked state, only the X gates of the oracle changed, and the peak at k = 2 lands on the new state near 94.5%.",
      "For the k = 2 circuit transpiled to the real backend, you recorded the two-qubit gate count, the two-qubit depth and the chosen physical qubits, with a fixed seed_transpiler so the numbers are reproducible.",
      "The hardware job ID and P('101'), plus the next three most common outcomes, sit beside 94.5% (ideal) and 12.5% (random guess)."
    ],
    hints:[
      "Each Grover iteration rotates the state toward the marked state by 2θ. Once it passes the target, it keeps rotating and moves away. That is the overshoot at k = 3.",
      "Oracle: X gates map |101⟩ to |111⟩, CCZ flips the sign of |111⟩, and the same X gates undo the mapping. Diffusion is a reflection about the uniform state: H on all, X on all, CCZ, X on all, H on all.",
      "Build CCZ as H on q2, then CCX(q0, q1, q2), then H on q2: the H gates go on the target, never a control. Optimal k ≈ (π/4)·√8 − 1/2 ≈ 1.72, so k = 2. Two-qubit depth: isa.depth(lambda inst: inst.operation.num_qubits == 2)."
    ],
    trouble:[
      ["The peak appears on the wrong state, such as '101' showing up as a different string","X gates were placed by reading the bitstring left to right","In Qiskit, the rightmost character is q0. For '101', the zero is on q1."],
      ["P('101') does not grow with k, or shrinks from the start","The diffusion operator is wrong: missing X layers, or the H gates on the CCZ are on a control","After one iteration, check with Statevector that the marked amplitude has magnitude about 0.884 (the square root of 0.781)."],
      ["Transpiled gate counts change on every run","Stochastic layout and routing","Pass seed_transpiler=<fixed number> and record it. Try optimization_level 3 and keep the circuit with the fewest two-qubit gates."],
      ["The hardware result is close to 12.5%, almost random","Dozens of two-qubit gates multiply the error past the useful limit","This is a valid finding. Estimate success ≈ (1 − e_2q)^N2q × readout fidelity and compare it with what you measured, instead of resubmitting jobs."]
    ],
    challenge:"Scale to four qubits (N = 16). Build a multi-controlled Z, predict the optimal k = 3 with θ = arcsin(1/4), where P = sin²(7θ) ≈ 96%, and verify on the simulator. Then run k = 1, 2 and 3 on the noisy fake backend and find the k where noisy success actually peaks. Explain why the best k under noise is smaller than the ideal one, using the transpiled two-qubit count of each circuit.",
    reflect:[
      "Why does success fall after k = 2, and how is that different from a classical search, which never gets worse with more effort?",
      "Why does a three-qubit textbook circuit become dozens of two-qubit gates on hardware, and what drives that number?",
      "With your measured gate count, what two-qubit error rate would you need for hardware success to reach 62.5%, five times better than guessing?"
    ],
    safety:"Run only one hardware job, and only after the simulator results are right. Confirm that the instance is the Open Plan before you submit, because pay-as-you-go instances bill per QPU second."
  },

  "p41lab4":{
    time:"3–4 h",
    setup:[
      "The Lab 1 environment plus scipy and matplotlib (python -m pip install scipy matplotlib).",
      "Build the Hamiltonian from the lab's coefficients with SparsePauliOp.from_list. Remember that Qiskit Pauli labels read right to left: 'IZ' puts Z on qubit 0.",
      "Get the exact answer first with numpy.linalg.eigvalsh(H.to_matrix()). Its lowest eigenvalue is your target, about −1.8573 Ha electronic, so you know when VQE is right.",
      "Optional hardware run: check your remaining Open Plan minutes. Plan a single Estimator evaluation at the final parameters, not an optimization loop on the QPU."
    ],
    checkpoints:[
      "print(H) shows five Pauli terms with the given coefficients, and eigvalsh gives a lowest value of about −1.8573 (−1.1373 after adding the nuclear repulsion of about 0.7200 Ha).",
      "The ansatz drawing shows its parameter count (for example 4 to 8). One evaluation at random parameters returns an energy above −1.8573, as the variational principle requires.",
      "The convergence log and plot show the energy falling and flattening near −1.857 within a few hundred COBYLA evaluations.",
      "The final error |E_VQE − E_exact|, expressed in millihartree, is below 1.6 mHa and stated next to the chemical-accuracy line.",
      "The noisy-simulator energy is noticeably higher than the noiseless one. If you ran hardware, the energies at resilience levels 0 and 1, with job IDs, show what readout mitigation recovered."
    ],
    hints:[
      "The quantum part only evaluates ⟨ψ(θ)|H|ψ(θ)⟩. The classical optimizer chooses the next θ. Write that as one Python cost function and keep everything else outside it.",
      "Start small: real_amplitudes(2, reps=1) or efficient_su2(2, reps=1) from qiskit.circuit.library is enough for this problem. Log every energy inside the cost function so the plot comes for free.",
      "cost = lambda x: float(est.run([(ansatz, H, x)]).result()[0].data.evs), with est = StatevectorEstimator(), then minimize(cost, x0, method='COBYLA', options={'maxiter': 500}). For noisy or hardware runs, transpile the ansatz to an ISA circuit and use H.apply_layout(isa.layout) as the observable."
    ],
    trouble:[
      ["The VQE energy comes out below the exact −1.8573","A sign or Pauli-label order error in H, or you are comparing against a different reference value","A noiseless energy below the exact ground state is impossible, so it always means a bug. Rebuild H, print it, and compare against eigvalsh of the same object."],
      ["COBYLA stops at about −1.05 or −1.83 and stays there","A poor starting point, or an ansatz that cannot reach the ground state","Try five random starts and keep the best, add one more rep, and plot every run on the same axes."],
      ["ValueError about the circuit and observable having different numbers of qubits","After transpiling to a 156-qubit device, the 2-qubit observable no longer matches","Map the observable with H.apply_layout(isa.layout) before calling the Estimator."],
      ["Hardware Estimator use burns through QPU time","Each optimizer evaluation was sent as its own job","Optimize on the simulator. Send only the final parameters to hardware, in one job, at both resilience levels."],
      ["Noisy energies jump around between identical runs","Shot noise in the estimator","Increase default_shots or set a precision target, and quote the standard error with every energy."]
    ],
    challenge:"Compare optimizers under shot noise. Use an Aer Estimator with 1,000 shots and run COBYLA, SPSA (write it yourself in about 20 lines, or use a library implementation) and L-BFGS-B with parameter-shift gradients. Plot energy against the number of circuit evaluations, and report how many evaluations each needed to reach chemical accuracy, if it ever did. Explain why SPSA, which needs only two evaluations per step regardless of parameter count, is popular on real hardware.",
    reflect:[
      "Why does the variational principle let you trust that a lower energy is a better answer, and when can a noisy estimate appear to break that rule?",
      "Why did noise push your energy up rather than down?",
      "What changes when the molecule needs 20 qubits: the number of Hamiltonian terms, the measurement cost, and the optimizer's behavior (think about barren plateaus)?"
    ],
    safety:"If you run on hardware, use the Open Plan instance only and submit one job per resilience level. An optimization loop on a pay-as-you-go instance could cost real money in minutes."
  },

  "p41lab5":{
    time:"3–4 h",
    setup:[
      "The Lab 1 environment plus numpy, scipy, pandas and matplotlib. Import NoiseModel, depolarizing_error, thermal_relaxation_error and ReadoutError from qiskit_aer.noise.",
      "Decide your basis now: transpile every circuit to basis_gates=['cz', 'rz', 'sx', 'x'] so that the noise you attach to 'cz' actually applies. Check count_ops() after transpiling.",
      "Use 10,000 shots for the GHZ grid so shot noise (about ±0.5 points) is smaller than the effects you want to fit.",
      "Keep time units consistent for T1 and T2. Choose microseconds or nanoseconds and use them everywhere."
    ],
    checkpoints:[
      "Printing each NoiseModel lists 'cz' among the noisy instructions and a readout error on all qubits. With p = 0, a 2-qubit GHZ gives a population of about 0.970 (0.985²), so readout is the only error.",
      "A 7 × 4 table (n = 2 to 8, four p values). At p = 0 the population tracks 0.985^n (about 0.886 at n = 8). At p = 0.05 and n = 8 it drops to roughly 0.6.",
      "A fit of log(population) against n gives estimates of p and e_ro with uncertainties, next to the true values, plus a residual plot. You note any systematic deviation and why it might exist.",
      "The T1 plot shows P(1) decaying with delay. The fitted T1 is within a few percent of the value you set, with the baseline offset that readout error causes.",
      "For one GHZ size, the result from NoiseModel.from_backend(FakeKingston()) sits next to your simple model's prediction using that backend's median CZ and readout errors, with the difference explained."
    ],
    hints:[
      "Noise attaches only to gate names you register. If the transpiled circuit says 'cx' and your noise is on 'cz', nothing happens.",
      "Write ghz(n) (H on qubit 0, then a CX chain) and run(n, p) returning the population P(0…0) + P(1…1). Collect the results in a DataFrame. A straight-line fit is more stable than fitting the exponential directly.",
      "log P = (n − 1)·log(1 − p) + n·log(1 − e_ro). Rearranged, that is a line in n with slope log(1 − p) + log(1 − e_ro) and intercept −log(1 − p), so you can solve for both. For T1: append thermal_relaxation_error(T1, T2, t) as an instruction after X (a QuantumError can be appended like a gate, or attached to an 'id' gate per delay), then fit P1(t) = A·e^(−t/T1) + B."
    ],
    trouble:[
      ["The population is 100% (or exactly the readout value) for every p","The noise is on 'cz' but the circuit runs 'cx'","Transpile with basis_gates=['cz', 'rz', 'sx', 'x'] and print count_ops() before running."],
      ["NoiseError: 'Invalid T_2 relaxation time parameter: T_2 greater than 2 * T_1.'","Physics requires T2 ≤ 2·T1","Pick, for example, T1 = 200 µs and T2 = 150 µs."],
      ["curve_fit says 'Optimal parameters not found' or returns absurd values","No starting guess, or mixed units (seconds and microseconds)","Pass p0=[1.0, 100.0, 0.0] in microseconds and use the same units in the data and the model."],
      ["The FakeKingston run is very slow","The circuit was not transpiled, or the full device noise model is being simulated on far too many shots","Transpile to the fake backend first so only the active qubits are simulated, and start with 2,000 shots."]
    ],
    challenge:"Population is not fidelity. Add a pure dephasing model with phase_damping_error, and measure GHZ coherence with parity oscillations: apply a phase rotation φ to every qubit, measure in the X basis, and fit the amplitude of the parity signal against φ. Show that the population stays high while coherence collapses as dephasing grows. Then estimate GHZ fidelity as (population + coherence) / 2 and compare it with the population-only number.",
    reflect:[
      "Why does GHZ population fall roughly exponentially with n, and what physical quantity does the base of that exponential represent?",
      "Which errors leave the GHZ population unchanged, and why is reporting population alone as 'fidelity' misleading?",
      "Why does a backend-derived noise model differ from your uniform model even when their average error rates are the same?"
    ]
  },

  "p41lab6":{
    time:"2–3 h",
    setup:[
      "Python 3.11+ with numpy, scipy and matplotlib in a virtual environment. No quantum SDK is needed: this is a classical simulation of the protocol's statistics.",
      "Use rng = np.random.default_rng(<seed>) for every random draw so tables are reproducible. Change the seed to get error bars.",
      "Write the binary entropy function h(Q) and test it before using it: h(0.5) = 1, h(0.11) ≈ 0.50, and h(0) = 0 by definition."
    ],
    checkpoints:[
      "With no noise and no Eve, the sifted key length is about 5,000 (± about 100) and Alice's and Bob's sifted keys are identical (0 mismatches).",
      "With 2% channel error, the QBER estimated from a random 10% sample is about 2% ± 0.6 points. The sampled bits are removed from the key before it is used.",
      "The plot of QBER against f from 0 to 1 is a straight line from about 2% to about 26%, with a fitted slope near 0.24–0.25.",
      "A table per scenario lists Q, h(Q), r = 1 − 2h(Q) and the final key length. Every scenario with Q above 11% is marked ABORT with zero key.",
      "Optional: the Toeplitz output has length floor(r·n). The same seed gives the same key, and flipping one input bit changes about half of the output bits."
    ],
    hints:[
      "Everything is array arithmetic. Sifting is a boolean mask where Alice's and Bob's bases match, and 10,000 photons need no Python loop.",
      "Model Eve as a measurement in the middle. For intercepted photons, Eve's bit equals Alice's where their bases match and is random elsewhere. She resends in her own basis, and Bob measures Eve's state using the same rule.",
      "h(Q) = −Q·log2(Q) − (1 − Q)·log2(1 − Q). r = 1 − 2h(Q) reaches zero at Q ≈ 0.110. Toeplitz matrix: scipy.linalg.toeplitz(col, row) with random 0/1 vectors of lengths m and n, then (T @ key) % 2."
    ],
    trouble:[
      ["QBER stays at the channel rate even with Eve at f = 1","Bob is measuring Alice's original state, not Eve's resent one","Chain the steps. Bob's outcome must depend on Eve's basis and bit for every intercepted photon."],
      ["QBER near 50%","Unsifted bits are being compared, or the arrays went out of alignment after removing the sample","Apply the sift mask to every array the same way, and compute sample indices on the sifted arrays only."],
      ["'RuntimeWarning: divide by zero encountered in log2' and nan in the table","h(Q) evaluated at exactly 0 or 1","Return 0 for Q in {0, 1}, or clip Q to a tiny epsilon before the logs."],
      ["The QBER-versus-f slope is about 0.5","Eve always measures in the wrong basis, or Bob's random outcome is not really random","Check the intermediate rates: Eve's basis should be wrong about 50% of the time, and Bob should err about 50% of the time when Eve's basis was wrong."]
    ],
    challenge:"Add error correction and count what it leaks. Implement the first pass of a Cascade-style protocol: split the key into blocks, compare parities in public, and binary-search each mismatched block. Count the parity bits revealed and subtract them, along with the 10% sample, from the final key length. Compare your measured leakage per bit with the ideal h(Q), and explain why r = 1 − 2h(Q) assumes perfect error correction.",
    reflect:[
      "Why does intercept-resend produce exactly 25% errors on the bits Eve touched?",
      "Why must Alice and Bob sacrifice a sample of the key, and how does the sample size trade key length against confidence in Q?",
      "If BB84 is provably secure, why does the post-quantum migration rely mainly on new mathematics (ML-KEM) rather than quantum key distribution?"
    ]
  },

  "p41lab7":{
    time:"two sessions of 2 h",
    setup:[
      "Paper and pencil for the worked examples. Python is fine for checking (for example, pow(7, x, 15)), but do the tables by hand first.",
      "Primary sources: Gidney's 2025 arXiv paper 'How to factor 2048 bit RSA integers with less than a million noisy qubits', a published logical-qubit estimate for elliptic-curve discrete logs (for example Roetteler et al., 2017), NIST FIPS 203/204/205, and Mosca's writing on quantum risk timelines.",
      "This app's Module 4 (Shor, QFT) and Module 7 (post-quantum migration), plus Domain 25's migration material.",
      "A plain-text file for drafts v1 and v2, so ADA can read it and you can diff the versions."
    ],
    checkpoints:[
      "Draft v1 has three labeled parts: the reduction from factoring to period finding, what the QFT does, and the classical post-processing (continued fractions, then the gcd). Each part contains at least one equation.",
      "Hand tables: for N = 15, a = 7, the powers 7, 4, 13, 1 give r = 4, and gcd(4 ± 1, 15) gives 3 and 5. For N = 21, a = 2, the powers 2, 4, 8, 16, 11, 1 give r = 6, and gcd(8 ± 1, 21) gives 7 and 3. At least one failure case (r odd, or a^(r/2) ≡ −1 mod N) is worked through, including the retry.",
      "The resource paragraph quotes about 1,400 logical qubits and Gidney's figure of under a million noisy qubits in under a week, with citations. It states the qubit estimate for elliptic curves (P-256) and explains in one sentence why Grover leaves AES-256 with about 128-bit security.",
      "Mosca's inequality x + y > z is written out with your own example numbers, and harvest-now-decrypt-later is defined in one sentence.",
      "ADA's three weakest points are pasted in, followed by a change list that maps each critique to a specific edit, and draft v2."
    ],
    hints:[
      "Start with the classical half. If a^r ≡ 1 (mod N) with r even, then (a^(r/2) − 1)(a^(r/2) + 1) ≡ 0 (mod N). Ask yourself why that hands you a factor unless something special happens.",
      "The quantum computer's only job is to find r. Put the first register in superposition over x, compute a^x mod N into a second register, and apply the QFT to the first. The outcomes then peak near multiples of 2^m / r, and continued fractions recover r.",
      "Failure cases worth working: N = 21 with a = 4 (r = 3, which is odd), and N = 15 with a = 14 (14 ≡ −1 mod 15, so a^(r/2) ≡ −1). Check each with [pow(a, x, N) for x in range(1, 10)]."
    ],
    trouble:[
      ["Your gcd comes out as 1 or as N","You hit the case a^(r/2) ≡ −1 (mod N), or you took gcd(a^r − 1, N), which is always N","This is expected, not a mistake: choose a new a and retry. Explain in the text why this happens with probability at most about one half."],
      ["ADA flags 'the quantum computer tries every factor at once'","A common misconception: superposition alone gives no speedup, because measurement returns one random outcome","Rewrite the explanation in terms of interference: the QFT makes the wrong answers cancel and the multiples of 1/r add up."],
      ["Sources disagree wildly (20 million qubits in one place, under a million in another)","Different years, error rates, cycle times, and physical versus logical qubit counts","Cite the primary papers by year and state their assumptions (gate error, cycle time, code) next to each number."],
      ["The draft runs to five pages","You are explaining modular-exponentiation circuits in detail","Cut back to the three ideas and the two worked examples. Point to the circuit details with a citation instead."]
    ],
    challenge:"Implement order finding for N = 15, a = 7 in Qiskit: quantum phase estimation with 8 counting qubits and a controlled multiply-by-7-mod-15 unitary. Use the textbook permutation circuit, or build the unitary from its permutation matrix. Run 2,000 shots on AerSimulator, convert each measured phase with fractions.Fraction(phase).limit_denominator(15), and report how many shots yield r = 4 and therefore the factors. Then run the same circuit on a noisy fake backend and measure how often the post-processing still succeeds.",
    reflect:[
      "Why is period finding hard classically but efficient with a QFT? What exactly does interference do to the wrong answers?",
      "Why do elliptic-curve keys fall to a smaller quantum computer than RSA keys of comparable classical strength?",
      "Using Mosca's inequality with your own numbers, which of your current data needs post-quantum protection first, and why?"
    ]
  }
});

/* p42 Radio & RF Engineering */
Object.assign(window.LABX,{
  "p42lab1":{
    time:"three sessions of 2 h over a week, plus a 24-hour unattended sweep",
    setup:[
      "An RTL-SDR Blog V4 with its telescopic dipole kit, and a USB extension cable to keep the dongle away from computer noise. The V4 needs the RTL-SDR Blog driver build: follow the quickstart at rtl-sdr.com. On Windows that means Zadig, choosing WinUSB for 'Bulk-In, Interface (Interface 0)'. On Linux, install the rtl-sdr-blog drivers and blacklist the dvb_usb_rtl28xxu kernel module.",
      "Software: SDR++ (releases on its GitHub page), readsb or dump1090-fa with tar1090, SatDump, rtl_433 and rtl_power (from the rtl-sdr package). A heatmap script for rtl_power CSV output, such as heatmap.py from the rtl-sdr-misc repository. Look4Sat on Android, or gpredict on a PC, for pass predictions.",
      "Look up the frequencies first: your local FM stations, your NOAA Weather Radio frequency (one of 162.400–162.550 MHz), your nearest airport's ATIS (it transmits continuously, which makes it ideal for a first air-band test), and the output frequency of your nearest 2 m repeater from a repeater directory.",
      "Run rtl_test before anything else. It should find the device and report no lost samples. Only one program can use the dongle at a time."
    ],
    checkpoints:[
      "A table for FM broadcast, NOAA, ATIS and the 2 m repeater: frequency, mode (WFM, NFM, AM, NFM), occupied bandwidth read from the waterfall (about 200 kHz, 10–16 kHz, 6–8 kHz and 10–16 kHz), and the level SDR++ shows. That level is relative dBFS, not calibrated dBm, so label it as such.",
      "tar1090 in your browser (for example http://localhost/tar1090 or the port your install uses) shows aircraft with range rings. You recorded the maximum range indoors and from the high point, and the computed radio horizon for 10 km altitude, about 410 km or more.",
      "SatDump's output folder for your recording contains MSU-MR channel images or a composite from the Meteor-M pass, with recognizable cloud or coastline, plus the pass time and maximum elevation.",
      "rtl_433 shows decoded readings (model, id, values) from devices you own. rtl_power produced about 24 hours of CSV, and the heatmap PNG clearly shows the FM band, the air band, NOAA, and whatever else lights up around your home.",
      "The two-page survey lists every identified signal with frequency, bandwidth, modulation, likely service and a reception-legality note, plus a separate list of signals you could not identify."
    ],
    hints:[
      "Prove the chain on the easiest, strongest signal first (FM broadcast in WFM). Then change only one thing at a time: frequency, mode, bandwidth. A signal demodulated in the wrong mode just sounds like noise.",
      "Radio horizon: d(km) ≈ 4.12 × (√h_rx + √h_tx), with heights in meters. For satellites, timing and antenna orientation matter more than gain. Mount the V-dipole horizontally with the V opening north or south, and record the whole pass from horizon to horizon.",
      "Useful commands: rtl_test; rtl_433 -f 433.92M -F json (try -f 915M too, which many US sensors use); rtl_power -f 24M:1766M:1M -g 30 -i 60 -e 24h sweep.csv, then python heatmap.py sweep.csv sweep.png. In SDR++, record baseband at 1 MS/s or more, then set SatDump's input format and sample rate to match the file."
    ],
    trouble:[
      ["'usb_claim_interface error -6' or 'Kernel driver is active, or device is claimed by second instance of librtlsdr'","The DVB-TV kernel driver grabbed the dongle, or another program (often SDR++ left running) holds it","Blacklist dvb_usb_rtl28xxu and replug the dongle. Close every other SDR program, then run rtl_test again to confirm."],
      ["The V4 tunes oddly, logs 'PLL not locked', or HF is missing","A generic distribution librtlsdr without V4 support","Remove the distribution package and install the RTL-SDR Blog driver build, then confirm that rtl_test identifies the R828D tuner."],
      ["FM stations or ghost carriers show up all over the air band and the 2 m band","The front end is overloaded by strong FM broadcast signals","Lower the gain until the spurs disappear but the wanted signal stays. Move the antenna, or add an FM band-stop filter. More gain is not more signal."],
      ["The Meteor pass decodes nothing, or SatDump never syncs","Wrong frequency for the satellite's current mode, mismatched sample rate or format, a low pass, or a bad antenna position","Check the satellite's current status page before the pass and choose passes above 30° elevation. Check that the constellation in SatDump forms four clusters, and match the recording format exactly."],
      ["The air band is silent","AM mode is not selected, or nobody is transmitting at that moment","Tune your airport's ATIS in AM with a bandwidth of about 8 kHz. It transmits continuously, so silence means a setup problem."]
    ],
    challenge:"Turn the station into a measured experiment. Run readsb 24/7 on a Raspberry Pi or an old laptop for three days and save tar1090's range outline. Then improve one thing: a 1090 MHz filter with an LNA, a homebrew coaxial collinear antenna, or a higher mounting point. Run another three days. Plot both range outlines on one polar chart, quantify the change in median and maximum range per sector, and explain each improvement with the link budget and the horizon formula.",
    reflect:[
      "Why did your ADS-B range fall short of the radio horizon, and which factor dominated: antenna, height, obstructions, cable loss or the transmitter?",
      "Why does the 137 MHz V-dipole beat the telescopic whip for weather satellites, and what does polarization have to do with it?",
      "Why does turning the gain up to maximum often make reception worse?"
    ],
    safety:"This lab is receive-only. In the US it is legal to receive broadcast, aviation, weather, amateur and satellite signals. Intercepting cellular calls is illegal, and you may not divulge or use the contents of private communications you happen to hear (47 U.S.C. 605 and the ECPA). Do not decode encrypted traffic, and do not publish identifiers of devices you do not own. When you go up high for range tests, avoid roofs and stay well clear of power lines with every antenna and mast."
  },

  "p42lab2":{
    time:"3–4 h",
    setup:[
      "GNU Radio 3.10 with RTL-SDR support. On Ubuntu or Debian: sudo apt install gnuradio gr-osmosdr soapysdr-module-rtlsdr. On Windows or macOS, radioconda (from its GitHub page) bundles everything. Do not mix pip, conda and apt installs of GNU Radio.",
      "The RTL-SDR from Lab 1, working with rtl_test, and the frequency of a strong local FM station.",
      "Before building anything, write the sample rate at every point of the chain on paper: 2.4 MS/s → ÷10 → 240 kS/s → WBFM ÷5 → 48 kHz audio.",
      "Headphones or speakers on a sound device that supports 48 kHz."
    ],
    checkpoints:[
      "The flowgraph runs and the station plays clearly. The console does not keep printing 'O' (source overflow) or 'aU' (audio underrun).",
      "Two screenshots: before the filter, a 2.4 MHz span with several stations; after it, a 240 kHz span with only your station's roughly 200 kHz-wide signal. One paragraph explains what the filter removed and why.",
      "Moving the QT GUI Range slider retunes live. For the File Sink you predicted 240,000 × 10 × 8 = 19,200,000 bytes and compared it with ls -l. With a Head block of 2,400,000 items, the size is exact; with a timed run, it is close.",
      "In the generated Python file you found fir_filter_ccf(10, firdes.low_pass(...)) and analog.wfm_rcv(quad_rate=..., audio_decimation=...). You changed the audio decimation, changed the audio sink rate to match, and noted what you heard."
    ],
    hints:[
      "Follow the sample rate through the graph. Every block's rate parameter must equal the rate actually flowing into it, or you get wrong-speed audio, overflows or silence.",
      "A complex float sample (gr_complex) is two 32-bit floats, so 8 bytes. File size = rate × seconds × 8. The decimating low-pass filter runs at the input rate (2.4 MS/s) and outputs one tenth of that.",
      "Settings: Low Pass Filter type 'Complex->Complex (Decimating)', sample rate samp_rate, cutoff 100e3, transition width 50e3. WBFM Receive with quadrature rate 240e3 and audio decimation 5. Audio Sink at 48000. The File Sink is connected after the filter, not after the source."
    ],
    trouble:[
      ["The console fills with 'OOOO'","The source is overflowing because the CPU cannot keep up, often because of GUI sinks","Lower the FFT size and update rate of the QT sinks, close other apps, or drop to 2.048 MS/s and recompute every rate."],
      ["'aUaUaU' and choppy audio","Audio underrun: the sink rate does not match the flowgraph, or the device does not like the rate","Set the Audio Sink to 48000, try the 'pulse' or default device name, and check that 240k ÷ 5 really equals the sink rate."],
      ["No RTL-SDR source block, or 'ModuleNotFoundError: No module named osmosdr'","gr-osmosdr is not installed for this GNU Radio's Python, or two installs are mixed","Use the Soapy RTLSDR Source block, or reinstall from a single package manager. Check with gnuradio-config-info --version."],
      ["The audio plays too fast or too slow","The audio decimation and the sink rate disagree","Make quad_rate ÷ audio_decimation equal the Audio Sink sample rate."],
      ["The I/Q file is ten times larger than predicted","The File Sink is wired to the source (2.4 MS/s), not after the filter","Move the connection to the filter output and run again."]
    ],
    challenge:"Rebuild the demodulator from primitive blocks. Replace WBFM Receive with Quadrature Demod (gain = quad_rate / (2π × 75 kHz)), then a 75 µs de-emphasis filter (the US standard), a low-pass at 15 kHz, and a Rational Resampler down to 48 kHz. A/B the audio against the WBFM block. Then play your recorded I/Q file back through the same chain with a File Source plus a Throttle block, and explain why the Throttle block is needed only when no hardware sets the pace.",
    reflect:[
      "Why must the low-pass filter come before decimation? What would aliasing do to your audio?",
      "Why does WBFM need around 240 kS/s of input when the audio is only 15 kHz wide? Use Carson's rule.",
      "What do you gain by recording I/Q instead of demodulated audio?"
    ]
  },

  "p42lab3":{
    time:"two sessions of 2–3 h",
    setup:[
      "Materials: about 1.2 m of 12 AWG solid copper (stripped THHN house wire works), a 1/2-inch PVC tee and short pipe, an SO-239 chassis connector or a direct coax feed, a few meters of 50 Ω coax (RG-58 or RG-8X), and adapters to the NanoVNA's SMA port and to the RTL-SDR.",
      "A NanoVNA (H or H4) with its open/short/load standards, ideally with NanoVNA-Saver on a PC so you can save sweeps. Calibrate at the end of the same coax you will use on the antenna.",
      "A common-mode choke at the feed point: snap-on ferrites, or 5–6 turns of coax about 10 cm across. Without it, your readings will move every time you touch the cable.",
      "Tools: tape measure, flush cutters, file, and safety glasses. Keep a trim log with columns: leg length, resonant frequency, SWR, |Z|, notes."
    ],
    checkpoints:[
      "Computation: 468 / 146.0 = 3.205 ft total, or about 19.2 in (48.8 cm) per leg. Cut 4% long, about 20.0 in (50.8 cm). A photo of the assembled antenna shows both measured leg lengths.",
      "After calibration, the load standard reads 50 Ω, SWR 1.0. The first sweep shows resonance (X = 0) below 146 MHz because the legs are long. Each trim gets its own row, and the final row shows resonance between 145.5 and 146.5 MHz with SWR under 1.5.",
      "An indoor-versus-outdoor table shows the resonance shift (usually downward near walls and objects) and the change in SWR and |Z|, with a one-paragraph explanation.",
      "With fixed gain and AGC off, SDR++ levels for the whip and the dipole, each averaged over at least 30 s and swapped several times. The measured difference sits next to the predicted 5–8 dB."
    ],
    hints:[
      "Long means resonance too low, and trimming moves it up. Trim both legs equally and in small steps, because you cannot add copper back.",
      "Frequency scales inversely with length: f_new ≈ f_old × L_old / L_new. Keep the cable route and your hands in the same place for every sweep, or the change you see may be the cable, not the antenna.",
      "To move from 141.0 to 146.0 MHz, scale the length by 141 / 146 ≈ 0.966, which is about 0.7 in off each 20-in leg. Take off half of that first and sweep again. Gain difference = dipole reading − whip reading in dB, expected around 2.15 − (−3 to −6) = 5.15 to 8.15 dB."
    ],
    trouble:[
      ["The SWR and resonance change when you touch or move the coax","Common-mode current on the outside of the shield (no balun)","Add a choke right at the feed point, route the coax away at 90° from the elements, and keep that route fixed."],
      ["SWR never goes below about 1.4–1.5, even at resonance","A dipole's feed impedance is about 70 Ω in free space, which is SWR 1.4 on 50 Ω coax, and nearby objects change it","This is physics, not a failure. Report the X = 0 frequency and |Z| as well as the SWR minimum. Check connectors before you blame the antenna."],
      ["The calibrated sweep looks impossible: SWR 1.0 everywhere, or a Smith chart trace that spirals","You calibrated at the NanoVNA port instead of the cable end, or changed the span after calibrating","Calibrate at the antenna end of the cable for 140–150 MHz, and recalibrate whenever you change the span."],
      ["After a trim, resonance jumped far above 146 MHz","Too much was cut at once","Splice a short extension onto both legs, or cut a new pair. Next time take half the computed amount and sweep again."],
      ["The RTL-SDR readings swing by several dB","Repeater fading, AGC, or changes in body position","Turn off AGC, use fixed gain, stand in the same spot, alternate antennas three or more times, and average each reading."]
    ],
    challenge:"Build a quarter-wave ground-plane antenna for 146 MHz with four radials. Sweep it with the radials horizontal and then drooped to about 45°, and record how the feed impedance moves toward 50 Ω. Compare its SWR bandwidth (the span with SWR under 2) and received level with your dipole, with both mounted vertically at the same height. Explain the impedance change in terms of the antenna's current distribution.",
    reflect:[
      "Why is a practical half-wave dipole shorter than a free-space half wavelength (the 468 versus 492 constant)?",
      "Why did resonance shift indoors near a wall, and what does that mean for placing an antenna in an apartment?",
      "Why is the X = 0 point not always where the SWR is lowest on your sweep?"
    ],
    safety:"Do not transmit into this antenna until you hold an amateur license, and then follow RF-exposure distances for your power level. Wear safety glasses when cutting and stripping wire, and file the sharp ends. Mount any outdoor test antenna well away from power lines."
  },

  "p42lab4":{
    time:"3–4 h",
    setup:[
      "Google Earth Pro (free) or another mapping tool with elevation, to get coordinates, ground elevations, distance and a terrain profile between two real points 1–5 km apart.",
      "A spreadsheet (LibreOffice Calc or Google Sheets) with an inputs block and a separate calculations block, so the formulas are visible and auditable.",
      "One real radio's datasheet listing TX power and receiver sensitivity per MCS and channel width, plus the antenna's gain and the cable loss per meter. Example numbers do not carry over from one radio to another.",
      "The current text of 47 CFR 15.247 and 15.407 from eCFR.gov, for the EIRP rules."
    ],
    checkpoints:[
      "Two points recorded with latitude, longitude, ground elevation and the distance between them (for example 3.12 km), plus a terrain-profile screenshot.",
      "A sanity check passes: 2.4 GHz at 3 km gives an FSPL of about 109.6 dB, and 5.8 GHz at 3 km about 117.3 dB. Show Formulas mode displays every formula.",
      "An MCS table per band gives the received power, sensitivity and fade margin for each MCS. The highest MCS with at least 20 dB of margin is highlighted for each band, at the channel width you chose.",
      "The obstruction row computes the line-of-sight height at the obstruction, Earth bulge, the obstruction's height and 60% of r1. It shows PASS or FAIL, and proposed mast heights turn every FAIL into a PASS.",
      "An EIRP check per band (conducted power + antenna gain − cable loss) sits next to the applicable limit, with CFR section numbers and the equipment-authorization note."
    ],
    hints:[
      "Work in decibels throughout: add gains, subtract losses. Sanity-check each formula against a known value before you trust the sheet.",
      "FSPL(dB) = 20·log10(d_km) + 20·log10(f_MHz) + 32.44. Received power = Ptx + Gtx − Ltx + Grx − Lrx − FSPL. First Fresnel radius r1(m) = 17.32·√(d1·d2 / (f_GHz·d)), with distances in km. Earth bulge h(m) ≈ d1·d2 / (12.74·k), with k = 4/3.",
      "Line of sight at the obstruction = h_A + (h_B − h_A)·d1/d, using total heights (ground plus mast). Require LOS − (obstruction + bulge) ≥ 0.6·r1, then raise the masts until it holds. Fade margin = Prx − sensitivity(MCS) ≥ 20 dB. At 3 km midpath, r1 is about 9.7 m at 2.4 GHz and about 6.2 m at 5.8 GHz."
    ],
    trouble:[
      ["The FSPL is off by about 60 dB","Units are mixed (Hz instead of MHz, m instead of km)","The 32.44 constant works only with km and MHz. Label the units in every input cell."],
      ["The FSPL values are wrong but plausible-looking","LN() was used instead of LOG10()","Use LOG10() everywhere for decibel math."],
      ["Every MCS passes with 40+ dB of margin","Antenna gain counted twice (EIRP plus gain), cable losses forgotten, or 20 MHz sensitivity used for an 80 MHz channel","Rebuild the received-power line term by term, and use the sensitivity for your channel width. Sensitivity gets about 3 dB worse each time the width doubles."],
      ["Fresnel clearance fails at 2.4 GHz but passes at 5.8 GHz","Lower frequencies have larger Fresnel zones","Expected behavior, not an error. It is one reason 5 GHz bands often win for point-to-point links."],
      ["The terrain profile shows clear ground, but trees block the view","Map elevation data is usually bare earth","Add surveyed tree and building heights as obstruction rows. Map data alone is not a clearance check."]
    ],
    challenge:"Invert the budget. For each MCS and band, solve for the maximum distance that still leaves 20 dB of margin, and chart range against data rate for both bands. Then rebuild one configuration in a vendor's free link-planning tool and reconcile every difference over 3 dB (antenna gains, sensitivity tables, clutter assumptions). Finally, add a mast-height optimizer: find the lowest equal mast height that clears 60% of r1 at both bands.",
    reflect:[
      "Why does 5.8 GHz lose more free-space path loss than 2.4 GHz with the same antenna gains, yet often win for point-to-point links? Think about what same-size antennas do to gain.",
      "Why is the rule 60% Fresnel clearance rather than simply 'I can see the other end'?",
      "Why design for a 20 dB fade margin, and what would you trade away to get it?"
    ],
    safety:"This is desk work. Do not climb roofs or towers to check a path. Working at height and near power lines requires training, fall protection and permission. Under Part 15, use only antennas the radio was certified with: an unapproved antenna can break the EIRP rules even when the conducted power is legal."
  },

  "p42lab5":{
    time:"3–5 weeks of daily 30-minute study, plus two 2-hour Meshtastic sessions",
    setup:[
      "A free HamStudy.org account set to the 2026–2030 Technician pool (in effect from July 1, 2026). The exam is 35 questions and you need 26 to pass. Aim for 30 in practice.",
      "FCC CORES at apps.fcc.gov/cores to register an FRN as an individual. Type the address yourself and do not follow emailed links. CORES asks for your SSN for individuals, which is a real FCC requirement.",
      "Two FCC-certified 915 MHz Meshtastic devices (for example Heltec V3, RAK WisBlock, LilyGO T-Beam or a SenseCAP tracker), each with its own 915 MHz antenna and a data-capable USB cable. Flash firmware at flasher.meshtastic.org in Chrome or Edge, then configure with the Meshtastic app or the Python CLI (python -m pip install meshtastic).",
      "A study log (date, minutes, aptitude score, weakest subelements) and a range table (distance, antenna height, RSSI, SNR, delivered yes/no)."
    ],
    checkpoints:[
      "HamStudy shows the 2026–2030 Technician pool selected, and the log has daily entries plus a weekly aptitude score and the two subelements (T1–T0) with the most misses.",
      "You can log in to CORES and see a 10-digit FRN. The FRN, login email and password are in your password manager.",
      "The VE session confirmation is 3–5 weeks out. Your notes list the fee, photo ID, FRN, an allowed calculator, remote requirements if any, and the rule that you pay the FCC's application fee in CORES within 10 days of the FCC's email or the application is dismissed.",
      "Three consecutive practice exams scored 30/35 or better, logged with dates. G1 and G2 have been read, with notes.",
      "Both nodes list each other. meshtastic --info shows region US and a primary channel that is not the default LongFast key. The range table covers three distances at two heights, with median RSSI and SNR for each."
    ],
    hints:[
      "Treat the exam as a spaced-retrieval project: short daily sessions, with yesterday's misses deciding today's study. Cramming the pool works badly for the math questions.",
      "Use HamStudy's study mode on your weakest subelements, and watch the aptitude estimate rather than single test scores. For Meshtastic, the order matters: set the region, then a private channel, then share that channel to the second node.",
      "CLI: meshtastic --set lora.region US, then meshtastic --ch-set psk random --ch-index 0, then share the channel URL or QR code to node 2. Measure for two minutes at each spot and record the median RSSI and SNR, not the best single packet. LoRa can still decode at negative SNR."
    ],
    trouble:[
      ["The node shows 'Region unset' and nothing is sent","Meshtastic does not transmit until a region is set","Set lora.region to US. Confirm with meshtastic --info, then reboot the node."],
      ["The two nodes cannot hear each other after you set a private key","Channel name, PSK or modem preset differ between the nodes","Configure node 1, then import its channel URL or QR code on node 2 instead of typing settings twice."],
      ["The range is far shorter than online claims","Body blocking, antennas near the ground, a poor stock antenna, or an 868 MHz antenna on a 915 MHz radio","Check the antenna's band marking, raise it, keep it vertical and clear of your body, and test with line of sight. Change one variable at a time."],
      ["Practice scores stall at 26–28","Recognizing answers rather than understanding them, especially the Ohm's law, wavelength and decibel questions","Study the explanations, work the math questions on paper, and drill the subelements with the most misses."],
      ["The web flasher cannot see the device","A charge-only USB cable, a missing USB-serial driver (CP210x or CH9102), or the board is not in bootloader mode","Swap the cable first, because it is the most common cause. Then install the driver and use the board's boot button sequence."]
    ],
    challenge:"Add a third node as a fixed router at a window or on a 3 m mast. Send 50 numbered messages from the far node at each test point, with the router off and then on, and record the delivery rate and hop count. Repeat at the LongFast and MediumFast presets. Plot delivery rate against distance for all four combinations and explain the trade-off between data rate, airtime and link margin.",
    reflect:[
      "Why does raising the antenna from head height to 3 m change RSSI more than distance alone predicts? Think about the Fresnel zone and absorption by the ground and your body.",
      "Why do amateur rules prohibit encryption that obscures meaning, and why does that make licensed mode the wrong choice for a private mesh?",
      "What does your weekly aptitude score predict about exam day, and what pattern in your misses would worry you?"
    ],
    safety:"Always connect the antenna before powering a LoRa node, because transmitting without one can damage the radio. Use protected lithium cells in the correct polarity, use the board's charger, and do not leave cells charging unattended. Stay in Part 15 mode with the certified hardware and its antenna, and no amplifiers. Do not enable licensed mode or transmit on amateur frequencies until your call sign appears in the FCC ULS database."
  }
});

/* p43 macOS, iOS & Apple Device Management */
Object.assign(window.LABX,{
  "p43lab1":{
    time:"3–4 h, plus about 30 min for the macOS download",
    setup:[
      "An Apple silicon Mac you own with at least 80 GB free. Use UTM (mac.getutm.app, free outside the App Store) with the Apple Virtualization backend, or Tart (brew install cirruslabs/cli/tart). Either can install macOS from Apple's restore image (IPSW).",
      "How to 'snapshot': UTM's Apple Virtualization VMs have no snapshot button, so shut the VM down and duplicate or clone it, naming the copy macos-clean. With Tart, tart clone <vm> macos-clean does the same.",
      "A password manager entry ready for the FileVault recovery key, and a lab-notebook file where you paste every command and its output.",
      "The diskcheck files from Module 2: ~/bin/diskcheck.sh (#!/bin/zsh, chmod 755) and ~/Library/LaunchAgents/com.lab.diskcheck.plist with Label, absolute ProgramArguments, StartInterval 3600 and RunAtLoad true."
    ],
    checkpoints:[
      "The VM boots to the desktop with a local admin account, and a powered-off clean copy named macos-clean exists.",
      "The notebook holds sw_vers (ProductVersion and BuildVersion), uname -a (the Darwin version) and 'System Integrity Protection status: enabled.'. From diskutil apfs list it shows the volume roles (System, Data, Preboot, Recovery, VM), the System volume marked as sealed, and 'FileVault is Off.'.",
      "fdesetup status says 'FileVault is On.' The recovery key is in your password manager, not in the notebook. After a reboot, the unlock (login) screen appears before the desktop loads.",
      "In recoveryOS Terminal, csrutil status shows enabled. You changed nothing, and your notebook has one paragraph on why SIP stays on.",
      "plutil -lint prints OK. launchctl print gui/$(id -u)/com.lab.diskcheck shows a run interval of 3600 and 'last exit code = 0'. ~/Library/Logs/diskcheck.log gains a line after kickstart -k. After bootout, launchctl print reports that the service cannot be found."
    ],
    hints:[
      "Make the clean copy first. After that, every experiment is cheap to undo. Before running a command, know whether it only reads state (status, list, print) or changes it (enable, bootstrap).",
      "On Apple silicon, look for the System role and its 'Sealed' field in diskutil apfs list. A user LaunchAgent lives in the gui/<uid> domain, and launchctl print shows its state, last exit code and run interval.",
      "Load and test: launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.lab.diskcheck.plist, then launchctl kickstart -k gui/$(id -u)/com.lab.diskcheck, then tail -1 ~/Library/Logs/diskcheck.log. Recovery: with Tart, tart run --recovery <vm>. With UTM, choose the VM's recovery boot option. On a physical Mac, hold the power button until startup options appear."
    ],
    trouble:[
      ["'Bootstrap failed: 5: Input/output error'","The agent is already loaded, the plist is invalid, or a path inside it is wrong","Run launchctl bootout gui/$(id -u)/com.lab.diskcheck first, then plutil -lint the plist, then check that the script path exists and is absolute."],
      ["launchctl print shows last exit code = 126 or 127","The script is not executable, the shebang is wrong, or the path is wrong","chmod 755 the script, make sure the first line is #!/bin/zsh, and run the exact ProgramArguments path by hand in Terminal."],
      ["The agent runs but no log file appears","launchd does not expand ~ or $HOME in a plist, or the script failed silently","Use /Users/<you>/... absolute paths, and add StandardErrorPath to a file so you can see the script's errors."],
      ["The VM will not install or start","Not enough free disk space for the IPSW download and the virtual disk, or an IPSW too new for your host macOS","Free at least 80 GB, use a restore image no newer than the host's macOS, and read the tool's log."],
      ["FileVault cannot be turned on inside the VM","Some virtualization setups do not support it","As the lab says, do this step on a spare Mac and write down the limitation. Do not experiment on your daily Mac."]
    ],
    challenge:"Turn the agent into a LaunchDaemon in /Library/LaunchDaemons (owner root:wheel, mode 644) that writes to /Library/Logs. Load it with sudo launchctl bootstrap system. Then break it three ways, one at a time: a missing script path, a script that is not executable, and a plist syntax error. Diagnose each using only launchctl print system/<label>, plutil -lint and log show --last 10m --predicate \"process == 'launchd'\". Finally, discard the VM, rebuild from macos-clean, and time the restore.",
    reflect:[
      "Why is the System volume sealed, and what attack does the seal stop that SIP alone would not?",
      "On Apple silicon, internal storage is always hardware-encrypted. What does turning on FileVault actually add, and why does it switch on instantly?",
      "Why is a gui/<uid> LaunchAgent right for this job, and what changes if it must run when nobody is logged in?"
    ],
    safety:"If you erase a spare Mac instead of using a VM, back it up first and confirm you are erasing the right machine. Store the FileVault recovery key before you reboot: without both the password and the key, the data cannot be recovered."
  },

  "p43lab2":{
    time:"3–4 h",
    setup:[
      "Your Lab 1 VM (cloned from macos-clean) plus a second Mac or VM. Use your own Python 3 from python.org or Homebrew, not /usr/bin/python3, which is only a stub that offers to install the Command Line Tools.",
      "A JSON tool for combining output: recent macOS versions include /usr/bin/jq, and plutil can also insert values into JSON files. Check with which jq.",
      "A project folder with inventory.sh, parse.py, a fixtures/ folder of saved JSON files, and a target OS version you choose, such as your current major version.",
      "A root-owned location for the scheduled version, for example /usr/local/sbin/inventory.sh and a log in /Library/Logs."
    ],
    checkpoints:[
      "./inventory.sh writes a file such as inventory-<hostname>-<date>.json. python3 -m json.tool reads it without error, and it contains SPHardwareDataType, SPSoftwareDataType and your extra keys (product version, FileVault, SIP, free space).",
      "python3 parse.py <file> prints a header line and one CSV row: model, chip, memory, serial, OS version, SIP state, FileVault state.",
      "merged.csv holds a header and two rows. A flag column marks any machine below the target OS or with FileVault off. Raising the target above your current version on purpose makes the flag appear.",
      "The LaunchDaemon plist lints OK. sudo launchctl print system/com.lab.inventory shows last exit code = 0 after kickstart. A forced error lands in your failure log. After bootout and deleting the plist, launchctl print reports the service is not found."
    ],
    hints:[
      "Let the system produce JSON, then add only the few values it does not have. Keep collection (zsh) separate from interpretation (Python), so you can test the parser on saved files.",
      "Explore the keys with system_profiler SPHardwareDataType -json | python3 -m json.tool | less. Apple silicon reports chip_type and Intel Macs report cpu_type, so read both with dict.get. Compare versions as integer tuples, never as strings.",
      "Daemon details: plist in /Library/LaunchDaemons owned root:wheel with mode 644, StartCalendarInterval with Hour and Minute keys, the absolute path to your Python, and StandardErrorPath set. Load with sudo launchctl bootstrap system <plist>, test with sudo launchctl kickstart -k system/com.lab.inventory, and remove with sudo launchctl bootout system/com.lab.inventory."
    ],
    trouble:[
      ["'xcode-select: note: No developer tools were found, requesting install' when running python3","/usr/bin/python3 is a stub","Install Python from python.org or Homebrew and call it by its absolute path (for example /opt/homebrew/bin/python3 or /usr/local/bin/python3)."],
      ["KeyError: 'chip_type'","An Intel Mac (or a VM that reports differently)","Use hw.get('chip_type') or hw.get('cpu_type'), and keep one fixture of each shape in fixtures/ with a test."],
      ["Works in Terminal, but exits 127 under launchd with 'command not found'","launchd gives a minimal PATH and none of your shell profile","Use absolute paths for every command and interpreter, or set PATH explicitly at the top of the script."],
      ["'Operation not permitted' when the daemon writes into a home folder","TCC protects Desktop, Documents and Downloads, even for root","Write to /Library/Logs or /Users/Shared. Grant Full Disk Access only if you can justify it."],
      ["A machine on 26.10 is flagged as older than 26.9","String comparison of version numbers","Convert with tuple(int(x) for x in v.split('.')) and compare the tuples."]
    ],
    challenge:"Make the parser fleet-grade. Add a --ea mode that prints a single <result>…</result> line for use as a Jamf extension attribute, and a --check mode that exits 0 when the Mac is compliant and 1 when it is not. Write pytest tests that run the parser against fixtures you build by editing saved JSON (an Intel shape, missing keys, FileVault off, an old OS). Then make the daemon write rows to /Library/Logs and rotate the log weekly.",
    reflect:[
      "Why parse system_profiler's JSON instead of scraping its text output, and what can still break when Apple changes macOS?",
      "Why does the same script behave differently under launchd than in Terminal (user, environment, TCC)?",
      "Why run inventory as a root daemon instead of a user agent, and what extra risk does running as root bring?"
    ]
  },

  "p43lab3":{
    time:"3–4 h, within a vendor trial window",
    setup:[
      "A vendor trial (Jamf Pro, Iru, Mosyle or Intune), or Apple Business's built-in management if you have an organization account. Read the trial length first and plan to finish inside it.",
      "An Apple Account that you personally control, for the APNs push certificate. Write down which account you used and the certificate's expiry date in your password manager: renewals must use the same account.",
      "A test device you own and can erase: a macOS VM cloned from macos-clean, or a spare iPhone or iPad. Do not enroll your daily phone or a work device.",
      "A lab Wi-Fi network you control, with its exact SSID, security type and password, plus a Python environment with requests for the API step."
    ],
    checkpoints:[
      "The MDM console shows the push certificate as valid, with an expiry about one year out. The Apple Account used and the expiry date are recorded.",
      "The device appears in the console's inventory with its model and serial. On macOS, profiles status -type enrollment shows MDM enrollment: Yes. The log stream shows ManagedClient lines during enrollment and check-in.",
      "The Wi-Fi network appears on the device, and your restriction takes effect. After you remove the profile on the server, it disappears from the device's Device Management list within minutes, and the log shows the removal.",
      "The Python script prints your device's id, name and serial from the API. The API client is deleted afterwards, and a token request with its credentials now fails.",
      "The device is unenrolled and erased (or the VM deleted). Your one-page note lists what the organization could and could not see."
    ],
    hints:[
      "Every MDM action is the same loop: the server queues a command, APNs wakes the device, the device checks in and fetches the command, then reports back. When something does not arrive, find which link broke.",
      "Watch both ends. On the device, run log stream --info --predicate 'subsystem == \"com.apple.ManagedClient\"' and the profiles commands. On the server, read the device's command history: pending, acknowledged or error.",
      "Jamf Pro API: POST /api/oauth/token with client_id, client_secret and grant_type=client_credentials. Then GET /api/v1/computers-inventory with the header Authorization: Bearer <token>, asking only for the sections you need, such as GENERAL and HARDWARE. Print the status code before parsing anything."
    ],
    trouble:[
      ["Commands stay 'Pending' forever","The device cannot reach APNs (TCP 5223, with 443 as the fallback, to Apple's push servers), or the push certificate does not match","Test from the device's network, check the certificate's status in the console, and send a blank push or inventory update to see whether the device checks in."],
      ["After a renewal, every device stops responding","The push certificate was renewed with a different Apple Account, or a new certificate was created instead of renewing the existing one","Always renew the existing certificate with the original Apple Account. That is why you wrote it down. A replaced certificate means every device must re-enroll."],
      ["The macOS enrollment profile downloads but does not take effect","macOS requires the user to approve it in System Settings","Open System Settings, find Device Management (or Profiles), and approve it. User-approved enrollment is what unlocks many MDM features."],
      ["The API returns 401 or 403","401: an expired token (lifetimes are short) or wrong credentials. 403: the API role lacks the privilege","Print the status code and body first. Request a fresh token, and check that the role includes Read Computers."],
      ["The Wi-Fi profile installs but the device will not join","The SSID, security type or password in the payload does not match the network exactly","Copy the SSID exactly (it is case-sensitive), match WPA2 or WPA3 to the router, and check the device's Wi-Fi logs."]
    ],
    challenge:"Script the whole loop. Using the API (Jamf Pro or your vendor's), create a static group, add your test device to it, scope a configuration profile to the group, confirm through the API that the profile is installed, then remove the device from the group and confirm the profile is removed. Log the timestamps and measure how long each step takes. If your trial supports a second enrollment type, re-enroll that way and document which queries and commands change.",
    reflect:[
      "Why does Apple route every MDM command through APNs instead of letting the server connect to the device directly?",
      "What does supervision add, and why can a profile not grant it?",
      "Why should an API client have only Read Computers? What could an attacker do with a client that held every privilege?"
    ],
    safety:"Enroll only devices you own and can erase. MDM can restrict or erase a device, so never enroll your daily phone or a work device without IT's permission. Delete API clients and revoke trial tokens when you are done."
  },

  "p43lab4":{
    time:"two sessions of 2–3 h",
    setup:[
      "A lab Mac or VM to act as the repo and admin machine, and a second VM as the client (both cloned from macos-clean). Install the Munki tools package from the munki/munki GitHub releases, and AutoPkg from the autopkg/autopkg GitHub releases, on the admin machine.",
      "Create the repo at /Users/Shared/munki_repo with the subfolders pkgs, pkgsinfo, catalogs, manifests and icons, then run munkiimport --configure and point it at that path.",
      "For lab use, serve the repo on your LAN only: python3 -m http.server 8080 --directory /Users/Shared/munki_repo. Production repos use HTTPS with authentication.",
      "Configure AutoPkg: defaults write com.github.autopkg MUNKI_REPO /Users/Shared/munki_repo. The lab Mac needs git installed (from the Command Line Tools)."
    ],
    checkpoints:[
      "ls /Users/Shared/munki_repo shows catalogs, icons, manifests, pkgs and pkgsinfo. From the client, curl -I http://<repo-ip>:8080/catalogs/ returns HTTP 200.",
      "autopkg list-repos shows the recipes repository. The override file exists under ~/Library/AutoPkg/RecipeOverrides/, and autopkg verify-trust-info -vv Firefox.munki reports that it passes.",
      "After the run, pkgs/ holds the Firefox download and pkgsinfo/ holds its pkginfo with catalogs set to testing. After makecatalogs, catalogs/testing lists Firefox. The test-client manifest includes the testing catalog and Firefox in managed_installs.",
      "sudo managedsoftwareupdate --checkonly on the client lists Firefox. After the install, Firefox is in /Applications, and /Library/Managed Installs/Logs/ManagedSoftwareUpdate.log records it. After you promote the item and run makecatalogs, catalogs/production also lists it.",
      "With one changed line in the parent recipe, verify-trust-info fails and names that recipe. After restoring the file, it passes again."
    ],
    hints:[
      "Munki is just files over HTTP. The client downloads its manifest, the catalogs the manifest names, then the packages. When an install does not happen, curl each URL the client wants.",
      "An AutoPkg override stores a hash of each parent recipe, and verify-trust-info recomputes and compares them. Import into the testing catalog first. Promotion is only an edit of the pkginfo catalogs array, then makecatalogs.",
      "Commands: autopkg repo-add recipes; autopkg make-override Firefox.munki; autopkg run -v Firefox.munki; makecatalogs /Users/Shared/munki_repo; manifestutil (new-manifest test-client, add-catalog testing --manifest test-client, add-pkg Firefox --manifest test-client). On the client: sudo defaults write /Library/Preferences/ManagedInstalls SoftwareRepoURL http://<ip>:8080, plus ClientIdentifier test-client, then sudo managedsoftwareupdate -v."
    ],
    trouble:[
      ["Client: 'Could not retrieve managed install primary manifest'","The ClientIdentifier names a manifest that does not exist, the URL is wrong, or the server is not running","curl http://<ip>:8080/manifests/test-client from the client. A 404 means the name or path is wrong, and a refused connection means the server is down or blocked."],
      ["The item is in the repo but the client never offers it","The manifest does not list the catalog that holds it, or makecatalogs was not run after the import","Run makecatalogs and check catalogs/testing for the item. Confirm the manifest's catalogs array includes testing."],
      ["'Didn't find a recipe for Firefox.munki'","The recipes repository was not added, or the name is mistyped","Run autopkg search Firefox, then autopkg repo-add recipes, then autopkg list-recipes | grep -i firefox."],
      ["Trust verification fails right after autopkg repo-update","The upstream recipe really changed","Read the diff (git log -p inside the recipe repository) before you run update-trust-info. Never update trust blindly. That review is the whole point."],
      ["The Python web server appears in the firewall prompt","macOS is asking whether to allow incoming connections","Allow it on your private network only, and stop the server (Ctrl-C) when you are finished."]
    ],
    challenge:"Automate it. Run autopkg run --recipe-list nightly from a LaunchAgent, but only after verify-trust-info passes for every override, and log a one-line summary. Write a promotion script that moves an item from testing to production once it has been in testing for three days without a failure in the client logs. Add a second app, simulate a bad release by importing a version that you then mark not to install, and document how you would roll a pilot group back.",
    reflect:[
      "Why does a testing catalog with a pilot group lower risk compared with pushing updates straight to production?",
      "What attack does AutoPkg's trust verification defend against, and what attack does it not catch? Where does code-signature verification of the download fit in?",
      "Why is Munki's pull model sturdier than a push model for laptops that are often offline?"
    ],
    safety:"This lab repo is unauthenticated and served over plain HTTP. Bind it to your LAN only, never forward it through your router, and stop it when the session ends. Install software on test clients only, not on your daily Mac."
  },

  "p43lab5":{
    time:"two sessions of 2–3 h",
    setup:[
      "A CIS Apple macOS benchmark that matches your exact macOS version (a free PDF after registering at cisecurity.org), or the macOS Security Compliance Project (mSCP) from its GitHub repository, on the branch for your macOS version. mSCP needs Python 3 and a few pip packages listed in its README.",
      "The lab VM cloned from macos-clean for the audit and the DNS drill. A physical Mac for startup options and Apple Diagnostics, which a VM cannot run.",
      "An iPhone or iPad you own, backed up first, with a data-capable cable and a computer: Finder on a Mac, or the Apple Devices app on Windows.",
      "An audit spreadsheet (rule id, title, audit command, expected result, before, after, method) and a ticket template using the Domain 26 six steps: identify, theorize, test, plan and implement, verify, document."
    ],
    checkpoints:[
      "You chose 20 automated rules from the benchmark or mSCP baseline that matches your macOS version, and each row holds its exact audit command.",
      "The before score (for example 11/20) is recorded with each command's output. Five remediations are applied, each with its method (setting, command or profile), and the re-score is higher.",
      "Drill 1: the login screen shows 'Safe Boot' in red, and System Information > Software reports the Boot Mode as Safe. The Apple Diagnostics reference code is recorded (ADP000 means no issues found).",
      "Drill 2: ping -c 3 1.1.1.1 succeeds while ping apple.com fails with 'Unknown host'. scutil --dns shows the dead resolver, and after the fix dscacheutil -q host -a name apple.com returns addresses.",
      "Drills 3 and 4: the iPhone showed the recovery screen (a computer and cable) and restarted normally without a restore. A sysdiagnose archive exists, and one error line from the last hour is identified with its timestamp and process. You wrote four ticket write-ups."
    ],
    hints:[
      "An audit is only as good as its evidence. Save the exact command and output for every rule, not just pass or fail.",
      "mSCP can build a baseline from a tag and then generate both an audit script and configuration profiles from it. For DNS, test layer by layer: reachability by IP first, then name resolution, then which resolver the system is actually using.",
      "Commands: networksetup -listallnetworkservices; networksetup -setdnsservers <service> 192.0.2.1 to break it; networksetup -setdnsservers <service> empty to fix it; then sudo dscacheutil -flushcache and sudo killall -HUP mDNSResponder. Logs: log show --last 1h --predicate 'messageType == error' | head -50. mSCP: ./scripts/generate_baseline.py -k cis_lvl1, then ./scripts/generate_guidance.py -s -p <baseline yaml>."
    ],
    trouble:[
      ["Audit commands return output that looks nothing like the benchmark's","The benchmark is for a different macOS version","Download the benchmark or mSCP branch that matches sw_vers exactly, and record its version in the audit sheet."],
      ["A manually installed profile is ignored, or says the payload requires MDM","Some settings only take effect from MDM-delivered (or supervised) profiles","Mark the rule 'requires MDM' and remediate another way, or deliver the profile through your Lab 3 trial."],
      ["networksetup prints '** Error: The parameters were not valid.'","The network service name is wrong (Wi-Fi versus Ethernet; a VM usually uses Ethernet)","Run networksetup -listallnetworkservices and copy the name exactly, in quotes if it contains spaces."],
      ["The iPhone in recovery mode does not appear on the computer","A charge-only cable, or no Apple Devices app on Windows","Swap the cable and install the app. When the computer offers 'Update' or 'Restore', click Cancel, then hold the side button until the screen goes dark and let the phone restart."],
      ["sysdiagnose seems to hang","It normally takes several minutes and produces hundreds of MB","Wait for Finder to open the output folder (/private/var/tmp). Collect it before you change anything else, so the evidence stays intact."]
    ],
    challenge:"Turn the audit into continuous compliance. Schedule the mSCP-generated compliance script nightly with a LaunchDaemon, have it write results to a dated log, and add a small parser that prints only rules whose status changed since the last run. Then drift one setting on purpose (turn off the firewall) and show that the next run catches it. Write an exception record for one rule you would accept as failing, with the risk, a compensating control and a review date.",
    reflect:[
      "Why audit with the benchmark's documented commands rather than by looking at System Settings?",
      "Why did ping to an IP succeed while names failed, and why does testing the layers in that order shorten troubleshooting?",
      "Which failed rule would you accept as an exception, and how would you document the risk so a reviewer could disagree?"
    ],
    safety:"In Drill 3, never click Restore: it erases the iPhone. Back up the device before you start. Clone the VM before remediating, so a bad setting cannot lock you out."
  }
});

/* p44 UX, UI Design & Accessibility */
Object.assign(window.LABX,{
  "p44lab1":{
    time:"about 8 h over a week (plan 2 h, five 30-minute sessions, analysis 3 h)",
    setup:[
      "This app on the device each participant will use, a stopwatch, and a data sheet (spreadsheet) with one row per participant per task: success (1, 0 or partial by your rule), time on task, SEQ (1–7), assists, notes.",
      "The standard 10-item SUS questionnaire, printed or in a form, with its original wording and the 1–5 agreement scale, and the Single Ease Question: 'Overall, how difficult or easy was this task to complete?' on a 1–7 scale.",
      "A consent form covering: purpose, what is recorded, that participation is voluntary, the right to stop at any time, how the data is stored and anonymized, and your contact details. If you record the screen (for example with OBS), the form must say so.",
      "A quiet space and a moderator script: a welcome, a think-aloud practice task, neutral prompts ('What are you thinking?', 'What would you try?') and a closing."
    ],
    checkpoints:[
      "The test plan states three or more research questions and five tasks written as goals with no interface words. Each task has a success criterion defined in advance (for example, 'reaches the Domain 44 Module 3 simple version within 3 minutes without help').",
      "You have five signed consent forms. The pilot on yourself produced at least one change to the script or task wording, which you recorded.",
      "The data sheet has 25 task rows plus five completed SUS forms. Every SEQ is filled in, and every assist is noted.",
      "Each SUS score is between 0 and 100, and you report the mean with its 95% confidence interval (for example 74 ± 12). Each task's adjusted-Wald interval is shown (4 of 5 successes gives roughly 36% to 98%).",
      "The findings report lists at least five issues. Each has a severity, evidence (counts, times, quotes) and an acceptance criterion, and the top three fixes are ranked with a reason."
    ],
    hints:[
      "Task wording decides what you learn. Describe the participant's goal, never the interface label, or you will be testing reading rather than usability.",
      "SUS scoring: for odd items, subtract 1 from the response; for even items, subtract the response from 5. Add the ten results and multiply by 2.5. With n = 5, the 95% interval uses t = 2.776 × s / √5.",
      "Adjusted-Wald: p̂ = (x + 1.92) / (n + 3.84), and CI = p̂ ± 1.96·√(p̂(1 − p̂) / (n + 3.84)), clipped to 0–1. A finding = what happened (evidence) + why it matters (severity) + what 'fixed' looks like (an acceptance criterion someone can test)."
    ],
    trouble:[
      ["A participant asks 'What should I click?' and you answer","Natural helpfulness, but it turns the task into a demonstration","Reply 'What would you try?' If you must help, log it as an assist and score the task by the rule you set in advance."],
      ["A SUS score above 100 or below 0","The even items were not reversed, or you forgot the ×2.5","Recompute one form by hand and compare it with your formula. Keep the scoring in one spreadsheet column so it cannot drift."],
      ["The confidence intervals are huge","n = 5 gives little precision. That is honest, not an error","Report the intervals as they are. Five users are for finding problems, not for estimating rates. Do not claim, say, '80% success'."],
      ["Friends rate everything as easy","Social desirability bias","Tell them you did not design it and that problems help. Trust behavior (time, errors, assists) over ratings."],
      ["The recording failed in session 2","An untested setup, a full disk, or no microphone permission","Test the recording during the pilot, keep handwritten timestamps as a backup, and check the file after every session."]
    ],
    challenge:"Estimate whether five users were enough. For each problem, record how many participants hit it, estimate the average discovery probability p, and plot 1 − (1 − p)^n for n = 1 to 15. Read off how many users you would need to find 85% of problems of that frequency. Then fix or prototype the top issue, test that one task with five new participants, and compare success and SEQ before and after, stating the limits of the comparison.",
    reflect:[
      "Why does a five-person test find many problems but estimate success rates poorly?",
      "What does the SEQ after each task tell you that the SUS at the end cannot?",
      "When severity and frequency disagree (a severe issue seen once, a mild one seen five times), which do you fix first, and why?"
    ]
  },

  "p44lab2":{
    time:"about 8 h over one to two weeks",
    setup:[
      "A workflow you can reach with permission, and written permission from whoever owns that context: a supervisor, a group admin or the family member.",
      "A consent script and form covering purpose, voluntary participation, note-taking, recording only if agreed, how notes are anonymized, and the right to withdraw.",
      "Sticky notes and a wall or table for affinity mapping, or a free FigJam or Miro board. A notes template with a header for participant code, date, role and context, and one observation per line.",
      "A timer and 45–60 minutes per interview. Leave 15 minutes after each session to clean up your notes while the memory is fresh."
    ],
    checkpoints:[
      "The chosen workflow and the permission (an email or signed note) are filed with the plan.",
      "The plan has every section: background, three research questions about behavior (not features), method, a screener, consent, a schedule, analysis and deliverables.",
      "The guide has 10–15 prompts, mostly starting 'Tell me about the last time…' or 'Walk me through…'. A short list shows the leading or hypothetical questions you removed and how you rewrote each.",
      "Notes from three sessions are anonymized (P1–P3, roles not names), with consent recorded. At least one session was contextual, held where the work happens.",
      "Photos of the affinity map show labeled clusters. Three job stories use the 'When…, I want to…, so I can…' format, and there is a journey map with stages, actions, feelings and pain points, plus two disproved assumptions, each with its evidence."
    ],
    hints:[
      "Ask about the past, not the future. What someone did last time is evidence; what they say they would do is a guess.",
      "Keep research questions (what you want to learn) separate from interview prompts (what you say). Every prompt should trace back to a research question, or it does not belong.",
      "Rewrite 'Would you use an app that…?' as 'Tell me about the last time you had to… What did you do next?' Affinity mapping: one observation per note, grouped bottom-up, with each cluster named in the participant's own words."
    ],
    trouble:[
      ["The interview turns into you pitching your idea","You are solving instead of learning","Stop describing solutions. Ask about the last real occurrence, and save any concept for the final five minutes, if at all."],
      ["Answers are short yes-or-no replies","Closed questions","Use 'Walk me through…' and 'What happened next?', then stay silent for a few seconds. People fill silence with detail."],
      ["You cannot get permission to observe at work","Workplace or customer-data rules","Interview off-site about a specific recent shift, or choose a different context. Never record coworkers, customers or company systems without permission."],
      ["The clusters simply mirror your interview questions","Top-down sorting into your own topic buckets","Shuffle the notes and regroup by underlying need or behavior. Expect some clusters you did not plan."],
      ["The notes contain names, addresses or account details","Raw capture","Anonymize before analysis or sharing: participant codes, roles instead of names, and redacted photos."]
    ],
    challenge:"Check how much of your affinity map is you. Give 30 of your observation notes and your cluster labels to a second person and have them assign each note independently. Compute Cohen's kappa between your coding and theirs, discuss every disagreement, and revise the cluster definitions. Then turn one job story into a testable assumption and run a 15-minute paper-prototype check with two of the same participants.",
    reflect:[
      "Why is past behavior more reliable evidence than stated intention?",
      "What did the contextual session reveal that the others could not, and why?",
      "How could your own expectations have shaped the clusters, and what did you do to counter that?"
    ],
    safety:"Research involves real people's data. Get informed consent, record only with explicit agreement, keep notes in a private location, and remove anything that identifies a participant, customer or employer before you share your deliverables."
  },

  "p44lab3":{
    time:"about 6–8 h of work spread over two weeks (recruiting takes the time)",
    setup:[
      "An online card-sort and tree-test tool with a free tier (for example OptimalSort and Treejack from Optimal Workshop, or UXtweak). Check the current free-plan limits on participants, cards and data export before you launch. Paper cards plus a spreadsheet also work.",
      "Python 3 with numpy, scipy and matplotlib for the similarity matrix and dendrogram, if your tool does not export one.",
      "A recruiting plan for 15 or more sorters and 20 or more tree testers: classmates, online communities and coworkers, with a short invitation that explains the time needed (10–15 minutes).",
      "The current app navigation written out as a tree, so you can compare your new structure against it."
    ],
    checkpoints:[
      "The card list has 30–40 cards with short descriptions in user language. No word is repeated across many labels in a way that would cue grouping.",
      "The open sort has N participants (record N). The exported data includes both the groups and the labels each participant created.",
      "You have a cards × cards similarity matrix in percent and a dendrogram, plus a draft hierarchy of five to eight top categories, labeled mainly with participants' words.",
      "A tree-test table, with N of 20 or more, gives success %, directness % and first-click correctness % for each of the eight tasks, with an adjusted-Wald interval for each success rate.",
      "Every task below 80% success has a change to its label or structure, and the one-page recommendation states the sample-size limits plainly."
    ],
    hints:[
      "In an open sort, the labels participants invent are data too. Keep them; they are your best source of names.",
      "Similarity(A, B) = the number of participants who put A and B in the same group, divided by N. Cluster on the distance 1 − similarity; average linkage is a sensible default.",
      "In Python: build the N × N co-occurrence matrix S, then call scipy.cluster.hierarchy.linkage(squareform(1 - S, checks=False), 'average') and dendrogram(Z, labels=cards). For tree-test tasks, write scenarios with one correct destination, and never use the target label's words in the task."
    ],
    trouble:[
      ["Everyone groups cards by a shared word such as 'Lab' or 'Phase'","The card labels cue the grouping","Rewrite the cards to describe content, vary the wording, and re-pilot with two people."],
      ["Only six people completed the sort","Recruiting is the hard part","Extend the deadline, post in more communities, and add paper sessions. With fewer than 15, treat the clusters as hypotheses and say so."],
      ["Tree-test success is high but directness is low","People find the target only after backtracking","The top-level labels are ambiguous. Look at first clicks to see where people go wrong first, and rename that branch."],
      ["The free tier blocks export of the results","Plan limits","Check the limits before launch. Otherwise capture the result screens and rebuild the counts in a spreadsheet, or run that part on paper."],
      ["Task wording gives the answer away","The scenario uses the label's own words","Rewrite each scenario as the user's goal in different words, and pilot it on someone who has never seen the tree."]
    ],
    challenge:"Run an A/B tree test: randomly assign at least 20 new participants to your revised tree or to the app's current navigation, using the same eight tasks. Compare success per task with Fisher's exact test, and overall success with a two-proportion test. Report the effect sizes with intervals, and state honestly whether your sample could have detected a 20-point difference. Then recommend which tree to ship.",
    reflect:[
      "Why do open sorts generate structure while tree tests verify it, and why would using only one of them mislead you?",
      "What does high success with low directness tell you about a label?",
      "How would your results change if the participants were experienced users of the app rather than newcomers?"
    ]
  },

  "p44lab4":{
    time:"three sessions of 2–3 h",
    setup:[
      "A Figma account. The free Starter plan limits files and pages, and historically allowed only one mode per variable collection. Check your plan's limit, because light and dark need two modes. Options: Figma's free education plan if you qualify, a trial of a paid plan, or modelling light and dark as two collections.",
      "Paper, a pen and a timer for three rapid sketches of 5 minutes each. Draw states, not just screens.",
      "Node.js LTS for the token build. Style Dictionary (v4 or later reads the Design Tokens Community Group $value / $type format) or a short script of your own that turns the JSON into CSS custom properties.",
      "Two people for 15-minute prototype tests, with a three-question script."
    ],
    checkpoints:[
      "Photos of three genuinely different sketches. Grayscale Figma wireframes exist for the quiz feedback and for the key-term popover.",
      "A component set with a State property shows six variants: default, hover, focus, correct, incorrect and disabled. Auto layout lets long text wrap without breaking the layout, and the focus variant has a clearly visible ring with at least 3:1 contrast.",
      "There are color, spacing and type variables, with Light and Dark modes. Switching a frame's mode recolors everything, and the Selection colors panel shows no raw hex values left.",
      "The prototype plays answer → feedback → explanation → next. Notes from two testers include at least one change you made because of them.",
      "tokens.json parses as JSON and uses $type and $value. The compiled CSS has custom properties for both themes, and spot checks show the values match Figma."
    ],
    hints:[
      "Design states before screens. List every state the feedback and the popover can be in (loading, correct, incorrect, long text, keyboard focus) before you draw anything.",
      "Use component properties and interactive components so a click changes the variant, without duplicating frames. Bind fills, strokes, gaps, padding and text styles to variables, not to raw values.",
      "In DTCG JSON, groups nest, tokens carry $value and $type, and aliases look like \"{color.brand.500}\". The current stable spec allows colors as objects with a colorSpace and components, while many tools still accept hex strings, so note which form you used. The build output is :root { --color-brand-500: …; } plus a dark block, such as [data-theme='dark'] or a prefers-color-scheme media query."
    ],
    trouble:[
      ["Switching modes leaves some elements unchanged","Those layers use raw values, not variables","Select the frame, open Selection colors, and bind every remaining raw color. Do the same for spacing in the auto layout fields."],
      ["You cannot add a second mode","A plan limit","See setup: use an education plan or trial, or model the themes as two collections and document the workaround."],
      ["Auto layout stretches or collapses wrongly","Hug and Fill settings conflict in nested frames","Set text layers to Fill container, give the card a max width, and check each nested frame's resizing from the inside out."],
      ["Clicking in the prototype does not change the variant","The interaction is on a frame instance instead of the main component's variants","Add 'Change to' interactions between variants on the main component, so every instance inherits them."],
      ["The token build errors with a reference that does not exist, or outputs nothing","An alias path typo, or the tool is reading the old 'value' key instead of $value","Check each alias against the JSON path, and set the build tool to DTCG mode (or upgrade it)."]
    ],
    challenge:"Add a High contrast mode. Export the tokens, run your Lab 6 contrast script on every text and background pair, and push every pair to at least 7:1 (WCAG AAA) while keeping the hues. Wire the CSS so @media (prefers-contrast: more) selects that theme. Then connect the tokens to one real page of your Domain 5 site, change one brand token, and show the change spreading through Figma and the site from a single edit.",
    reflect:[
      "Why put every raw value behind a variable, and what does that cost you early in a project?",
      "Why design hover, focus and disabled states explicitly, and who is hurt when the focus state is missing?",
      "What did your two testers do that your wireframe did not predict?"
    ]
  },

  "p44lab5":{
    time:"two or three sessions of 3 h",
    setup:[
      "Your Domain 5 site (or another project you own) running locally, in git, with a clean working tree so each fix can be its own commit.",
      "Automated tools: Node.js LTS with npx @axe-core/cli (it needs a ChromeDriver that matches your Chrome), Lighthouse in Chrome DevTools, and the WAVE browser extension from wave.webaim.org.",
      "Assistive technology: NVDA (free from nvaccess.org) with Firefox on Windows, or VoiceOver (Cmd-F5) with Safari on a Mac, and TalkBack on an Android phone. Spend 20 minutes on each screen reader's basic commands before you audit.",
      "A text-spacing bookmarklet (line height 1.5, paragraph spacing 2 em, letter spacing 0.12 em, word spacing 0.16 em), and an audit log sheet with columns: page, tool or method, element, WCAG criterion, level, description, fix commit."
    ],
    checkpoints:[
      "The scope document lists five pages or states with URLs, including at least one interactive state such as a form showing errors or an open menu.",
      "The audit log has a row for every violation with its success criterion number and level. The axe JSON from the before run is saved.",
      "Manual-pass notes per page cover keyboard (visible focus, logical order, no traps), screen reader (names, roles, headings, landmarks), 200% zoom, 320 px reflow without horizontal scrolling, and text spacing, and include at least one issue the automated tools missed.",
      "There is one commit per fix, each message citing the criterion. Native HTML fixes (button, label, headings, landmarks, alt text) come before any ARIA.",
      "The axe re-run reports 0 violations on all five scope pages. An axe check in your test suite fails when you reintroduce one bug on purpose, and the one-page conformance summary is written."
    ],
    hints:[
      "Automated tools catch only a minority of accessibility issues, so budget more time for the manual passes than for scanning.",
      "Fix with native HTML first. Real buttons and links, a label for every input, headings in order, main and nav landmarks, meaningful alt text. The first rule of ARIA is not to use ARIA when a native element does the job.",
      "npx @axe-core/cli <url> --tags wcag2a,wcag2aa,wcag21a,wcag21aa,wcag22aa --save before.json. In tests, use @axe-core/playwright's AxeBuilder with the same tags and expect violations to equal []. Check the WCAG 2.2 additions by hand: 2.4.11 focus not obscured, 2.5.7 dragging movements, 2.5.8 target size (24 × 24 CSS px), 3.3.8 accessible authentication."
    ],
    trouble:[
      ["axe CLI: 'session not created: This version of ChromeDriver only supports Chrome version …'","The ChromeDriver version does not match your installed Chrome","Install a matching driver (the axe docs suggest browser-driver-manager) or pass --chromedriver-path. Run the CLI again once the versions agree."],
      ["Lighthouse scores 100 but the screen reader experience is confusing","Automated checks confirm that names exist, not that they make sense, and they cannot judge reading order","Trust the manual pass. Log issues such as 'link text Read more, repeated 12 times' under 2.4.4."],
      ["NVDA announces 'clickable' with no role, or skips a control","A div with an onclick handler instead of a button","Replace it with <button>. You get focus, keyboard activation and the role for free."],
      ["The focus indicator is invisible","A CSS reset includes outline: none","Restore a :focus-visible style with at least 3:1 contrast against its surroundings, and check that sticky headers do not cover it (2.4.11)."],
      ["Horizontal scrolling at 320 px wide","Fixed widths, wide tables or long unbroken strings","Use max-width: 100%, flex-wrap, and min() widths. Wrap tables in a scroll region that has a label, and use overflow-wrap: anywhere for long strings."]
    ],
    challenge:"Pick the most complex widget on your site, such as a combobox, a modal dialog or tabs, and test it against its WAI-ARIA Authoring Practices pattern with both NVDA and Firefox and VoiceOver and Safari. Document every keyboard interaction and every announcement in a table with one column per screen reader, mark where they differ, and fix anything that breaks the pattern. Add an automated keyboard test (Playwright) that walks the widget with Tab, the arrow keys and Escape.",
    reflect:[
      "Why did the manual passes find issues the tools missed? What can a tool never judge?",
      "Why fix with semantic HTML before reaching for ARIA, and what can go wrong when ARIA is used badly?",
      "If the axe check in CI passes, what can you honestly claim about conformance, and what can you not claim?"
    ]
  },

  "p44lab6":{
    time:"3–4 h",
    setup:[
      "Your palette as a list of named hex colors, and every text, background and component pair that actually appears in your project. Search your CSS for them.",
      "Python 3 or Node.js for the script. No libraries are needed for the WCAG formula, although a color library helps if you choose to work in OKLCH.",
      "Chrome or Edge DevTools: More tools > Rendering > Emulate vision deficiencies (protanopia, deuteranopia, tritanopia and achromatopsia for grayscale).",
      "One page of your project in git, plus the text-spacing bookmarklet from Lab 5."
    ],
    checkpoints:[
      "The script prints a table of pairs with ratios to two decimal places, and its self-test passes on known pairs: #767676 on #FFFFFF gives 4.54:1, and black on white gives 21:1.",
      "The before and after table shows every text pair at 4.5:1 or more (3:1 for large text), and every component or focus pair at 3:1 or more. The recorded hue of each changed color stayed the same within a few degrees.",
      "The type scale is written as tokens (for example base 16 px with ratio 1.25: 16, 20, 25, 31.25, 39), with line heights (about 1.5 for body text, 1.2 for headings) and a maximum line length set in ch (60–75).",
      "Screenshots under grayscale and the three emulations are saved. Every place where color alone carried meaning (correct or incorrect, required fields, links) now also has text, an icon or an underline.",
      "At 200% zoom the page shows no clipped or overlapping text, and with text spacing forced nothing is cut off."
    ],
    hints:[
      "Contrast depends on luminance, not on hue. You can keep the hue and move only lightness until the ratio passes.",
      "Linearize each sRGB channel (0–1) first: c ≤ 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055)^2.4. Then L = 0.2126R + 0.7152G + 0.0722B, and the ratio is (L_lighter + 0.05) / (L_darker + 0.05).",
      "Work in OKLCH: keep C and H fixed and step L by 0.01 until the ratio passes, then convert back to hex. Test your code on #767676 against white (4.54) before trusting it. Type scale: size_n = base × ratio^n, rounded to whole pixels or expressed in rem."
    ],
    trouble:[
      ["Your ratios differ slightly from online checkers","Missing linearization, channels used as 0–255 instead of 0–1, or rounding before the end","Test the known pairs. Round only for display, never inside the math."],
      ["The hue shifts visibly when you darken a color in HSL","HSL lightness is not perceptual","Adjust lightness in OKLCH instead. Some hues, such as yellow on white, cannot reach 4.5:1 without turning brown, so change the background or use that color only for non-text decoration."],
      ["Semi-transparent text gives impossible ratios","Alpha was ignored","Composite the color over its actual background first, then measure the resulting solid color."],
      ["Buttons cut off their labels under forced text spacing","Fixed heights in px","Use min-height plus padding, and let the content set the height."],
      ["You cannot find the vision-deficiency emulation","It sits in the Rendering panel, which is hidden by default","Open DevTools > More tools > Rendering, or use the Command menu and type 'rendering'."]
    ],
    challenge:"Add the APCA method (the draft contrast algorithm discussed for WCAG 3) to your script, computing Lc values alongside the WCAG 2 ratios. Find the pairs in your palette where the two methods disagree most, which is common for light text on dark backgrounds and for oranges. Write a short recommendation explaining which pairs you would change, and why WCAG 2 is still the legal baseline today.",
    reflect:[
      "Why does WCAG contrast use relative luminance instead of a simple difference between RGB values?",
      "Why can a palette pass every contrast check and still fail someone with a color-vision deficiency?",
      "Why limit line length in ch rather than in pixels?"
    ]
  },

  "p44lab7":{
    time:"6–10 h across a week",
    setup:[
      "All your Domain 44 lab outputs in one folder: plans, data sheets, findings, maps, Figma exports, audit logs, before and after screenshots.",
      "A place to publish an accessible page, such as GitHub Pages or Netlify (free), built from semantic HTML or a simple static site generator.",
      "Your Lab 5 audit setup (axe, a screen reader, keyboard, zoom and reflow checks), ready to run on the new page.",
      "Two critics, ideally one designer or developer and one hiring-side reader, plus a one-page rubric: role clear, problem evidenced, decisions justified, outcome measured, honest limits."
    ],
    checkpoints:[
      "You named the spine lab and its measured outcome, for example 'adjusted-Wald task success 2/5 → 5/5' or 'SUS 62 → 78', and gave one sentence on why it is the strongest story.",
      "The draft has six headed sections: context and role, problem with evidence, process, decisions, outcome, reflection. Every claim points to an artifact or a number, and your own role is distinct from anyone else's.",
      "Five chosen artifacts each have a caption that makes a claim (for example 'Tree test: success on Find labs rose from 55% to 85% after renaming'), not a caption that only describes.",
      "The published URL passes axe with 0 violations. Keyboard and screen-reader passes are logged, headings run h1 → h2 → h3 without skips, and every image has alt text that states its point.",
      "Two critiques were scored against the rubric. A change list maps each critique to an edit (or a reason you declined it), and version 2 is published."
    ],
    hints:[
      "Hiring readers skim. Lead with the outcome and your role. The process is your evidence, not the story itself.",
      "A caption should make an argument. For a chart, the alt text states the takeaway, and the underlying numbers are available as text or a table.",
      "Open with a three-line summary (problem, what you did, result with a number and its sample size). Then include only the decisions that changed direction, each with the alternative you rejected and why."
    ],
    trouble:[
      ["It reads like a lab report","Chronological structure","Restructure around decisions and outcomes, and move the method detail into an appendix or a short 'how' section."],
      ["You claimed 'improved usability by 40%' from five users","Overclaiming from a small sample","State the sample and the intervals. Honest limits build trust with expert readers."],
      ["Screenshots of notes are unreadable and inaccessible","Images of text","Transcribe the key text, crop tightly, and add alt text that says why the image matters."],
      ["The critique is only 'looks good'","No specific questions were asked","Give critics the rubric and ask what they understood about your role and outcome after two minutes."],
      ["Work details slipped into the story","Using a real workplace as the context","Anonymize company, customer and location details, and get permission before publishing anything derived from work."]
    ],
    challenge:"Test the case study itself. Run a five-second test and a two-minute skim test with five people who have not seen it: afterwards, ask them to state your role, the problem and the measured result. Revise until at least four of five get all three right. Then produce a two-minute spoken version for portfolio reviews and record it.",
    reflect:[
      "What makes a measured outcome persuasive, and how did you show the uncertainty without weakening the story?",
      "Why do decisions, and the alternatives you rejected, matter more to a reader than a complete account of the process?",
      "Which critique did you decline, and why?"
    ]
  }
});

/* p45 Technical Project Management & Leadership */
Object.assign(window.LABX,{
  "p45lab1":{
    time:"3–4 h",
    setup:[
      "A word processor and a spreadsheet (LibreOffice, Google Docs and Sheets, or Microsoft 365), with PDF export. The deliverable is one PDF.",
      "Module 1 and 2 notes open: the Oak Hollow facts (412 homes, about $1,200 a home, a 40% take rate at $70 a month), the charter elements, the power-interest grid and the RACI rules.",
      "A charter template with headings fixed in advance: purpose and business case summary, SMART objectives, scope (in and out), milestones, budget and reserves, top risks, assumptions and constraints, success criteria, PM authority, and a sponsor sign-off line.",
      "A stakeholder register sheet with columns: name or role, organization, power (1–5), interest (1–5), current engagement, desired engagement, owner, strategy."
    ],
    checkpoints:[
      "The business case shows capex of 412 × $1,200 = $494,400, about 165 subscribers, about $11,550 a month and about $138,600 a year in gross revenue, a simple payback near 3.6 years before operating costs, your stated opex assumption with the payback recomputed, and one rejected alternative with its reason.",
      "The charter fits on one page. Every objective has a number and a date, at least three exclusions are explicit, contingency and management reserves appear as separate lines, and the PM's authority has limits (for example a spending threshold and which changes need the sponsor).",
      "At least 12 stakeholders are placed on the power-interest grid. A current-versus-desired engagement table (unaware, resistant, neutral, supportive, leading) has a named strategy for every gap.",
      "The RACI has six deliverable rows with exactly one A in each and at least one R. ADA's critique is attached, along with the changes you made."
    ],
    hints:[
      "A charter authorizes the project; it does not plan it. Keep only what the sponsor must agree to and sign.",
      "Simple payback = initial investment ÷ annual net cash inflow. Exclusions are your future defense against scope creep, so write the ones people will ask about (in-home Wi-Fi, business accounts, unusually long drops).",
      "Revenue check: 412 × 0.40 ≈ 165 subscribers, and 165 × $70 × 12 ≈ $138,600. Now subtract your own operating-cost assumption (for example 30–40% of revenue) and recompute; the payback should grow noticeably. On the grid, the city right-of-way office and the pole owner usually sit high on power, whatever their interest."
    ],
    trouble:[
      ["The charter grows to four or five pages","Planning detail (schedules, task lists) crept in","Move the detail to the project management plan and keep only decisions and authority in the charter."],
      ["Objectives read like tasks ('install fiber')","Activities written instead of outcomes","Rewrite them as measurable results with dates, for example 'pass 412 homes with 98% of drops tested to spec by <date>'."],
      ["Every stakeholder ends up in 'manage closely'","Scoring in isolation rather than relative to each other","Rank power and interest relative to one another, and force at least a third of the stakeholders out of the top-right box."],
      ["RACI rows with two A's, or none","Accountability shared or unclear","Pick one accountable owner per deliverable. Shared accountability means no accountability."],
      ["The payback looks too good to be true","Gross revenue was used with no operating costs, and the take rate was assumed on day one","Add opex and a take-rate ramp (for example 15% in year 1, 30% in year 2, 40% in year 3), and show both numbers."]
    ],
    challenge:"Add a sensitivity analysis. Vary the take rate from 25% to 55% and the cost per home from $1,000 to $1,600, then compute the payback and the 10-year NPV at an 8% discount rate with your opex assumption, as a two-way data table. Find the break-even take rate for a five-year payback and recommend a go/no-go threshold the sponsor could monitor through pre-sign-ups before construction starts.",
    reflect:[
      "Why does the charter name the PM's authority, and what happens on a project when it does not?",
      "Which stakeholder could stop this project fastest, and why are they not necessarily the most interested one?",
      "Why exactly one A per RACI row, when several people may do the work?"
    ]
  },

  "p45lab2":{
    time:"4–5 h",
    setup:[
      "ProjectLibre (free and open source, from projectlibre.com) or a spreadsheet. ProjectLibre needs a Java runtime on some systems, as its installer notes explain.",
      "The Module 2 seven-activity network: A permits and locates (10 days), B bore and conduit (20, after A), C set handholes (6, after A), D place cable (8, after B and C), E aerial strand and lash (12, after A), F splice (10, after D and E), G test and as-builts (4, after F).",
      "Graph paper or a whiteboard for the hand calculation. Do it by hand before you touch the software.",
      "A WBS template: an outline numbered 1, 1.1, 1.1.1, plus a dictionary table with columns for ID, name, description, deliverable, owner, acceptance criteria and estimate."
    ],
    checkpoints:[
      "The WBS reaches work-package level. Each parent's children add up to 100% of the parent and nothing outside it, and every package has a dictionary entry with its acceptance criteria.",
      "Every activity has O, M and P values, a PERT mean (O + 4M + P) / 6 and σ = (P − O) / 6. As a check, the bore with O = 17, M = 20 and P = 32 gives 21.5 days and σ = 2.5.",
      "Your hand calculation shows ES/EF and LS/LF for all seven activities: a finish on day 52, a critical path of A–B–D–F–G, 14 days of float on C and 16 on E. ProjectLibre or the spreadsheet shows the same numbers, with the critical path highlighted.",
      "After crashing B to 14 days, the finish is day 46 and A–B–D–F–G is still critical, with float on C and E now smaller (8 and 10 days). Fast-tracking is recorded as a lead or overlap on D with a rework risk noted. The cost of each option is recorded, and the baseline is saved."
    ],
    hints:[
      "The 100% rule works both ways: nothing missing, nothing extra. Decompose by deliverable (what gets built), not by department or by phase name alone.",
      "Forward pass: ES of an activity = the largest EF among its predecessors. Backward pass: LF = the smallest LS among its successors. Total float = LS − ES. The critical path is the zero-float chain.",
      "D can start only after both B and C, so its ES = max(30, 16) = 30. F waits for both D and E, so its ES = max(38, 22) = 38. When you crash B, recompute everything downstream, then check whether the path A–C–D–F–G or A–E–F–G could become critical. Crashing B pays only until B reaches 6 days."
    ],
    trouble:[
      ["ProjectLibre shows a different finish date than your hand calculation","Calendar effects (weekends, holidays), or durations entered in hours or elapsed days","Use a working-day calendar consistently and compare day numbers, not calendar dates. Check the duration units."],
      ["Every activity shows as critical, or none does","The links are missing, or everything is chained in one line","Re-enter the dependencies exactly as in the table (D after both B and C; F after both D and E) and look at the network view."],
      ["The WBS lists activities such as 'dig', 'pull' and 'splice' with no deliverables","An activity list was written instead of a deliverable breakdown","Restructure so the work packages are nouns (conduit system, handholes, cable plant). The activities then belong to each package."],
      ["Crashing B further does not move the finish","Another path became critical","Recompute the floats. Below 6 days for B, A–C–D–F–G (38 days) controls the finish, so extra rigs buy nothing."]
    ],
    challenge:"Use your PERT values to estimate the probability of finishing within 52 days along the critical path: add the means, add the variances, then use a z-score. Then explain why that number is optimistic: parallel paths merge (merge bias), so the probability of hitting the date is lower than any single path suggests. Check yourself by running a quick Monte Carlo in the spreadsheet (1,000 rows, triangular draws, finish = the longest path) and compare its P50 and P80 with the PERT estimate.",
    reflect:[
      "Why is the critical path the longest path rather than the most important or the hardest work?",
      "When would you fast-track instead of crashing, and what risk do you take on in exchange for the time?",
      "Why does saving a baseline matter before the first day of work?"
    ]
  },

  "p45lab3":{
    time:"2–3 h",
    setup:[
      "A spreadsheet program with charting. Put inputs in one block (BAC, rate per foot, total footage) and formulas in another, so the inputs are easy to change.",
      "The bore numbers: 24,000 ft at $10 a foot, so BAC = $240,000. Make up ten weeks of plausible planned footage, as-built footage and actual cost, including at least one bad week (rock, rain, a broken rig).",
      "Write your red, amber and green thresholds before you enter any actuals, for example green when CPI and SPI are both 0.95 or above, amber between 0.90 and 0.95, red below 0.90."
    ],
    checkpoints:[
      "Ten weekly rows hold planned footage, as-built footage and actual cost, with cumulative columns beside them.",
      "The formula columns compute PV = planned ft × $10, EV = as-built ft × $10, AC, CV, SV, CPI, SPI, three EACs, ETC, VAC and TCPI. A test row with the Module 3 values (PV $120,000, EV $102,000, AC $112,000) reproduces CPI 0.91, SPI 0.85, EACs of $250,000, about $263,500 and about $290,300, and TCPI 1.08.",
      "A line chart shows cumulative PV, EV and AC as S-curves, with a vertical marker at the status date and labeled axes.",
      "A five-line status report gives the RAG color from your pre-set thresholds, the numbers that drive it, which EAC you report and why, the main cause, and the action or decision you need."
    ],
    hints:[
      "EV is the budgeted value of the work actually done: footage installed × the planned rate. It is not what you spent and not what you planned.",
      "Indexes divide, variances subtract: CPI = EV / AC, SPI = EV / PV, CV = EV − AC, SV = EV − PV. TCPI = (BAC − EV) / (BAC − AC), the efficiency needed from now on to land on budget.",
      "The three EACs: AC + (BAC − EV) if the overrun was a one-time event; BAC / CPI if current efficiency continues; AC + (BAC − EV) / (CPI × SPI) if both cost and schedule pressure continue. Choose one by its cause, and say why in the report."
    ],
    trouble:[
      ["CPI and SPI are both exactly 1.0 every week","EV was computed from planned footage, or AC was set equal to EV","EV must come from as-built footage. AC must come from real costs."],
      ["#DIV/0! in the early weeks","PV or AC is zero in week 1","Wrap the indexes in IF(denominator = 0, \"\", …) or start reporting from the first week with activity."],
      ["The S-curves look like steps or jagged lines","The chart plots weekly values, not cumulative ones","Chart the cumulative columns, and use a line chart rather than columns."],
      ["SPI drifts back toward 1.0 near the end even though the job is late","When the work finishes, EV equals PV by definition","That is a known limit of SPI. Add a time-based forecast (planned duration ÷ SPI) or earned-schedule metrics, and mention it in the report."]
    ],
    challenge:"Add earned schedule. For each week, find the point in time when the planned value equalled the current EV, by interpolating along the PV curve. Compute SPI(t) = ES ÷ actual time and a duration forecast, and show that SPI(t) does not drift back to 1.0 at the end the way SPI does. Then build a one-screen dashboard: the S-curves, the CPI and SPI trend, the chosen EAC with its range, and the RAG status.",
    reflect:[
      "Why can a project be ahead of schedule and over budget at the same time? What would the as-built footage and costs look like?",
      "Why choose an EAC by its cause rather than picking the most optimistic one?",
      "Why set the RAG thresholds before looking at the numbers?"
    ]
  },

  "p45lab4":{
    time:"3–4 h (plus 1 h for the optional Monte Carlo)",
    setup:[
      "A spreadsheet for the register, the matrix and the EMV table. Optionally, Python 3 with numpy and matplotlib for the Monte Carlo.",
      "Defined scales written down first: probability 1–5 with percentage bands, and impact 1–5 in dollars, critical-path days and safety severity, where any lost-time injury scores 5.",
      "Inputs for the decision tree: Module 4's bore-versus-aerial example (bore $18,000 with a 30% chance of $12,000 of rock; aerial $15,000 with a 40% chance of $15,000 of pole replacements), or your own numbers.",
      "One real or realistic job hazard analysis step (for example, excavating a bore pit) and a provisioning-portal threat (for example, a contractor account without MFA) as sources."
    ],
    checkpoints:[
      "The register holds 12 risks, each written as 'Because of <cause>, <event> may occur, which would <effect>', with an owner, a trigger and a response. At least one is an opportunity, one is a safety hazard from a JHA, and one is a cyber risk.",
      "A 5 × 5 matrix places all 12 risks. EMV is computed for the top six, with threats negative and opportunities positive, and the total is shown.",
      "The decision tree shows both branches with probabilities and payoffs. Expected costs are $21,600 for the bore and $21,000 for aerial with the module's numbers, or your own, with a sentence on what besides EMV decides (make-ready lead time, schedule). The reserve is sized from the EMV total, with your reasoning.",
      "Optional: a histogram of 10,000 simulated finishes, with P50 and P80 marked, and the probability of finishing within 52 days."
    ],
    hints:[
      "A risk statement needs all three parts. Without a cause you cannot prevent it, and without an effect you cannot price it.",
      "EMV = probability × impact, summed over outcomes. The contingency reserve covers identified risks inside the baseline; the management reserve covers unknown unknowns and needs the sponsor.",
      "Monte Carlo in Python: rng.triangular(O, M, P, 10000) for each activity, finish = A + max(max(B, C) + D, E) + F + G, then np.percentile(finish, [50, 80]). In a spreadsheet, draw triangular values from U = RAND(): if U < (M − O)/(P − O), then O + √(U(P − O)(M − O)); otherwise P − √((1 − U)(P − O)(P − M))."
    ],
    trouble:[
      ["Every risk scores 4 or 5","No anchored scales, or worst-case thinking","Apply the written scale definitions strictly, and compare risks with each other before final scoring."],
      ["Risks are written as vague worries ('weather')","No cause, event and effect","Rewrite each one, for example: 'Because the east segment crosses a limestone shelf, bore production may drop 60% for 1,500 ft, adding about $36,000 and 5 critical-path days.'"],
      ["The EMV total is positive while the threats are large","Signs mixed up: threats entered as positive","Enter threats as negative and opportunities as positive, and check one row by hand."],
      ["Monte Carlo P50 equals the 52-day plan","Symmetric ranges (O and P equally far from M), or path merging is missing","Use right-skewed ranges (P further from M than O is) and compute the finish as the maximum over the merging paths."]
    ],
    challenge:"Turn the register into a quantified schedule-risk model. Attach your two biggest threats to specific activities as discrete events (for example, a 30% chance that B gains 5 days) on top of the triangular durations, rerun 10,000 trials, and produce a tornado chart showing which activity or risk moves P80 the most. Then test one mitigation (for example a test bore that cuts the rock probability to 10% for $3,000) and decide whether it pays, using both EMV and the change in P80.",
    reflect:[
      "Why is contingency sized from EMV defensible, while padding hidden in estimates is not?",
      "Why does merge bias make a plan built from most-likely durations unlikely to finish on time?",
      "Why do safety hazards and cyber threats belong in the same register as cost risks? What do the hierarchy of controls and the risk responses have in common?"
    ]
  },

  "p45lab5":{
    time:"two weeks, about 30 minutes of Scrum overhead per Sprint on top of your normal study",
    setup:[
      "A board with To do, In progress and Done columns: GitHub Projects, a free Trello or Jira board, or sticky notes on a wall.",
      "A spreadsheet for the backlog (item, points, order, Sprint) and a burndown (date, remaining points), plus a plain-text Daily Scrum log.",
      "This app's tools: the Focus timer, Recall, ADA, the Mistake journal and Study analytics. Note your starting Study analytics numbers before Sprint 1.",
      "Timeboxes scaled to one-week Sprints: planning up to about 2 h, Daily Scrum 15 minutes or less, review up to about 1 h, retrospective up to about 45 minutes."
    ],
    checkpoints:[
      "The Product Goal is one sentence with a date. The ordered backlog has at least 20 items with Fibonacci-style points (1, 2, 3, 5, 8, 13), and the top items are small enough to finish within one Sprint.",
      "The Definition of Done is a checklist containing all six items from the lab. An item missing any box is not Done.",
      "Two Sprint boards, each with a one-sentence Sprint Goal. The Daily log has an entry for every study day (yesterday, today, blockers). Focus timer minutes and a Study analytics snapshot are saved at the end of each Sprint.",
      "Each review lists only the items that meet the Definition of Done. The retrospective has one action with an owner, a measure and a due date. Velocities V1 and V2 are recorded, and the forecast reads 'remaining points ÷ max(V) to remaining points ÷ min(V) Sprints', converted into a date range."
    ],
    hints:[
      "Size items relative to one reference item, not in hours. Pick a module you know as a 3 and size everything against it.",
      "A Sprint Goal is one outcome (for example 'Domain 45 Modules 1–3 to Done'), not a to-do list. At review, partly done items go back to the backlog with zero points counted.",
      "Velocity = points Done per Sprint. Forecast = remaining points ÷ highest velocity to remaining points ÷ lowest velocity, given as a range of Sprints and calendar dates. The burndown is remaining Sprint points at the end of each day."
    ],
    trouble:[
      ["You planned 40 points and finished 12","There was no velocity history, and the plan was based on hope","That is normal for Sprint 1. In Sprint 2, plan from your Sprint 1 velocity and your real available hours."],
      ["Several items are '90% done' at the review","The items are too large, or the Definition of Done is being bent","Count them as not Done. Split future items so each one can finish within a few days."],
      ["The Daily log stops after day 3","There is no trigger","Tie the log to starting the first Focus timer of the day, and keep it to three lines."],
      ["The retrospective action is 'study more'","The action cannot be measured","Make it specific and measurable, for example 'phone in another room for every block; target under 1 interruption per block; check on Friday'."]
    ],
    challenge:"Run a third week as Kanban instead of Scrum: a WIP limit of 2 in In progress, no Sprint boundary, and the start and finish date of every item recorded. Compute cycle time and throughput, and check Little's law (average WIP ≈ throughput × average cycle time) against your data. Then compare predictability: which method gave you a tighter forecast for the rest of the backlog, and why?",
    reflect:[
      "Why does Scrum count only Done items, and what would counting partial work hide?",
      "Why is a forecast from two Sprints a range, and what would narrow it?",
      "Which Scrum element helped your study most, and which felt like ceremony for a team of one?"
    ]
  },

  "p45lab6":{
    time:"2–3 h",
    setup:[
      "Records of one real job segment you worked (as-built sheets, photos with timestamps, messages, tickets), or your Lab 5 Sprint logs. Remove customer names, addresses and company-confidential details first.",
      "A template with sections for timeline, what went well, what did not go well, root causes, actions (owner, date, measure) and the changed checklist or JHA.",
      "A fishbone diagram template with the six categories (methods, machines, materials, people, measurement, environment), on paper or in a drawing tool.",
      "The current version of the checklist or job hazard analysis you plan to improve."
    ],
    checkpoints:[
      "The timeline has at least eight dated or timed events, each with its source (a photo timestamp, an as-built entry, a message).",
      "The 'went well' and 'did not go well' lists describe conditions and decisions, with no names. Search your text for names and for 'should have', and rewrite any you find.",
      "The top two problems each have a five-whys chain or a fishbone, and each ends at a cause that a process change could address, not at 'human error'.",
      "Three actions each have an owner role, a due date and a measure. The updated checklist or JHA highlights the new lines, and each new control is labeled with its level in the hierarchy of controls."
    ],
    hints:[
      "Facts first, opinions later. Build the timeline from records before you decide what went wrong.",
      "Five whys stops when you reach something a process change could fix. The fishbone stops you from settling on the first plausible cause.",
      "A good action changes the system: a checklist line, a hold point, a tool, a training step. 'Be more careful' is not an action. In the JHA, prefer controls higher in the hierarchy: elimination, then substitution, then engineering, then administrative, then PPE."
    ],
    trouble:[
      ["The root cause comes out as 'human error'","The analysis stopped too early","Ask why the error was possible or likely: unclear labeling, time pressure, a missing check, fatigue."],
      ["The write-up sounds like blame","Person-focused language","Rewrite each point as a condition plus a decision ('the locate ticket expired before mobilization because the start date slipped without a re-check')."],
      ["Actions from earlier retrospectives were never done","No owner, no date, no follow-up","Give every action an owner and a date, and review open actions at the start of the next job."],
      ["The timeline has big gaps","Memory alone is unreliable","Use timestamps from photos, messages and as-built sheets, and mark the remaining unknowns as unknown."]
    ],
    challenge:"Use the lesson before the next job. Run a 30-minute pre-mortem for an upcoming job segment: imagine it has failed, list the reasons, and compare them with the causes you found here. Add the top three to that job's risk register with triggers. After the job, score which predicted problems occurred, which were prevented, and which surprises you missed. Then define one leading indicator (for example, locate tickets verified 48 h before mobilization) and track it for two weeks.",
    reflect:[
      "Why does blameless language produce better root causes and more honest reporting?",
      "Why do lessons-learned files often go unread, and what makes yours usable by the next person?",
      "Which of your actions moves a control higher in the hierarchy, and why is that more reliable than a reminder?"
    ],
    safety:"A job hazard analysis is a safety document. Your rewrite is a proposal: submit it through your employer's safety process for review and approval before anyone works to it. Do not include confidential customer or company information in a write-up you share."
  },

  "p45lab7":{
    time:"about 8 h over a week (writing 3 h, practice exams 3–4 h, review 1 h)",
    setup:[
      "The current PMI CAPM Examination Content Outline from pmi.org (the 2023 update weights Fundamentals 36%, Predictive 17%, Agile 20% and Business Analysis 27%). The exam is 150 questions in 3 hours, about 1.2 minutes per question.",
      "This domain's exam and cert-prep questions in the app, the Mistake journal and Mixed drill.",
      "One full-length practice test from a reputable source, such as PMI's official Study Hall or a well-reviewed provider that publishes explanations.",
      "A spreadsheet with columns: question id, domain, correct (Y/N), time, miss type (did not know, misread, distractor trap), concept."
    ],
    checkpoints:[
      "Twenty questions split 7 / 4 / 4 / 5 across the four domains. Each has four options, one key, plausible distractors and an explanation that cites the concept.",
      "The app exam, the cert-prep set and the full practice test were each taken under time, at questions × 1.2 minutes, with scores and dates recorded.",
      "A domain score table exists. Every miss is in the Mistake journal with its miss type, and at least two Mixed drill sessions targeted those misses.",
      "The two-week plan has a daily task list weighted toward the domain with the highest priority score (exam weight × your gap), with spaced review of misses built in."
    ],
    hints:[
      "PMI tests judgment in situations, not definitions. Write stems as scenarios: 'You are the project manager… what should you do first?'",
      "Classify every miss: did not know, knew but misread, or fell for a distractor. Each type needs a different fix (content review, reading discipline, or practice with traps).",
      "Priority score per domain = exam weight × (target % − your %). Spend most of the two weeks on the top score, and review misses on day 1, day 3 and day 7."
    ],
    trouble:[
      ["You score 95% on your own questions and 65% on the practice test","Your questions test definitions, which is too easy","Rewrite them as situations with two plausible answers, where only the best one is right by PMI's framework."],
      ["You run out of time","Getting stuck on calculations or long scenarios","Flag anything that takes more than 2 minutes and come back to it. Practice EV and PERT formulas until each takes under a minute."],
      ["Scores swing a lot between practice providers","Their difficulty and style differ","Track trends within one provider, and use PMI's own materials as the reference."],
      ["The same mistakes keep coming back","You reviewed the answer, not the reasoning","For each miss, write why the right answer is right and why your choice was wrong, then redo it a few days later."]
    ],
    challenge:"Do item analysis on your 20 questions. Have ADA, or better a study partner, answer them. Compute each item's difficulty (the share answering correctly) and count how often each distractor was chosen. Rewrite every item that more than 90% got right and every distractor nobody chose, then retest. Explain what makes a good distractor, and why PMI's pretest questions exist.",
    reflect:[
      "Why weight study time by both the exam weight and your gap, instead of by what you enjoy?",
      "What did your miss types reveal about test-taking versus knowledge?",
      "Why does writing questions teach you more than answering them?"
    ]
  }
});

/* p46 Learning How to Learn */
Object.assign(window.LABX,{
  "p46lab1":{
    time:"one week: about 40 minutes per condition, plus 45 minutes for the day-7 test",
    setup:[
      "Four 16-card decks from four domains you have not studied. Assign two decks to each condition with a coin flip, so you do not hand the easier decks to the method you expect to win.",
      "This app's Recall engine for condition B, with a 5-minute timer per daily session. For condition A, a timer and the rule that you do not see those cards again until day 7.",
      "A log sheet: date, condition, deck, minutes, cards seen, and notes on any accidental exposure. Write your scoring rule before day 7 (for example: exact key term required, or gist acceptable), and keep the same rule for both conditions.",
      "Your written prediction, made before you study anything: which condition scores higher on day 7, and by how many percentage points."
    ],
    checkpoints:[
      "The deck assignment (with the coin-flip result), the scoring rule and the dated prediction are written down before Monday's first session.",
      "Condition A log: deck A1 for 20 minutes on Monday and deck A2 for 20 minutes on Tuesday, timer-confirmed, with no later exposure noted.",
      "Condition B log: six daily sessions of 5 minutes, Monday to Saturday, with both decks mixed in the Recall engine and every rating honest. Total minutes are recorded (about 30).",
      "On day 7 all 64 cards were tested cold, with each answer written before flipping. The table shows correct counts and percentages per condition (for example A 9/32 = 28%, B 22/32 = 69%).",
      "A comparison table gives your prediction against the actual result and the time spent per condition, followed by the five-sentence conclusion and the comparison with Rohrer and Taylor's 63% versus 20%."
    ],
    hints:[
      "Decide everything you could bias before you see results: deck assignment, scoring rule, prediction. Otherwise you will grade generously wherever you expect to win.",
      "Keep everything except the schedule the same: card counts, difficulty and honest ratings. If B used 30 minutes and A used 40, the comparison favors A, which makes a B win more convincing. Record it either way.",
      "Each condition's percentage has a standard error of about √(p(1 − p) / 32), roughly 8–9 points, so the difference between them has an SE near 12 points. Treat gaps under about 25 points as suggestive rather than proven, and say so."
    ],
    trouble:[
      ["You saw condition-A cards midweek (in a quiz or a lecture)","The decks overlap with other study","Log every exposure. If it was substantial, swap in a fresh deck or report the contamination in the conclusion."],
      ["The Recall engine queues more than 5 minutes of cards","A long review backlog","Stop when the 5-minute timer ends, even mid-queue. The condition is defined by time, not by an empty queue."],
      ["Your result contradicts the literature","A small sample, unequal deck difficulty, or the recency of B's last review","Do not discard it. Analyze the confounds and consider the counterbalanced replication in the challenge."],
      ["You are unsure how to score partial answers","No rule decided in advance","Apply your pre-written rule mechanically. Where you hesitate, mark the card 'ambiguous' and report results with and without those cards."]
    ],
    challenge:"Run a counterbalanced replication with four new decks, swapping which kind of domain gets which condition, so each kind appears in both. Also equalize the retention interval: end both conditions' last exposure on the same day, three days before the test. Add a second cold test on day 30. Combine both runs into one table, and judge whether the spacing effect survives once the recency confound is removed and as time passes.",
    reflect:[
      "Why does spaced, interleaved practice feel harder while you do it, yet produce better day-7 recall?",
      "Which confounds in your design (recency of the last review, deck difficulty, unequal minutes) could explain part of your result, and how would you remove each one?",
      "Why can blocked, massed practice look better if you test on the same day you study?"
    ]
  },

  "p46lab2":{
    time:"five study days, with about 2 minutes of logging per block plus 1 h of analysis",
    setup:[
      "This app's Focus timer set to 25 or 50 minutes. Pick one length and keep it for all five days.",
      "A log (paper or spreadsheet) with columns: date, block number, start time, task, phone location, interruptions (tally), what pulled you (phone, person, internal thought, notification), and residue rating 1–5.",
      "Residue anchors written down in advance: 1 = fully on the new task within a minute; 3 = the last task kept returning for several minutes; 5 = still mentally on the last thing for most of the block.",
      "A plan for days 3–5: another room for the phone, Do Not Disturb on the computer, and a 10-minute brisk walk before the first block."
    ],
    checkpoints:[
      "Every block on all five days has a complete row, written within a minute or two of the timer ending, not reconstructed in the evening.",
      "Days 1–2 are logged as normal study, with nothing changed. Days 3–5 show the phone in another room, Do Not Disturb on, and the walk completed before block 1.",
      "A summary table per half of the week: blocks per day, interruptions per block, and mean residue (for example 2.4 interruptions per block on days 1–2 versus 0.7 on days 3–5).",
      "Estimated minutes lost (interruptions × 2 minutes) for each half, expressed per hour of blocks so the 2-day and 3-day halves are comparable, plus the one structural rule you will keep permanently."
    ],
    hints:[
      "Log immediately after each block. Memory at the end of the day undercounts interruptions badly.",
      "Count an interruption whenever your attention left the task, even for seconds. Internal pulls (thinking about something else, the urge to check something) count too, so label them 'internal'.",
      "Compare rates, not totals: interruptions per block and lost minutes per hour of blocks, because the two halves have different numbers of days and blocks. Report the change in both absolute and percentage terms."
    ],
    trouble:[
      ["You keep forgetting to log","No trigger","Make the timer's end the trigger. Keep a paper tally next to you during the block and copy it into the log when the timer rings."],
      ["Days 3–5 fell on easier or off days","Uncontrolled context","Note the context (workday or day off, sleep, task difficulty) for each day, and compare like with like where you can."],
      ["The results look too good","The novelty effect: you behave better simply because you are watching","Name it in the write-up, and keep logging for a second week to see whether the gain holds."],
      ["Residue ratings drift upward or downward over the week","The scale has no fixed anchors","Reread the anchor descriptions before rating every block."]
    ],
    challenge:"Run a two-week ABAB design: week 1 days 1–2 baseline and days 3–5 intervention, then week 2 days 1–2 baseline again and days 3–5 intervention again. If interruptions rise when you remove the rule and fall when you restore it, the rule is the cause, not a general learning trend. Plot interruptions per block by day, with the phases shaded, and state your conclusion with that evidence.",
    reflect:[
      "Why does each interruption cost more time than the interruption itself?",
      "Which pull dominated your log (phone, people or internal), and why does a structural rule beat willpower against it?",
      "What does the residue rating capture that interruption counts miss?"
    ]
  },

  "p46lab3":{
    time:"90–120 minutes",
    setup:[
      "One narrow concept from a domain you have finished, written as a one-line scope, for example 'TCP three-way handshake: how two hosts agree on starting sequence numbers'.",
      "ADA, with the instructions pasted at the start of the session: interrupt only with 'why?' or 'what does that word mean?', do not explain anything, and at the end list every stall, hand-wave and jargon term, quoting your words.",
      "A recording of your explanation, either the ADA chat transcript or an audio recording of yourself, so you can compare version 1 and version 2 word for word.",
      "The lecture for that module, closed until you have ADA's list of gaps, and the Classroom oral quiz for the same module."
    ],
    checkpoints:[
      "The concept and its one-line scope are written down before you begin.",
      "Version 1 is saved, given with no notes, and ADA's list names at least a few specific stalls or jargon terms, each with your quoted words.",
      "You reopened the lecture only for the listed gaps, noting which sections. Version 2 is saved, and ADA's list for version 2 is shorter or contains different, deeper questions.",
      "The Classroom oral quiz score for that module is recorded, with a note on any question that exposed a gap the teach-back missed."
    ],
    hints:[
      "Gaps show up where you reach for a term instead of a mechanism. Every time you say a jargon word, ask yourself 'what does it do?'",
      "Hold ADA to its role. If it starts teaching, remind it to only ask 'why?' and 'what does that mean?' until you finish.",
      "For each stall, write one sentence of mechanism and one concrete example with real values (for example SYN seq=100, then SYN-ACK seq=300 ack=101, then ACK ack=301). Rebuild the explanation from that example upward."
    ],
    trouble:[
      ["ADA rewrites your explanation for you","The model defaults to being helpful","Restate the rules: no teaching until the end, and only the two questions. Start a new session if needed."],
      ["Version 2 is longer and has more jargon","Gaps hidden behind terminology","Cut every term you cannot define in plain words, and use a concrete example instead."],
      ["The concept was too big ('networking')","The scope is too broad to find specific gaps","Narrow it to one mechanism that you can explain in about three minutes."],
      ["The oral quiz score is low despite a good version 2","The quiz tests details the explanation skipped","Log those details in the Mistake journal and add them to Recall."]
    ],
    challenge:"Measure how understanding decays. One week later, without reviewing, give version 3 cold and ask ADA for the same stall list. Compare the stalls in versions 1, 2 and 3 in a table. Then teach the same concept to a real person and record their questions. Write down which questions ADA never asked, and what that tells you about the limits of practicing with an AI listener.",
    reflect:[
      "Why does explaining to a novice expose gaps that rereading hides?",
      "Which kind of gap did you have most: a missing mechanism, missing vocabulary, or a missing example?",
      "How is a teach-back a form of retrieval practice, and why does that make it stick?"
    ]
  },

  "p46lab4":{
    time:"three sessions of 2 h, plus 20 minutes one week later",
    setup:[
      "A folder of plain Markdown files, ideally a git repository (git init). Any editor works. Obsidian is free and handles wiki-style links, but plain files keep the notes portable for a decade.",
      "A note template: a title line, the idea in your own words (3–8 sentences), a 'Source:' line, and a links section where every link carries a sentence explaining why the notes connect.",
      "One finished domain whose lectures you can cite but will not copy from. Close the source before you write each note.",
      "Python 3 for a small checker script that counts notes, links per note and broken links."
    ],
    checkpoints:[
      "Thirty files match the YYYYMMDDHHMM-slug.md naming. Each has a Source line and at least two links, each with a reason sentence. Your checker prints 30 notes, a minimum of 2 links per note and 0 broken links.",
      "The index note links all thirty in a sensible order, grouped under short headings, and contains no content of its own beyond the ordering and grouping.",
      "Ten Recall cards are added, and each one names the note it came from.",
      "One week later, five notes picked at random (for example with ls *.md | shuf -n 5) are each scored for the thirty-second test, understood or not, with what was missing."
    ],
    hints:[
      "One idea per note. If the title needs 'and', split the note into two.",
      "The link sentence is where the value is. Writing 'This explains why X happens in [[note]]' forces you to state the relationship, while a bare 'see also' teaches you nothing.",
      "The checker: list every .md file, find every [[...]] link with a regular expression, check that a file starting with that id exists, and count links per note. Print the notes with fewer than two links and any dead links."
    ],
    trouble:[
      ["The notes are lecture sentences, lightly reworded","Writing with the source open","Close the source, write from memory, then check against the source and correct only errors."],
      ["Links are mostly 'see also' with no reason","Linking out of obligation","Write the reason first. If you cannot say why two notes connect, do not link them."],
      ["Two notes got the same timestamp","Created within the same minute","Wait a minute between notes or add seconds to the id. Run the checker for duplicates."],
      ["Hours spent on plugins and themes","The tool became the project","Freeze the tooling at plain Markdown plus your checker, and spend the time writing notes."]
    ],
    challenge:"Map the network. Extend your checker to build the link graph with networkx (python -m pip install networkx): count each note's degree, find orphan notes, and detect clusters with a community algorithm. Draw the graph. Then write three new notes that bridge the two least-connected clusters, each with a link sentence that states a real relationship, and show how the clusters change.",
    reflect:[
      "Why do notes in your own words with reasoned links build understanding, when collected highlights do not?",
      "What did the thirty-second test reveal about notes that depend on context you no longer had?",
      "How is an index note different from a folder hierarchy, and why does that matter as the collection grows?"
    ]
  },

  "p46lab5":{
    time:"two blocks of five quizzes, two weeks apart (about 15 minutes of logging in total)",
    setup:[
      "The next five module quizzes or simulator runs you would take anyway. Use the same kind of assessment for both rounds where possible.",
      "A table with columns: date, module or domain, predicted score, one-line reason, actual score, signed error (predicted − actual), absolute error.",
      "A rule to write your prediction before you see any question: even a glance at the first item changes your estimate.",
      "A calendar reminder two weeks out for the second round."
    ],
    checkpoints:[
      "Five predictions, each with a one-line reason that cites evidence (for example 'last blurt covered 7 of 10 key ideas'), timestamped before each quiz started.",
      "Actual scores and signed errors are filled in for all five rows.",
      "Mean signed error (bias) and mean absolute error (accuracy) are computed, and the domains you over- and under-estimate are named.",
      "The written rule targets the cause of your bias. The second table of five rows from two weeks later has new mean errors computed and compared with the first."
    ],
    hints:[
      "Base each prediction on evidence you just produced (a blurt, a self-test), not on how familiar the material feels.",
      "Signed error shows direction: positive means overconfident. Absolute error shows size. You need both, because +10 and −10 average to zero bias but are both inaccurate.",
      "Your rule should attack the cause. If overconfidence follows rereading, require a blurt before predicting and cap your prediction at your blurt percentage plus 10."
    ],
    trouble:[
      ["Your predictions cluster at round numbers like 80","Anchoring on a habit","Tie each prediction to a number you just measured, such as your blurt coverage."],
      ["Five rows are too few to trust","Small samples are noisy","Report the means as provisional and keep logging. The pattern across rounds matters more than any single mean."],
      ["Quizzes differ widely in difficulty","The error measures the test as much as you","Compare like with like (module checks with module checks) and note the quiz type on each row."],
      ["You studied more after predicting low","Prediction changed your behavior","That is a benefit, not a flaw. Note it, and predict after you finish studying."]
    ],
    challenge:"Go from five numbers to a calibration curve. On two quizzes in each round, rate your confidence per question (50%, 60% up to 100%). Group the questions by confidence, plot stated confidence against actual percent correct, and compute the Brier score: the mean of (confidence − outcome)², with outcome 1 or 0. Compare the curves and Brier scores before and after your rule, and say whether the rule improved calibration, accuracy or both.",
    reflect:[
      "Why do learners tend to overestimate after rereading? What is the fluency illusion doing?",
      "Why does a well-calibrated learner study more efficiently than a confident one?",
      "What would a perfectly calibrated but low-scoring learner do differently from an overconfident high scorer?"
    ]
  },

  "p46lab6":{
    time:"3–4 h, plus a follow-up session after ADA's review",
    setup:[
      "Your real capacity: weekly study hours from Study analytics or your own logs for the last 4–8 weeks, not the hours you wish you had. Mark known heavy work weeks on the calendar.",
      "A spreadsheet with columns: month, phases, depth (mastery or survey), estimated hours, capacity hours (× 0.85), slack, exam, notes. Use conditional formatting to turn a row red when the load exceeds capacity.",
      "The current exam pages for each certification (CompTIA, Python Institute, INE, AWS or Microsoft): exam code, retirement date, price, voucher expiry, and rescheduling and cancellation deadlines.",
      "The Module 7 plan table as the template, and the Module 3 time audit of your real week."
    ],
    checkpoints:[
      "Every domain is assigned to a month with a depth and estimated hours. No month's load exceeds 85% of your measured capacity, and the totals are shown.",
      "Each certification has a tentative date with a 6–8 week prep window in front of it. No two major exams have overlapping prep windows.",
      "The plan includes a 15% buffer, one rest day a week, a written minimum-viable-day rule (for example 15 minutes of Recall plus one blurt), and heavy work weeks visibly lightened.",
      "ADA's three strongest objections are listed with your response to each and the change you made. The first exam is booked, with its confirmation in your calendar."
    ],
    hints:[
      "Start from capacity, not ambition. The plan fails in the weeks you overestimate, not in the weeks you underestimate.",
      "Estimate hours per phase by depth (mastery costs several times more than survey). Sum by month, compare with capacity × 0.85, and move phases or downgrade them to survey depth wherever a month goes red.",
      "Plan backward from the first exam: exam date minus 6–8 weeks of prep is the date its phases must be done. Book only once that window fits inside a green month."
    ],
    trouble:[
      ["The plan needs 25 hours a week and you have 12","Ambition-based planning","Downgrade phases to survey depth, extend the timeline, or cut certifications. The table must be green before you book anything."],
      ["Exam prep windows overlap","Too many certifications in one season","Stagger them so each major exam has its own 6–8 week window, and move the lower-priority exam."],
      ["The plan breaks in week three","No buffer or minimum-viable-day rule, or an unplanned busy week","Use the buffer, fall back to the minimum viable day, and re-plan monthly rather than abandoning the plan."],
      ["The voucher or exam version expires before your date","Retirement dates and voucher expiries were not checked","Read the vendor's retirement date and the voucher's expiry before buying, and book inside both."]
    ],
    challenge:"Stress-test the plan with simulation. Treat your weekly study hours as a distribution drawn from your last 8 or more weeks of logs, simulate 1,000 versions of the year by drawing a random week each time, and record when each certification's prep would really finish. Report the P50 and P80 dates per exam (the same method as Domain 45 Lab 4), and move your booked dates to P80. Note which exam's date moved most, and why.",
    reflect:[
      "Why plan to 85% of your measured capacity rather than 100%?",
      "Which of ADA's objections changed your plan, and why did it persuade you?",
      "Why book the first exam now, instead of waiting until you feel ready?"
    ]
  }
});
