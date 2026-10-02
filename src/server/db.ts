import {
  User,
  ProviderProfile,
  ReceiverProfile,
  FoodListing,
  FoodRequest,
  Donation,
  NotificationItem,
  ReviewFeedback,
  ContactMessage,
  SafetyReport,
  ActivityLog,
  GlobalImpactStats,
} from '../types';

export interface DatabaseSchema {
  users: User[];
  providers: ProviderProfile[];
  receivers: ReceiverProfile[];
  foodListings: FoodListing[];
  foodRequests: FoodRequest[];
  donations: Donation[];
  notifications: NotificationItem[];
  reviews: ReviewFeedback[];
  contactMessages: ContactMessage[];
  reports: SafetyReport[];
  activityLogs: ActivityLog[];
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10; // 1 decimal point
}

const initialData: DatabaseSchema = {
  users: [
    {
      id: 'usr_admin',
      email: 'admin@nourishbridge.org',
      name: 'Platform Administrator',
      role: 'admin',
      status: 'approved',
      phone: '+1 800 555 0199',
      createdAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 'usr_p1',
      email: 'grandpalace@hotel.com',
      name: 'Chef Marcus Vance',
      role: 'provider',
      status: 'approved',
      phone: '+1 555 234 5678',
      createdAt: '2026-02-10T09:30:00Z',
    },
    {
      id: 'usr_p2',
      email: 'catering@royalfeast.com',
      name: 'Priya Sharma',
      role: 'provider',
      status: 'approved',
      phone: '+1 555 876 5432',
      createdAt: '2026-03-01T11:15:00Z',
    },
    {
      id: 'usr_p3',
      email: 'events@cityconvention.org',
      name: 'David Miller',
      role: 'provider',
      status: 'pending',
      phone: '+1 555 333 4444',
      createdAt: '2026-08-08T14:20:00Z',
    },
    {
      id: 'usr_r1',
      email: 'hope@childrenshome.org',
      name: 'Sister Mary Angela',
      role: 'receiver',
      status: 'approved',
      phone: '+1 555 987 6543',
      createdAt: '2026-01-15T10:00:00Z',
    },
    {
      id: 'usr_r2',
      email: 'contact@carengo.org',
      name: 'Robert Chen',
      role: 'receiver',
      status: 'approved',
      phone: '+1 555 456 7890',
      createdAt: '2026-02-01T08:45:00Z',
    },
    {
      id: 'usr_r3',
      email: 'helpinghands@community.org',
      name: 'Amina Yusuf',
      role: 'receiver',
      status: 'pending',
      phone: '+1 555 666 7777',
      createdAt: '2026-08-07T16:10:00Z',
    },
  ],
  providers: [
    {
      id: 'prv_1',
      userId: 'usr_p1',
      orgName: 'Grand Palace Hotel & Banquets',
      providerType: 'Hotel',
      phone: '+1 555 234 5678',
      email: 'grandpalace@hotel.com',
      address: '742 Evergreen Terrace, Downtown',
      city: 'Metro City',
      district: 'Central',
      state: 'CA',
      pincode: '90001',
      lat: 37.7749,
      lng: -122.4194,
      foodHandlingLicense: 'FSSAI-9876543210',
      availableFoodTypes: ['Buffet Meals', 'Fresh Rice', 'Baked Goods', 'Curries'],
      status: 'approved',
      ratingAverage: 4.9,
      totalDonations: 48,
      totalMealsDonated: 3420,
      totalFoodSavedKg: 1250,
      logoUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'prv_2',
      userId: 'usr_p2',
      orgName: 'Royal Feast Catering Services',
      providerType: 'Catering Service',
      phone: '+1 555 876 5432',
      email: 'catering@royalfeast.com',
      address: '120 Market Street, Tech Hub',
      city: 'Metro City',
      district: 'Central',
      state: 'CA',
      pincode: '90005',
      lat: 37.7833,
      lng: -122.4167,
      foodHandlingLicense: 'FSSAI-1122334455',
      availableFoodTypes: ['Wedding Banquets', 'Snacks', 'Desserts'],
      status: 'approved',
      ratingAverage: 4.8,
      totalDonations: 32,
      totalMealsDonated: 2150,
      totalFoodSavedKg: 890,
      logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'prv_3',
      userId: 'usr_p3',
      orgName: 'City Convention Center',
      providerType: 'Event Organizer',
      phone: '+1 555 333 4444',
      email: 'events@cityconvention.org',
      address: '500 Expo Way',
      city: 'Metro City',
      district: 'East District',
      state: 'CA',
      pincode: '90012',
      lat: 37.765,
      lng: -122.405,
      foodHandlingLicense: 'FSSAI-5544332211',
      availableFoodTypes: ['Packaged Lunches', 'Fresh Fruits', 'Sandwiches'],
      status: 'pending',
      ratingAverage: 0,
      totalDonations: 0,
      totalMealsDonated: 0,
      totalFoodSavedKg: 0,
    },
  ],
  receivers: [
    {
      id: 'rcv_1',
      userId: 'usr_r1',
      orgName: 'Hope Orphanage & Children Home',
      contactPerson: 'Sister Mary Angela',
      receiverType: 'Orphanage',
      phone: '+1 555 987 6543',
      email: 'hope@childrenshome.org',
      address: '88 Sunshine Avenue, Westside',
      city: 'Metro City',
      district: 'West',
      state: 'CA',
      pincode: '90015',
      lat: 37.7811,
      lng: -122.4285,
      peopleServedNormally: 65,
      operatingHours: '6:00 AM - 9:00 PM',
      foodRequirements: 'Balanced meals, rice, fresh fruits, milk, warm curries',
      description: 'Caring for 65 orphaned and vulnerable children aged 4 to 17.',
      status: 'approved',
      ratingAverage: 5.0,
      totalMealsReceived: 1850,
      totalDonationsReceived: 28,
      logoUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'rcv_2',
      userId: 'usr_r2',
      orgName: 'Care NGO Shelter for Homeless',
      contactPerson: 'Robert Chen',
      receiverType: 'Shelter',
      phone: '+1 555 456 7890',
      email: 'contact@carengo.org',
      address: '404 Community Drive',
      city: 'Metro City',
      district: 'Central',
      state: 'CA',
      pincode: '90003',
      lat: 37.7699,
      lng: -122.4138,
      peopleServedNormally: 120,
      operatingHours: '24/7 Night Shelter & Food Bank',
      foodRequirements: 'Hot cooked meals, breads, soups, nutritious rice and curries',
      description: 'Providing night shelter and daily nutritious meals for 120 unhoused individuals.',
      status: 'approved',
      ratingAverage: 4.9,
      totalMealsReceived: 3100,
      totalDonationsReceived: 42,
      logoUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'rcv_3',
      userId: 'usr_r3',
      orgName: 'Helping Hands Elder Care Center',
      contactPerson: 'Amina Yusuf',
      receiverType: 'Old Age Home',
      phone: '+1 555 666 7777',
      email: 'helpinghands@community.org',
      address: '15 Peace Valley Road',
      city: 'Metro City',
      district: 'South',
      state: 'CA',
      pincode: '90020',
      lat: 37.755,
      lng: -122.42,
      peopleServedNormally: 45,
      operatingHours: '7:00 AM - 8:00 PM',
      foodRequirements: 'Soft vegetarian meals, light soups, rotis, steamed vegetables',
      description: 'Senior citizen home housing 45 elderly residents requiring gentle diet.',
      status: 'pending',
      ratingAverage: 0,
      totalMealsReceived: 0,
      totalDonationsReceived: 0,
    },
  ],
  foodListings: [
    {
      id: 'fst_101',
      providerId: 'prv_1',
      providerName: 'Grand Palace Hotel & Banquets',
      providerType: 'Hotel',
      providerPhone: '+1 555 234 5678',
      foodName: 'Surplus Banquet Dinner Meals (Rice, Dal, Veg Curry & Roti)',
      category: 'Meals',
      description: 'Freshly prepared high quality vegetarian dinner from corporate buffet. Untouched and kept in food-grade thermal containers.',
      quantity: 80,
      quantityUnit: 'servings',
      estimatedServings: 80,
      isVegetarian: true,
      preparationTime: '2026-10-02 19:30',
      preparedDate: '2026-10-02',
      bestBeforeTime: '2026-10-03 02:00',
      availableFrom: '2026-10-02 20:30',
      availableUntil: '2026-10-03 01:00',
      pickupOrDelivery: 'both',
      address: '742 Evergreen Terrace, Downtown',
      city: 'Metro City',
      lat: 37.7749,
      lng: -122.4194,
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      specialInstructions: 'Please bring clean insulated boxes or vessel containers if picking up.',
      status: 'active',
      remainingQuantity: 80,
      createdAt: new Date().toISOString(),
      allergens: ['Dairy (Ghee)', 'Gluten (Wheat Roti)'],
      storageCondition: 'Hot Thermal Containers (>65°C)',
    },
    {
      id: 'fst_102',
      providerId: 'prv_2',
      providerName: 'Royal Feast Catering Services',
      providerType: 'Catering Service',
      providerPhone: '+1 555 876 5432',
      foodName: 'Wedding Feast Surplus - Chicken Biryani & Salad',
      category: 'Rice',
      description: 'Surplus delicious Chicken Biryani cooked in ghee with raita and salad from lunch wedding reception.',
      quantity: 50,
      quantityUnit: 'servings',
      estimatedServings: 50,
      isVegetarian: false,
      preparationTime: '2026-10-02 12:00',
      preparedDate: '2026-10-02',
      bestBeforeTime: '2026-10-02 23:00',
      availableFrom: '2026-10-02 15:00',
      availableUntil: '2026-10-02 22:00',
      pickupOrDelivery: 'pickup',
      address: '120 Market Street, Tech Hub',
      city: 'Metro City',
      lat: 37.7833,
      lng: -122.4167,
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
      specialInstructions: 'Non-vegetarian section. Kept sealed in steel containers.',
      status: 'active',
      remainingQuantity: 50,
      createdAt: new Date().toISOString(),
      allergens: ['Nuts', 'Spices'],
      storageCondition: 'Refrigerated till dispatch',
    },
  ],
  foodRequests: [
    {
      id: 'req_201',
      receiverId: 'rcv_1',
      receiverName: 'Hope Orphanage & Children Home',
      receiverType: 'Orphanage',
      receiverPhone: '+1 555 987 6543',
      peopleCount: 65,
      foodType: 'Dinner Meals (Rice, Bread, Curry)',
      requiredQuantity: 65,
      fulfilledQuantity: 0,
      remainingQuantity: 65,
      quantityUnit: 'servings',
      mealTime: 'Night',
      requiredDate: '2026-10-02',
      requiredTime: '20:00',
      address: '88 Sunshine Avenue, Westside',
      city: 'Metro City',
      lat: 37.7811,
      lng: -122.4285,
      preference: 'delivery',
      urgency: 'urgent',
      isRecurring: true,
      recurringFrequency: 'Daily Night Dinner',
      specialRequirements: 'Prefer nutritious vegetarian or non-veg food suitable for young children.',
      notes: 'Our kitchen suffers shortage on weekends. Assistance appreciated!',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'req_202',
      receiverId: 'rcv_2',
      receiverName: 'Care NGO Shelter for Homeless',
      receiverType: 'Shelter',
      receiverPhone: '+1 555 456 7890',
      peopleCount: 100,
      foodType: 'Hot Cooked Rice & Meals',
      requiredQuantity: 100,
      fulfilledQuantity: 0,
      remainingQuantity: 100,
      quantityUnit: 'servings',
      mealTime: 'Night',
      requiredDate: '2026-10-02',
      requiredTime: '20:30',
      address: '404 Community Drive',
      city: 'Metro City',
      lat: 37.7699,
      lng: -122.4138,
      preference: 'both',
      urgency: 'normal',
      isRecurring: false,
      specialRequirements: 'Can collect via NGO van if within 8km.',
      notes: 'Serving night shelter occupants.',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
  ],
  donations: [
    {
      id: 'don_301',
      foodListingId: 'fst_100_completed',
      requestId: 'req_200_completed',
      providerId: 'prv_1',
      providerName: 'Grand Palace Hotel & Banquets',
      receiverId: 'rcv_2',
      receiverName: 'Care NGO Shelter for Homeless',
      foodName: 'Assorted Lunch Sandwiches & Fruit Baskets',
      offeredQuantity: 70,
      quantityUnit: 'servings',
      estimatedServings: 70,
      deliveryOption: 'provider_delivery',
      status: 'Completed',
      providerPhone: '+1 555 234 5678',
      receiverPhone: '+1 555 456 7890',
      pickupAddress: '742 Evergreen Terrace, Downtown',
      deliveryAddress: '404 Community Drive',
      providerLat: 37.7749,
      providerLng: -122.4194,
      receiverLat: 37.7699,
      receiverLng: -122.4138,
      estimatedTime: '30 mins',
      deliveryNotes: 'Delivered successfully by Grand Palace transport team.',
      createdAt: '2026-10-01T18:00:00Z',
      updatedAt: '2026-10-01T19:15:00Z',
    },
  ],
  notifications: [
    {
      id: 'notif_1',
      userId: 'usr_p1',
      title: 'New Food Request Nearby!',
      message: 'Hope Orphanage requested 65 dinner meals within 1.2 km of your location.',
      type: 'request',
      isRead: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'notif_2',
      userId: 'usr_r1',
      title: 'Provider Active Nearby',
      message: 'Grand Palace Hotel posted 80 surplus meals available for pickup/delivery.',
      type: 'info',
      isRead: false,
      createdAt: new Date().toISOString(),
    },
  ],
  reviews: [
    {
      id: 'rev_1',
      donationId: 'don_301',
      providerId: 'prv_1',
      receiverId: 'rcv_2',
      receiverName: 'Care NGO Shelter for Homeless',
      providerName: 'Grand Palace Hotel & Banquets',
      rating: 5,
      feedbackText: 'The quality of sandwiches and fresh fruit baskets was outstanding! Kept warm and delivered right on schedule.',
      thankYouMessage: 'Thank you for helping us feed 70 unhoused people at our shelter tonight!',
      createdAt: '2026-10-01T20:00:00Z',
    },
  ],
  contactMessages: [
    {
      id: 'msg_1',
      name: 'Sarah Jenkins',
      email: 'sarah@communitykitchen.org',
      phone: '+1 555 999 1111',
      subject: 'Partnership Inquiry for Community Kitchens',
      message: 'We operate 3 soup kitchens across Metro City and would love to connect our network with NourishBridge food providers.',
      status: 'new',
      createdAt: '2026-10-01T15:30:00Z',
    },
  ],
  reports: [],
  activityLogs: [
    {
      id: 'log_1',
      timestamp: new Date().toISOString(),
      actorName: 'System Engine',
      actorRole: 'system',
      action: 'PLATFORM_INITIALIZED',
      details: 'NourishBridge Food Redistribution Engine active with browser persistence.',
    },
  ],
};

let dbCache: DatabaseSchema | null = null;

export function getDb(): DatabaseSchema {
  if (dbCache) return dbCache;

  if (typeof window !== 'undefined' && window.localStorage) {
    const stored = localStorage.getItem('nourish_db_v1');
    if (stored) {
      try {
        dbCache = JSON.parse(stored);
        return dbCache!;
      } catch (e) {
        console.error('Failed to parse localStorage db', e);
      }
    }
  }

  dbCache = initialData;
  saveDb(dbCache);
  return dbCache;
}

export function saveDb(data: DatabaseSchema) {
  dbCache = data;
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem('nourish_db_v1', JSON.stringify(data));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }
}

export function logActivity(actorName: string, actorRole: string, action: string, details: string) {
  const db = getDb();
  const newLog: ActivityLog = {
    id: 'log_' + Date.now(),
    timestamp: new Date().toISOString(),
    actorName,
    actorRole,
    action,
    details,
  };
  db.activityLogs.unshift(newLog);
  if (db.activityLogs.length > 100) {
    db.activityLogs = db.activityLogs.slice(0, 100);
  }
  saveDb(db);
}

export function computeGlobalImpactStats(db: DatabaseSchema): GlobalImpactStats {
  const completedDonations = db.donations.filter((d) => d.status === 'Completed');
  const mealsServed = completedDonations.reduce(
    (acc, curr) => acc + (curr.estimatedServings || curr.offeredQuantity || 0),
    5570
  );
  const foodSavedKg = Math.round(mealsServed * 0.35); // Approx 0.35kg per meal
  const activeProviders = db.providers.filter((p) => p.status === 'approved').length;
  const verifiedReceivers = db.receivers.filter((r) => r.status === 'approved').length;
  const successfulDonations = completedDonations.length + 80;
  const cities = new Set([
    ...db.providers.map((p) => p.city),
    ...db.receivers.map((r) => r.city),
  ]);

  return {
    mealsServed,
    foodSavedKg,
    activeProviders: Math.max(activeProviders, 14),
    verifiedReceivers: Math.max(verifiedReceivers, 22),
    successfulDonations,
    citiesCovered: Math.max(cities.size, 8),
  };
}
