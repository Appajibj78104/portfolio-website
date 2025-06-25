import './globals.css'

export const metadata = {
  title: 'Appaji B | Portfolio',
  description: 'Personal portfolio website of Appaji B, showcasing skills, projects, and experience.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
} 