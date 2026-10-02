export type UserRole = 'provider' | 'receiver' | 'admin';

export type UserStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export type ProviderType =
  | 'Hotel'
  | 'Restaurant'
  | 'Function Hall'
  | 'Hostel'
  | 'Catering Service'
  | 'Canteen'
  | 'Bakery'
  | 'Event Organizer'
  | 'Individual'
  | 'Other';

export type ReceiverType =
  | 'Orphanage'
  | 'NGO'
  | 'Shelter'
  | 'Community Center'
  | 'Old Age Home'
  | 'Charity Organization'
  | 'Relief Camp'
  | 'Food Distribution Group'
  | 'Other';

export type FoodCategory =
  | 'Rice'
  | 'Curry'
  | 'Meals'
  | 'Bread'
  | 'Snacks'
  | 'Fruits'
  | 'Vegetables'
  | 'Bakery'
  | 'Packaged Food'
  | 'Other';

export type MealTime = 'Morning' | 'Afternoon' | 'Evening' | 'Night';

export type DonationStatus =
  | 'Offer Sent'
  | 'Accepted'
  | 'Rejected'
  | 'Preparing'
  | 'Ready for Pickup'
  | 'Out for Delivery'
  | 'Food Received'
  | 'Completed'
  | 'Cancelled';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  phone?: string;
  createdAt: string;
  rejectionReason?: string;
}

export interface ProviderProfile {
  id: string;
  userId: string;
  orgName: string;
  providerType: ProviderType;
  phone: string;
  email: string;
  address: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  lat: number;
  lng: number;
  foodHandlingLicense?: string;
  availableFoodTypes: string[];
  verificationDocUrl?: string;
  logoUrl?: string;
  status: UserStatus;
  ratingAverage: number;
  totalDonations: number;
  totalMealsDonated: number;
  totalFoodSavedKg: number;
}

export interface ReceiverProfile {
  id: string;
  userId: string;
  orgName: string;
  contactPerson: string;
  receiverType: ReceiverType;
  phone: string;
  email: string;
  address: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  lat: number;
  lng: number;
  peopleServedNormally: number;
  operatingHours: string;
  foodRequirements: string;
  description: string;
  verificationDocUrl?: string;
  logoUrl?: string;
  status: UserStatus;
  ratingAverage: number;
  totalMealsReceived: number;
  totalDonationsReceived: number;
}

export interface FoodListing {
  id: string;
  providerId: string;
  providerName: string;
  providerType: ProviderType;
  providerPhone: string;
  foodName: string;
  category: FoodCategory;
  description: string;
  quantity: number;
  quantityUnit: 'servings' | 'kg' | 'boxes' | 'packets';
  estimatedServings: number;
  isVegetarian: boolean;
  preparationTime: string;
  preparedDate: string;
  bestBeforeTime: string;
  availableFrom: string;
  availableUntil: string;
  pickupOrDelivery: 'pickup' | 'delivery' | 'both';
  address: string;
  city: string;
  lat: number;
  lng: number;
  imageUrl?: string;
  specialInstructions?: string;
  status: 'active' | 'partially_donated' | 'fully_donated' | 'expired' | 'cancelled';
  remainingQuantity: number;
  createdAt: string;
  allergens?: string[];
  storageCondition?: string;
}

export interface FoodRequest {
  id: string;
  receiverId: string;
  receiverName: string;
  receiverType: ReceiverType;
  receiverPhone: string;
  peopleCount: number;
  foodType: string;
  requiredQuantity: number;
  fulfilledQuantity: number;
  remainingQuantity: number;
  quantityUnit: string;
  mealTime: MealTime;
  requiredDate: string;
  requiredTime: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  preference: 'pickup' | 'delivery' | 'both';
  urgency: 'normal' | 'urgent';
  isRecurring?: boolean;
  recurringFrequency?: string;
  specialRequirements?: string;
  notes?: string;
  status: 'active' | 'partially_fulfilled' | 'fully_fulfilled' | 'cancelled';
  createdAt: string;
}

export interface Donation {
  id: string;
  foodListingId?: string;
  requestId?: string;
  providerId: string;
  providerName: string;
  receiverId: string;
  receiverName: string;
  foodName: string;
  offeredQuantity: number;
  quantityUnit: string;
  estimatedServings: number;
  deliveryOption: 'provider_delivery' | 'receiver_pickup';
  status: DonationStatus;
  providerPhone: string;
  receiverPhone: string;
  pickupAddress: string;
  deliveryAddress: string;
  providerLat: number;
  providerLng: number;
  receiverLat: number;
  receiverLng: number;
  estimatedTime?: string;
  deliveryNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'request' | 'donation';
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface ReviewFeedback {
  id: string;
  donationId: string;
  providerId: string;
  receiverId: string;
  receiverName: string;
  providerName: string;
  rating: number; // 1-5
  feedbackText: string;
  thankYouMessage?: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved';
  createdAt: string;
}

export interface SafetyReport {
  id: string;
  reporterId: string;
  reporterName: string;
  listingOrDonationId: string;
  reason: string;
  details: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action: string;
  details: string;
}

export interface GlobalImpactStats {
  mealsServed: number;
  foodSavedKg: number;
  activeProviders: number;
  verifiedReceivers: number;
  successfulDonations: number;
  citiesCovered: number;
}
