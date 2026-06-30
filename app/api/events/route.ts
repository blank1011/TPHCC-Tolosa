import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { enforceRateLimit } from '@/lib/security';

export interface EventItem {
  _id?: ObjectId;
  title: string;
  description: string;
  location: string;
  category: string;
  dateShort: string;
  facebookLink?: string;
  facebookImage?: string;
  facebookPermalink?: string;
  facebookMessage?: string;
  createdAt?: Date;
}

// GET - Fetch all events
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const events = await db.collection('events').find({}).sort({ createdAt: -1 }).toArray();
    const serializedEvents = events.map((event) => ({
      ...event,
      _id: event._id?.toString(),
      createdAt: event.createdAt ? event.createdAt.toISOString() : undefined,
    }));

    return NextResponse.json(serializedEvents, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=0, s-maxage=120, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST - Create a new event
export async function POST(request: NextRequest) {
  try {
    const rateLimited = enforceRateLimit(request, {
      keyPrefix: 'events:write',
      limit: 20,
      windowMs: 60_000,
    });
    if (rateLimited) {
      return rateLimited;
    }

    const body = await request.json();
    const {
      title,
      description,
      location,
      category,
      dateShort,
      facebookLink,
      facebookImage,
      facebookPermalink,
      facebookMessage,
    } = body;

    if (!facebookLink && (!title || !description || !location || !category || !dateShort)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const eventTitle = title?.trim() || (facebookMessage ? facebookMessage.split('\n')[0].slice(0, 100) : facebookLink ? 'Facebook Event' : 'Untitled Event');
    const eventDescription = description?.trim() || facebookMessage || facebookLink || 'No description provided';
    const eventLocation = location?.trim() || 'Brgy.Imelda Tolosa Leyte';
    const eventCategory = category?.trim() || 'Service';
    const eventDateShort = dateShort?.trim() || 'TBD';

    if (eventTitle.length > 160 || eventDescription.length > 5000 || eventLocation.length > 240 || eventCategory.length > 80 || eventDateShort.length > 80) {
      return NextResponse.json(
        { error: 'One or more fields exceed the allowed length.' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    const newEvent: EventItem = {
      title: eventTitle,
      description: eventDescription,
      location: eventLocation,
      category: eventCategory,
      dateShort: eventDateShort,
      facebookLink,
      facebookImage,
      facebookPermalink,
      facebookMessage,
      createdAt: new Date(),
    };

    const result = await db.collection('events').insertOne(newEvent);

    return NextResponse.json(
      { _id: result.insertedId, ...newEvent },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}

// DELETE - Delete an event by ID
export async function DELETE(request: NextRequest) {
  try {
    const rateLimited = enforceRateLimit(request, {
      keyPrefix: 'events:delete',
      limit: 20,
      windowMs: 60_000,
    });
    if (rateLimited) {
      return rateLimited;
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    const eventId =
      typeof id === 'string'
        ? id
        : id && typeof id === 'object'
        ? id.$oid || id.toString()
        : '';

    if (!eventId || eventId === '[object Object]' || !ObjectId.isValid(eventId)) {
      return NextResponse.json(
        { error: 'Invalid event ID' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const result = await db.collection('events').deleteOne({ _id: new ObjectId(eventId) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Event deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
