import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore (with databaseId mapping from config if present)
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export interface Booking {
  id: string;
  name: string;
  phone: string;
  serviceId: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  notes?: string;
  timestamp: string;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  adminNotes?: string;
}

const BOOKINGS_COLLECTION = 'bookings';

// Create a new booking or update existing one in Firestore
export async function saveBookingToFirebase(booking: Booking): Promise<void> {
  const bookingRef = doc(db, BOOKINGS_COLLECTION, booking.id);
  // Default status to 'pending' if not present
  const data = {
    ...booking,
    status: booking.status || 'pending',
    adminNotes: booking.adminNotes || ''
  };
  await setDoc(bookingRef, data, { merge: true });
}

// Fetch a single booking by ID
export async function getBookingById(id: string): Promise<Booking | null> {
  const bookingRef = doc(db, BOOKINGS_COLLECTION, id);
  const docSnap = await getDoc(bookingRef);
  if (docSnap.exists()) {
    return docSnap.data() as Booking;
  }
  return null;
}

// Search bookings by phone number
export async function searchBookingsByPhone(phone: string): Promise<Booking[]> {
  const q = query(
    collection(db, BOOKINGS_COLLECTION),
    where('phone', '==', phone.trim())
  );
  const querySnapshot = await getDocs(q);
  const bookings: Booking[] = [];
  querySnapshot.forEach((doc) => {
    bookings.push(doc.data() as Booking);
  });
  // Sort by date/timestamp descending client-side or use orderBy
  return bookings.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

// Fetch all bookings for Admin Dashboard
export async function getAllBookingsFromFirebase(): Promise<Booking[]> {
  const q = query(collection(db, BOOKINGS_COLLECTION));
  const querySnapshot = await getDocs(q);
  const bookings: Booking[] = [];
  querySnapshot.forEach((doc) => {
    bookings.push(doc.data() as Booking);
  });
  // Sort by date & timeslot descending (newest bookings first)
  return bookings.sort((a, b) => {
    const dateCompare = b.date.localeCompare(a.date);
    if (dateCompare !== 0) return dateCompare;
    return b.timeSlot.localeCompare(a.timeSlot);
  });
}

// Update booking status
export async function updateBookingStatusInFirebase(id: string, status: Booking['status']): Promise<void> {
  const bookingRef = doc(db, BOOKINGS_COLLECTION, id);
  await updateDoc(bookingRef, { status });
}

// Update admin notes
export async function updateBookingAdminNotesInFirebase(id: string, adminNotes: string): Promise<void> {
  const bookingRef = doc(db, BOOKINGS_COLLECTION, id);
  await updateDoc(bookingRef, { adminNotes });
}

// Delete booking
export async function deleteBookingFromFirebase(id: string): Promise<void> {
  const bookingRef = doc(db, BOOKINGS_COLLECTION, id);
  await deleteDoc(bookingRef);
}
