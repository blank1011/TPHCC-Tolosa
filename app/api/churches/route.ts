import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { enforceRateLimit } from '@/lib/security';

export interface ChurchItem {
  _id?: ObjectId;
  name: string;
  address: string;
  pastorName: string;
  latitude: number;
  longitude: number;
  phone?: string;
  createdAt?: Date;
}

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const churches = await db.collection('churches').find({}).sort({ createdAt: -1 }).toArray();
    const serialized = churches.map((church) => ({
      ...church,
      _id: church._id?.toString(),
      createdAt: church.createdAt ? church.createdAt.toISOString() : undefined,
    }));

    return NextResponse.json(serialized, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=0, s-maxage=120, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching churches:', error);
    return NextResponse.json({ error: 'Failed to fetch churches' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const rateLimited = enforceRateLimit(request, {
      keyPrefix: 'churches:write',
      limit: 20,
      windowMs: 60_000,
    });
    if (rateLimited) {
      return rateLimited;
    }

    const body = await request.json();
    const { name, address, pastorName, latitude, longitude, phone } = body;

    if (!name || !address || !pastorName || latitude === undefined || longitude === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const lat = Number(latitude);
    const lng = Number(longitude);

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return NextResponse.json({ error: 'Latitude and longitude must be valid numbers' }, { status: 400 });
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return NextResponse.json({ error: 'Latitude or longitude out of valid range' }, { status: 400 });
    }

    const newChurch: ChurchItem = {
      name: String(name).trim(),
      address: String(address).trim(),
      pastorName: String(pastorName).trim(),
      latitude: lat,
      longitude: lng,
      phone: phone ? String(phone).trim() : undefined,
      createdAt: new Date(),
    };

    if (
      newChurch.name.length > 160 ||
      newChurch.address.length > 320 ||
      newChurch.pastorName.length > 160 ||
      (newChurch.phone && newChurch.phone.length > 50)
    ) {
      return NextResponse.json({ error: 'One or more fields exceed the allowed length.' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const result = await db.collection('churches').insertOne(newChurch);

    return NextResponse.json({ _id: result.insertedId.toString(), ...newChurch }, { status: 201 });
  } catch (error) {
    console.error('Error creating church:', error);
    return NextResponse.json({ error: 'Failed to create church' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const rateLimited = enforceRateLimit(request, {
      keyPrefix: 'churches:delete',
      limit: 20,
      windowMs: 60_000,
    });
    if (rateLimited) {
      return rateLimited;
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Church ID is required' }, { status: 400 });
    }

    const churchId = typeof id === 'string' ? id : '';
    if (!churchId || !ObjectId.isValid(churchId)) {
      return NextResponse.json({ error: 'Invalid church ID' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const result = await db.collection('churches').deleteOne({ _id: new ObjectId(churchId) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Church not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Church deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting church:', error);
    return NextResponse.json({ error: 'Failed to delete church' }, { status: 500 });
  }
}
