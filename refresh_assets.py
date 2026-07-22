import os
import shutil
import subprocess

# Files to backup before prebuild wipes them
backup_dirs = [
    "android/app/src/main/res/xml",
    "android/app/src/main/res/layout",
]
backup_files = [
    "android/app/src/main/java/me/iteshxt/bloom/WidgetBridgeModule.kt",
    "android/app/src/main/java/me/iteshxt/bloom/WidgetBridgePackage.kt",
    "android/app/src/main/java/me/iteshxt/bloom/TodoWidgetProvider.kt",
    "android/app/src/main/java/me/iteshxt/bloom/PartnerWidgetProvider.kt",
    "android/app/src/main/java/me/iteshxt/bloom/MainApplication.kt",
    "android/app/src/main/AndroidManifest.xml",
    "android/app/build.gradle",
    "android/gradle.properties",
    "android/local.properties",
    "android/app/src/main/res/drawable/widget_background.xml",
    "android/app/src/main/res/drawable/avatar_background.xml",
    "android/app/src/main/res/drawable/button_background.xml",
]

temp_dir = "temp_widget_backup"

def run():
    # Remove old backup if exists
    if os.path.exists(temp_dir):
        shutil.rmtree(temp_dir)
    os.makedirs(temp_dir)

    print("--- STEP 1: Backing up native widget codebase & configs ---")
    for f in backup_files:
        if os.path.exists(f):
            dest = os.path.join(temp_dir, f)
            os.makedirs(os.path.dirname(dest), exist_ok=True)
            shutil.copy2(f, dest)
            print(f"Backed up file: {f}")

    for d in backup_dirs:
        if os.path.exists(d):
            dest = os.path.join(temp_dir, d)
            shutil.copytree(d, dest)
            print(f"Backed up directory: {d}")

    print("\n--- STEP 2: Running Expo Prebuild (Wiping and regenerating native app layouts) ---")
    # Execute Expo prebuild clean
    subprocess.run("npx expo prebuild --platform android --clean", shell=True)

    print("\n--- STEP 3: Restoring native widget files from backup ---")
    for f in backup_files:
        src = os.path.join(temp_dir, f)
        if os.path.exists(src):
            os.makedirs(os.path.dirname(f), exist_ok=True)
            shutil.copy2(src, f)
            print(f"Restored file: {f}")

    for d in backup_dirs:
        src = os.path.join(temp_dir, d)
        if os.path.exists(src):
            if os.path.exists(d):
                shutil.rmtree(d)
            shutil.copytree(src, d)
            print(f"Restored directory: {d}")

    # Cleanup backup temp directory
    shutil.rmtree(temp_dir)
    print("\n--- DONE: Assets refreshed and custom android widgets preserved! ---")

if __name__ == "__main__":
    run()
