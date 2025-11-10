import { NextResponse } from 'next/server';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = (await request.json()) as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
    };

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: 'Please provide a valid email address' }, { status: 400 });
    }

    const res = await fetch('https://codingkaro.in/api/notification/telegram', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `
Name: ${name}
Email: ${email}
Subject: ${subject}
                
Message: ${message}`,
      }),
    });

    if (res.status !== 200) {
      return NextResponse.json({ message: 'Error sending message' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { message: 'Error sending message. Please try again later.' },
      { status: 500 },
    );
  }
}

