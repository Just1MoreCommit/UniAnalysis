import './globals.css';

export const metadata = {
  title: 'UniAnalysis — Pakistani University Entrance Exam News',
  description: 'Aggregate, categorise, and display the latest entrance-exam news from Pakistani universities.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
