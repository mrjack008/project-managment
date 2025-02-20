import express from 'express';
import type { Request, Response, RequestHandler } from 'express';
import type { Browser, Page } from 'puppeteer';
import puppeteer from 'puppeteer';
import cors from 'cors';
import qrcode from 'qrcode';
import { Server } from 'socket.io';
import { createServer } from 'http';

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

let browser: Browser | null = null;
let page: Page | null = null;

interface Contact {
  name: string | null;
  number: string | null;
}

async function initWhatsApp() {
  try {
    browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    page = await browser.newPage();
    await page.goto('https://web.whatsapp.com');

    // Wait for QR code
    const qrCodeElement = await page.waitForSelector('div[data-testid="qrcode"]');
    if (!qrCodeElement) throw new Error('QR code element not found');

    const qrCodeData = await qrCodeElement.evaluate(el => el.getAttribute('data-ref'));
    if (!qrCodeData) throw new Error('QR code data not found');

    // Generate QR code image
    const qrImage = await qrcode.toDataURL(qrCodeData);
    io.emit('qrCode', qrImage);

    // Wait for successful login
    await page.waitForSelector('div[data-testid="chat-list"]', { timeout: 0 });
    io.emit('authenticated', true);

    // Get contacts
    const contacts = await page.evaluate(() => {
      const contactElements = document.querySelectorAll('div[data-testid="chat-list"] span[title]');
      return Array.from(contactElements).map((element) => ({
        name: element.getAttribute('title'),
        number: element.textContent
      }));
    });

    return contacts;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

const startWhatsApp: RequestHandler = (req, res) => {
  initWhatsApp()
    .then(() => res.json({ success: true }))
    .catch(error => res.status(500).json({ error: 'Failed to initialize WhatsApp' }));
};

const getContacts: RequestHandler = (req, res) => {
  if (!page) {
    return res.status(400).json({ error: 'WhatsApp not initialized' });
  }

  page.evaluate(() => {
    const contactElements = document.querySelectorAll('div[data-testid="chat-list"] span[title]');
    return Array.from(contactElements).map((element) => ({
      name: element.getAttribute('title'),
      number: element.textContent
    }));
  })
    .then(contacts => res.json({ contacts }))
    .catch(error => res.status(500).json({ error: 'Failed to fetch contacts' }));
};

// Routes
app.post('/api/whatsapp/start', startWhatsApp);
app.get('/api/whatsapp/contacts', getContacts);

process.on('SIGTERM', async () => {
  if (browser) await browser.close();
  process.exit(0);
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 