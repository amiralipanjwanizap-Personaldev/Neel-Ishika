export interface CMSData {
  configVersion: number;
  global: {
    fonts: {
      heading: string;
      body: string;
    };
    colors?: {
      primary: string;
      secondary: string;
      text: string;
      bg: string;
    };
  };
  pages: CMSPage[];
}

export interface CMSPage {
  id: string;
  name: string;
  path: string;
  slug: string;
  isHidden: boolean;
  sections: CMSSection[];
}

export interface CMSSection {
  id: string;
  type: 'hero' | 'text' | 'gallery' | 'timeline' | 'faq' | 'travel' | 'venue_map' | 'schedule' | 'footer' | 'special_req' | 'message_wall' | 'photo_challenge' | 'story' | 'accommodation' | 'explore';
  isHidden: boolean;
  data: any;
}

export const defaultCMSData: CMSData = {
  configVersion: 1,
  global: {
    fonts: {
      heading: 'font-serif',
      body: 'font-sans'
    }
  },
  pages: [
    {
      id: 'p-home', name: 'Home', path: '/', slug: '', isHidden: false,
      sections: [{ id: 's-home-hero', type: 'hero', isHidden: false, data: {} }]
    },
    {
      id: 'p-schedule', name: 'Schedule', path: 'schedule', slug: 'schedule', isHidden: false,
      sections: [{ id: 's-schedule', type: 'schedule', isHidden: false, data: {} }]
    },
    {
      id: 'p-travel', name: 'Travel', path: 'travel', slug: 'travel', isHidden: false,
      sections: [{ id: 's-travel', type: 'travel', isHidden: false, data: {} }]
    },
    {
      id: 'p-accommodation', name: 'Accommodation', path: 'accommodation', slug: 'accommodation', isHidden: false,
      sections: [{ id: 's-accommodation', type: 'accommodation', isHidden: false, data: {} }]
    },
    {
      id: 'p-explore', name: 'Explore', path: 'explore', slug: 'explore', isHidden: false,
      sections: [{ id: 's-explore', type: 'explore', isHidden: false, data: {} }]
    },
    {
      id: 'p-special-req', name: 'Requirements', path: 'special-requirements', slug: 'special-requirements', isHidden: false,
      sections: [{ id: 's-special-req', type: 'special_req', isHidden: false, data: {} }]
    },
    {
      id: 'p-gallery', name: 'Gallery', path: 'gallery', slug: 'gallery', isHidden: false,
      sections: [{ id: 's-gallery', type: 'gallery', isHidden: false, data: {} }]
    },
    {
      id: 'p-story', name: 'Story', path: 'story', slug: 'story', isHidden: false,
      sections: [{ id: 's-story', type: 'story', isHidden: false, data: {} }]
    },
    {
      id: 'p-photo-challenge', name: 'Challenge', path: 'games/photo-challenge', slug: 'games/photo-challenge', isHidden: false,
      sections: [{ id: 's-photo-challenge', type: 'photo_challenge', isHidden: false, data: {} }]
    },
    {
      id: 'p-message-wall', name: 'Messages', path: 'games/message-wall', slug: 'games/message-wall', isHidden: false,
      sections: [{ id: 's-message-wall', type: 'message_wall', isHidden: false, data: {} }]
    }
  ]
};
