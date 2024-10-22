import Header from './Header';
import Footer from './Footer';

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="min-h-screen flex items-center justify-center bg-black">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;