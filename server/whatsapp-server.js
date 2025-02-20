const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const qrcode = require('qrcode');
const { Server } = require('socket.io');
const { createServer } = require('http');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

let browser = null;
let page = null;
let isInitialized = false;

async function waitForLogin(maxAttempts = 5) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    console.log(`Checking login status, attempt ${attempt + 1}`);
    
    // Wait for 2 seconds between checks
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const isLoggedIn = await page.evaluate(() => {
      return Boolean(
        document.querySelector('div[data-testid="chat-list"]') ||
        document.querySelector('div[data-testid="default-user"]') ||
        document.querySelector('[data-testid="menu-bar-menu"]') ||
        document.querySelector('[data-icon="menu"]')
      );
    });
    
    if (isLoggedIn) {
      return true;
    }
  }
  return false;
}

async function initWhatsApp() {
  try {
    console.log('Initializing WhatsApp...');

    if (!browser) {
      browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
        userDataDir: './whatsapp-session'
      });
    }

    if (!page) {
      page = await browser.newPage();
      await page.setDefaultNavigationTimeout(0);
      await page.setDefaultTimeout(0);
      await page.setViewport({ width: 1280, height: 800 });
    }

    await page.goto('https://web.whatsapp.com', {
      waitUntil: 'networkidle0',
      timeout: 0
    });

    // Wait and check for login status
    const isLoggedIn = await waitForLogin();
    console.log('Login check complete:', { isLoggedIn });

    if (isLoggedIn) {
      isInitialized = true;
      io.emit('authenticated', true);
      const contacts = await getContactsList();
      io.emit('contacts', contacts);
      return { success: true, message: 'Already authenticated' };
    }

    // Only show QR if not logged in
    const qrCodeElement = await page.waitForSelector('div[data-testid="qrcode"]', { timeout: 0 });
    const qrCodeData = await qrCodeElement.evaluate(el => el.getAttribute('data-ref'));
    
    const qrImage = await qrcode.toDataURL(qrCodeData);
    io.emit('qrCode', qrImage);

    await page.waitForSelector('div[data-testid="chat-list"]', { timeout: 0 });
    isInitialized = true;
    io.emit('authenticated', true);
    return { success: true };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

async function getContactsList(limit = 10) {
  try {
    console.log('Starting to fetch contacts... Limit:', limit);
    
    // Wait for the main container
    await page.waitForSelector('#pane-side', { timeout: 5000 });
    console.log('Found main container');
    
    // Function to check if elements are loaded
    const areContactsLoaded = async () => {
      const count = await page.evaluate(() => {
        const elements = document.querySelectorAll('div[data-testid="cell-frame-container"]');
        console.log('Current elements found:', elements.length);
        return elements.length;
      });
      return count > 0;
    };

    // Wait and retry up to 3 times for contacts to load
    let retries = 0;
    while (retries < 3) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const loaded = await areContactsLoaded();
      if (loaded) break;
      console.log(`Retry ${retries + 1}: Waiting for contacts to load...`);
      retries++;
    }

    // Get contacts with multiple selector attempts
    const contacts = await page.evaluate((contactLimit) => {
      const selectors = [
        'div[data-testid="cell-frame-container"]',
        'div[role="row"]',
        '#pane-side div[role="gridcell"]'
      ];

      let elements = [];
      for (const selector of selectors) {
        const found = document.querySelectorAll(selector);
        if (found.length > 0) {
          console.log(`Found ${found.length} elements with selector: ${selector}`);
          elements = found;
          break;
        }
      }

      return Array.from(elements)
        .slice(0, contactLimit)
        .map(chat => {
          try {
            const titleSpan = chat.querySelector('span[dir="auto"][title]');
            const title = titleSpan ? titleSpan.getAttribute('title') : null;
            
            // Try to find phone number in various places
            const phoneSpans = chat.querySelectorAll('span[title^="+"]');
            let phone = null;
            phoneSpans.forEach(span => {
              const spanTitle = span.getAttribute('title');
              if (/^\+\d[\d\s-]+$/.test(spanTitle)) {
                phone = spanTitle;
              }
            });

            const isPhoneNumber = title && /^\+\d[\d\s-]+$/.test(title);
            const name = isPhoneNumber ? 'Unsaved Contact' : (title || 'Unknown');
            const number = isPhoneNumber ? title.replace(/\s+/g, '') : (phone ? phone.replace(/\s+/g, '') : 'Unknown');

            return {
              name,
              number,
              isUnsaved: isPhoneNumber,
              status: name === 'Unknown' || number === 'Unknown' ? 'incomplete' : 'complete'
            };
          } catch (err) {
            console.log('Error processing element:', err);
            return null;
          }
        })
        .filter(contact => contact && 
          contact.name !== 'Unknown' && 
          !contact.name.includes('Click here') &&
          !contact.name.includes('Message') &&
          !contact.name.includes('Group'));
    }, limit);

    console.log(`Found ${contacts.length} contacts:`, contacts);
    return contacts;

  } catch (error) {
    console.error('Error getting contacts:', error);
    console.error('Error details:', error.message);
    return [];
  }
}

// Updated route to accept limit parameter
app.get('/api/whatsapp/contacts', async (req, res) => {
  console.log('GET /api/whatsapp/contacts called');
  try {
    if (!page || !isInitialized) {
      console.log('WhatsApp not initialized', { page: !!page, isInitialized });
      return res.status(400).json({ error: 'WhatsApp not initialized' });
    }

    const limit = parseInt(req.query.limit) || 10;
    console.log('Fetching contacts with limit:', limit);
    
    const contacts = await getContactsList(limit);
    console.log(`Found ${contacts.length} contacts`);
    
    res.json({ 
      contacts,
      total: contacts.length,
      metadata: {
        saved: contacts.filter(c => !c.isUnsaved).length,
        unsaved: contacts.filter(c => c.isUnsaved).length,
        incomplete: contacts.filter(c => c.status === 'incomplete').length
      }
    });
  } catch (error) {
    console.error('Error in getContacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// Dummy data endpoint
app.get('/api/whatsapp/dummy-contacts', (req, res) => {
  const dummyContacts = Array.from({ length: 10 }, (_, index) => ({
    name: `Unsaved Contact ${index + 1}`,
    number: `+91${Math.floor(1000000000 + Math.random() * 9000000000)}` // Generate random phone numbers
  }));

  res.json({ contacts: dummyContacts });
});

// Socket connection handling
io.on('connection', (socket) => {
  console.log('Client connected');
  
  if (isInitialized) {
    console.log('Sending authenticated status to new client');
    socket.emit('authenticated', true);
  }
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Routes with logging
app.post('/api/whatsapp/start', (req, res) => {
  console.log('POST /api/whatsapp/start called');
  initWhatsApp()
    .then(() => res.json({ success: true }))
    .catch(error => {
      console.error('Start error:', error);
      res.status(500).json({ error: 'Failed to initialize WhatsApp' });
    });
});

// Add cleanup on server shutdown
process.on('SIGINT', async () => {
  if (browser) await browser.close();
  process.exit(0);
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 