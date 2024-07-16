# NoteScape

NoteScape is a powerful and versatile note-taking app designed to enhance your productivity and organization. Featuring bulletins, to-dos, image uploads, and an AI assistant, NoteScape offers seamless sync across devices and a rich editing experience. read the [blog](https://t.ly/t0ryI) to know how I made this project.

## Features

- **Seamless Sync Across Devices**: Automatically sync your notes with your Google account. Access them from any device, anytime. 📱💻
- **AI Assistant**: Enhance your note-taking with AI-powered autocompletion and interactive responses. Type "++" to auto-complete sentences. 🤖💬
- **Image Upload**: Easily add images to your notes using the "/image" command or drag and drop. 🖼️📷
- **Organize with Folders**: Keep your notes organized by grouping them into folders. 📂
- **Favorite Notes**: Mark important notes as favorites for quick access. ⭐
- **Kickstart with Templates**: Use pre-designed templates to start your notes quickly and efficiently. 📑
- **Enhanced Note-taking with Novel.sh Editor**: Add todos, quotes, code blocks, headings, images, and more with the powerful Novel.sh editor. 📝🖼️

## Tech Stack

- **Frontend**: Next.js 14
- **Backend**: Firebase, Vercel Blob
- **Editor**: Novel.sh (Notion-style WYSIWYG editor with AI-powered autocompletion built with TipTap and Vercel SDK)
- **Server-side Language**: Node.js

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/CityIsBetter/NoteScape.git
    cd NoteScape
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up Firebase:
    - Create a Firebase project.
    - Set up Firestore and Authentication.
    - Create a `.env.local` file and add your Firebase configuration:
        ```
        NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
        NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
        NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
        ```

4. Run the development server:
    ```bash
    npm run dev
    ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the app in action.

## Usage

- Sign in with your Google account.
- Create, edit, and organize notes using the various features provided.
- Use the AI assistant to auto-complete sentences and answer questions.
- Upload images to your notes for a richer experience.
- Organize your notes into folders and mark important notes as favorites.
- Start your notes quickly with templates and enhance them with the Novel.sh editor.

## Contributions

Contributions are welcomed! If you have ideas for improvements or have found bugs, feel free to open an issue or submit a pull request. Let's make NoteScape even better together!
