/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Schedule from './pages/Schedule';
import Travel from './pages/Travel';
import RSVP from './pages/RSVP';
import Gallery from './pages/Gallery';
import Story from './pages/Story';
import PhotoChallenge from './pages/PhotoChallenge';
import MessageWall from './pages/MessageWall';
import DynamicPage from './pages/DynamicPage';
import AdminLayout from './components/AdminLayout';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Events from './pages/admin/Events';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="travel" element={<Travel />} />
          <Route path="rsvp" element={<RSVP />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="story" element={<Story />} />
          <Route path="games/photo-challenge" element={<PhotoChallenge />} />
          <Route path="games/message-wall" element={<MessageWall />} />
          <Route path="page/:slug" element={<DynamicPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="events" element={<Events />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
