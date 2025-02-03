This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Download the required env files into the root directory of the project (we will provide these files contact us to run a dev build)

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## 5 Oceans Immigration Site References

Some of our applications code sections have been referenced from Chat GPT 4o, we have left comments on code sections that were fully generated by Chat GPT the motion div code on most pages was generated with a prompt that said (Please help with adding the animations)
We use https://app.openwidget.com/ to provide google reviews and some other resources on our home page

# Amadou's references

### Admin page:

# Line 108 - 113 were generated by Chat GPT with the Prompt:

# "Please help me complete this updateFileStatus method to handle mapping over users and their files, updating the status of a file by its fileHash."

### Upload Page

# Chat GPT generated the following code snippet to combine the file data and user ID for the hash (line 122 and 123)

# Prompt: "how can i generate a unique file hash for the file contents of each users file but have it be different if two users upload the exact same file"

### mainlayout.js

# ChatGPT code to help fix error i was having with implementing speed insights from Vercel.

# Prompt: "How can i dynamically import a component in Next.js and add error handling? im dealing with this error "Error: There was an error while hydrating this Suspense boundary. Switched to client rendering" with SpeedInsights for # this section here "pasted reference code section "

# Adam's References

## AI-Assisted Code Sections

### General Prompts

1. **Prompt:** "How can I implement a dynamic theme system in React that uses localStorage to remember the user's theme preference?"

   - **Dynamic Theme System:** Developed a theme management system using `localStorage` to save and retrieve the user's theme preference, updating the UI dynamically across multiple pages like `communitypage.js`, `contactpage.js`, `expressentry.js`, `immigrationpermits.js`, and `sponsorapplication.js`.

2. **Prompt:** "How can I create a function to toggle between dark and light themes in React and save the preference in localStorage?"

   - **Dark and Light Theme Toggle:** Implemented theme toggle functionality to switch between dark and light themes, update `localStorage`, and dynamically change styles across multiple components.

3. **Prompt:** "Can you show me how to avoid rendering a React component on the server-side and only render it after the component is mounted?"

   - **Client-Side Rendering Check:** Added state checks (`isMounted`) to ensure that components render only after being mounted on the client-side, preventing SSR issues across various components.

4. **Prompt:** "Can you help me use the Next.js Image component to display optimized images?"

   - **Next.js Image Component Usage:** Used the Next.js `Image` component for efficient and responsive image rendering, improving performance and SEO across multiple pages.

5. **Prompt:** "Can you show me how to add transition effects when switching between light and dark themes in a React component?"

   - **Smooth Transition Effects:** Implemented CSS transitions for smooth visual effects when toggling between themes in various components, enhancing user experience.

6. **Prompt:** "How can I create a visually appealing button in React with dynamic styling based on the current theme?"
   - **Dynamic Button Styling:** Styled buttons dynamically based on the theme state (`isDarkMode`) in multiple components, ensuring visual consistency.

### `communitypage.js`

1. **Prompt:** "Can you please find me a React library I can use to get some cool icons?"

   - **Lucide React Library:** Integrated the `lucide-react` library for icon components, providing a wide range of customizable icons.
   - [Lucide React Documentation](https://lucide.dev/docs/lucide-react)

2. **Prompt:** "Can you please add error handling in the code to ensure the application handles failures gracefully and provides appropriate user feedback?"
   - **Error Handling:** Implemented error handling for API requests using React state variables to capture and display error messages for a better user experience.

### `contactpage.js`

1. **Prompt:** "Can you help me detect if the component is mounted on the client-side and apply the user's saved theme preference using localStorage?"
   - **Client-Side Theme Detection:** Used a `useEffect` hook to check for the theme preference in `localStorage` and apply it on component mount, ensuring proper theme rendering.

### `expressentry.js`

1. **Prompt:** "How can I check for the saved theme in localStorage and apply it when the component mounts?"
   - **Theme Initialization:** Checked and applied the saved theme preference from `localStorage` on component mount, adjusting the document body styles accordingly.

### `immigrationpermits.js`

1. **Prompt:** "Can you help me with creating responsive image layouts using Next.js Image component?"
   - **Responsive Image Layouts:** Utilized the Next.js `Image` component for adaptive image sizes and quality, ensuring the images are optimized for different screen sizes.

### `servicespage.js`

1. **Prompt:** "Can you add animations to my React components using Framer Motion for elements like headers, buttons, and images?"

   - **Animating Section Headers and Buttons:** Framer Motion is used to animate the section headers, buttons, and images throughout the page, providing a smooth user experience with visual transitions.

2. **Prompt:** "How can I create a staggered animation effect for a list of items in React using Framer Motion?"
   - **Staggered Animations for Feature Cards:** Staggered animations are applied to the feature cards under the "What to expect from our services" section, enhancing visual appeal and engagement.

### `sponsorapplication.js`

1. **Prompt:** "How can I ensure that my React component only renders on the client-side after it is mounted?"

   - **Client-Side Rendering Check:** Used a state variable (`isMounted`) to conditionally render the component only after it is mounted on the client-side, preventing SSR issues.

2. **Prompt:** "Can you help me use the Next.js Image component to display optimized images?"
   - **Next.js Image Component Usage:** Implemented the `Image` component from Next.js to display optimized images for better performance and SEO.

### threads `route.js`

1. **Prompt:** "How can I handle search queries with case-insensitive matching in Prisma?"

   - **Prisma Case-Insensitive Search:** Used the `contains` filter with the `mode: 'insensitive'` option in Prisma to allow case-insensitive string matching for both the `title` and `content` fields in thread search queries.

2. **Prompt:** "How can I add a flag to indicate if the user has liked a thread?"

   - **User Like Flag:** Added logic to map over the threads and append a `userHasLiked` field, which checks if the current user (passed through `userId`) has already liked the thread based on `threadLikes`.

3. **Prompt:** "How can I validate and create a new thread while ensuring all required fields are present?"

   - **Field Validation and Thread Creation:** Added error handling to validate the required fields (`title`, `content`, `category`, `userId`) and return an error if any are missing before proceeding with Prisma’s `create` method to insert the new thread.

### posts `route.js`

1. **Prompt:** "How can I implement error handling when creating and deleting posts using Prisma and Next.js?"

- **Error Handling for Post Creation and Deletion:** Implemented robust error handling using try-catch blocks. When creating a post, if required fields are missing, the API returns a `400 Bad Request` response. Additionally, if the server encounters an issue, it returns a `500 Internal Server Error` with details about the failure, ensuring that both client-side and server-side issues are handled gracefully.

2. **Prompt:** "How can I fetch a post by its ID and check if it exists using Prisma?"

- **Fetching Post by ID:** Implemented a query using Prisma's `findUnique` method to fetch a post by its `postId`. The query includes a selection of specific fields (such as `userId`) to verify the post's existence before proceeding with further actions, like deletion. If the post does not exist, the API returns a `404 Not Found` response.

3. **Prompt:** "How can I implement an authorization check to ensure only the creator can delete the post?"

- **Authorization Check for Post Deletion:** Added a security check to ensure that only the creator of the post can delete it. By comparing the `userId` of the post with the `userId` of the deletion request, unauthorized users attempting to delete the post are denied, returning a `403 Forbidden` response.

### `generateContent` `route.js`

1. **Prompt:** "How can I generate content using the Gemini API based on a provided message?"

- **AI Content Generation:** Implemented a function to handle the generation of content using the Gemini API. The function takes a message as input, sends it to the Gemini API, and returns the generated content. If the API key is missing or an error occurs, appropriate error handling is in place.

# Ibrahim's References

## AI-Assisted Code Sections

### General Prompts

### `servicespage.js`

1. **Prompt:** "Create me a triangle and circle icon using Tailwind CSS"
   - **icon:** Referring to the current 5 Oceans site to give it a more stylish look.

### `servicespage.js`

2. **Prompt:** "I want a visually engaging services section with a blue circle and orange triangle, featuring dynamic animations on page load."
   - **icon:** Added some animations to make the icons more engaging and eye-catching.

### `adminnotes.js`

1.  **Prompt:** "Help me generate React code to manage a list of tasks using state and localStorage. Include the ability to add, toggle complete, and delete tasks."

2.  **Prompt:** "How do I automatically save a list of tasks to localStorage every time the tasks state changes in a React app?"

3.  **Prompt:** "Create a simple UI for a checklist using Tailwind CSS. Add icons for marking tasks complete and deleting them using react-icons"

# Abdurahman's References

## AI-Assisted Code Sections

### General Prompts

### 'contactpage.js'

1. **Prompt:** "How can i make the name of the consultants more visible"
   **Style of consultant names to become more visible and bold on about us page**

### 'signinpage.js'

1.  **Prompt** https://firebase.google.com/docs/auth/web/multi-factor?hl=en&authuser=1 " I need an in depth explanation for how i would implement this is to my sign in method so i am able to enable mfa with in my application using firebase. " _Provided code from signin page file_
    **Implementation of mfa within signinpage.js code so that user is able ot enable mfa **
    **Also used some of the code from the firebase in their documentation in their website in order to implement this feature in the sign in page**
2.  **Prompt** "How can I make input field visible in order to enter a one time mfa password"
3.  **Prompt** "I have tried to enable mfa within my code using firebase, i am unsuccessful in getting it to work. Can you explain to me what i would need to do to get this to work"
    **Implementation of mfa within signinpage.js code**

### 'aboutuspage' references

1. **Prompt** "How can i get a smooth hover animation and responsive layout"
2. **Prompt** "How can I make boxes more rounded in the corners"
3. **Prompt** "How can I make the text look like a professional profile card"

### 'calculator' references

1. **Prompt** " Help me create a calculator using react that calculates prices for visas in immigration and provides timeframe's for each service as well" 2.**Prompt** " How can I style this page to make it consistent with used community page code as a reference
