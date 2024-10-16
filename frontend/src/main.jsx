import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import Footer from './components/footer.jsx';
import { NavbarWithMegaMenu } from './components/Navbar.jsx';
import './index.css';
import Scrollbar from './components/Scrollbar';
import { BookingCard } from './components/Card';
import Statistics from './components/statistics';
import Search from './components/Search';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NavbarWithMegaMenu />
    <div className="flex justify-between m-5">
      <div className="flex flex-col flex-1 mr-5"> {/* Left Part */}
        <div className="flex flex-col mb-4"> {/* Container for Search */}
          <Search />
        </div>
        <div className="flex flex-col"> {/* Container for Statistics */}
          <Statistics />
        </div>
      </div>
      <div className="flex-2 overflow-y-auto max-h-[80vh] border border-gray-300 p-2"> {/* Right Part */}
        <Scrollbar>
          <BookingCard title="Card 1" content="This is the content of the first card." />
          <BookingCard title="Card 2" content="This is the content of the second card." />
          <BookingCard title="Card 3" content="This is the content of the third card." />
          <BookingCard title="Card 4" content="This is the content of the fourth card." />
          <BookingCard title="Card 5" content="This is the content of the fifth card." />
          <BookingCard title="Card 1" content="This is the content of the first card." />
          <BookingCard title="Card 2" content="This is the content of the second card." />
          <BookingCard title="Card 3" content="This is the content of the third card." />
          <BookingCard title="Card 4" content="This is the content of the fourth card." />
          <BookingCard title="Card 5" content="This is the content of the fifth card." />
        </Scrollbar>
      </div>
    </div>
    <Footer />
  </StrictMode>,
);
